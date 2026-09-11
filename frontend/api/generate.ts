/**
 * FlashMind generation endpoint  —  POST /api/generate
 *
 * Deployed as a Vercel Serverless Function (this file lives in `frontend/api/`)
 * and served locally by the dev middleware in `vite.config.ts`.
 *
 * It turns ONE section of a PDF's text into a chain of topics + cards.
 * The browser splits the PDF into sections and calls this once per section,
 * so every request stays small and fast (and fits provider rate limits).
 *
 * ── LLM provider ───────────────────────────────────────────────────────────
 * Any OpenAI-compatible Chat Completions API works. Today that is Groq; to move
 * to the institute's own GPU server (vLLM / TGI / Ollama / LM Studio all speak
 * the same protocol) only environment variables change:
 *
 *   LLM_BASE_URL   default https://api.groq.com/openai/v1
 *   LLM_API_KEY    (falls back to GROQ_API_KEY)
 *   LLM_MODELS     comma-separated, tried in order when one is rate limited
 *
 * This file is also imported by the browser (see src/lib/llmClient.ts) so the
 * app can call the provider directly with a user-supplied key when no server is
 * available. Keep it free of Node-only imports.
 */

// ───────────────────────────── contract ─────────────────────────────

export interface GenerateRequest {
  docName: string;
  section: { index: number; total: number; pageStart: number; pageEnd: number };
  /** section text with [Page N] markers */
  text: string;
  topicCount: number;
  minDepth: number;
  maxDepth: number;
  /** ask for deck title / subject / emoji (first section only) */
  wantDeckMeta: boolean;
}

export interface RawQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface RawCard {
  title: string;
  body: string;
  kind: string;
  page: number | null;
  quiz: RawQuiz;
}

export interface RawTopic {
  title: string;
  emoji: string;
  cards: RawCard[];
}

export interface GenerateResponse {
  deckTitle?: string;
  subject?: string;
  emoji?: string;
  topics: RawTopic[];
  model: string;
}

export interface GenerateError {
  error: 'rate_limited' | 'no_api_key' | 'bad_request' | 'provider_error' | 'bad_output';
  message: string;
  /** seconds, for rate_limited */
  retryAfter?: number;
}

export const DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1';
export const DEFAULT_MODELS = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

const CARD_KINDS = ['core', 'detail', 'example', 'formula', 'comparison', 'application', 'misconception'];

// ───────────────────────────── prompt ─────────────────────────────

const SYSTEM_PROMPT =
  'You are FlashMind, an expert teacher who turns study material into a connected deck of flashcards ' +
  'for university students. Use ONLY facts stated in the material - never invent facts. ' +
  'Write clear, friendly, precise English. Respond with a single JSON object and nothing else.';

export function buildMessages(req: GenerateRequest) {
  const { section } = req;
  const pages =
    section.pageStart === section.pageEnd ? `page ${section.pageStart}` : `pages ${section.pageStart}-${section.pageEnd}`;
  const meta = req.wantDeckMeta
    ? '"deckTitle": "max 6 words naming the whole document", "subject": "1-3 words", "deckEmoji": "one emoji",\n  '
    : '';

  const user = `Document: "${req.docName}". This is section ${section.index + 1} of ${section.total} (${pages}).

Create exactly ${req.topicCount} topics from this section, in the order they appear in the text. A topic is one distinct concept, process, definition or idea. Together the topics must cover the WHOLE section, not just the beginning.

Each topic is a chain of ${req.minDepth} to ${req.maxDepth} cards (give richer topics more cards):
- Card 1 has kind "core": the essential idea of the topic, understandable on its own.
- Every following card goes DEEPER into the same topic: a key detail, how it works, an example, a formula, a comparison, an application or a common misconception. Each card builds on the previous one and never repeats it.

Card rules:
- "title": max 8 words.
- "body": 1-3 sentences, max 45 words, plain text (no markdown, no bullet symbols).
- "kind": one of core, detail, example, formula, comparison, application, misconception.
- "page": the page number the information comes from, read from the [Page N] markers.
- "quiz": one multiple-choice question that tests THIS card. "question" max 22 words. "options": exactly 4 short options (max 12 words each), one clearly correct and three plausible but wrong. "answer": index 0-3 of the correct option. "explanation": max 25 words, why the answer is right.

Return JSON in exactly this shape:
{
  ${meta}"topics": [
    {
      "title": "short topic name",
      "emoji": "one emoji",
      "cards": [
        {
          "title": "...",
          "body": "...",
          "kind": "core",
          "page": 1,
          "quiz": { "question": "...", "options": ["...", "...", "...", "..."], "answer": 0, "explanation": "..." }
        }
      ]
    }
  ]
}

Material:
"""
${req.text}
"""`;

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: user },
  ];
}

// ───────────────────────────── normalisation ─────────────────────────────

function str(v: unknown, max = 400): string {
  if (typeof v !== 'string') return '';
  return v
    .replace(/\s+/g, ' ')
    .replace(/\*\*/g, '')
    .replace(/[‐‑]/g, '-') // non-breaking hyphens are missing from many fonts
    .trim()
    .slice(0, max);
}

function firstEmoji(v: unknown, fallback: string): string {
  if (typeof v !== 'string') return fallback;
  const m = v.match(/\p{Extended_Pictographic}(️|‍\p{Extended_Pictographic})*/u);
  return m ? m[0] : fallback;
}

function toInt(v: unknown): number | null {
  const n = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? Math.round(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

function normQuiz(q: unknown): RawQuiz | null {
  if (!q || typeof q !== 'object') return null;
  const o = q as Record<string, unknown>;
  const question = str(o.question, 300);
  const rawOptions = Array.isArray(o.options) ? o.options : [];
  const options = rawOptions
    .map((x) => (typeof x === 'string' ? x : x && typeof x === 'object' ? (x as Record<string, unknown>).text : ''))
    .map((x) => str(x, 160))
    .filter(Boolean);
  let answer = toInt(o.answer ?? o.correct ?? o.answerIndex);
  if (answer === null && typeof o.answer === 'string') {
    // tolerate "b" / "B"
    const idx = 'abcd'.indexOf(o.answer.trim().toLowerCase());
    answer = idx >= 0 ? idx : null;
  }
  if (!question || options.length < 2 || answer === null || answer < 0 || answer >= options.length) return null;
  return { question, options: options.slice(0, 4), answer: Math.min(answer, 3), explanation: str(o.explanation, 300) };
}

function normCard(c: unknown): RawCard | null {
  if (!c || typeof c !== 'object') return null;
  const o = c as Record<string, unknown>;
  const title = str(o.title, 120);
  const body = str(o.body ?? o.content ?? o.text, 600);
  const quiz = normQuiz(o.quiz ?? o.mcq);
  if (!title || !body || !quiz) return null;
  const kind = typeof o.kind === 'string' && CARD_KINDS.includes(o.kind.toLowerCase()) ? o.kind.toLowerCase() : 'detail';
  return { title, body, kind, page: toInt(o.page), quiz };
}

/** Lenient: accepts slightly different key names and drops broken cards. */
export function normalizeOutput(data: unknown): Omit<GenerateResponse, 'model'> {
  const o = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  const rawTopics = Array.isArray(o.topics) ? o.topics : [];
  const topics: RawTopic[] = [];
  for (const t of rawTopics) {
    if (!t || typeof t !== 'object') continue;
    const to = t as Record<string, unknown>;
    const cards = (Array.isArray(to.cards) ? to.cards : []).map(normCard).filter((c): c is RawCard => !!c);
    if (!cards.length) continue;
    cards[0].kind = 'core';
    topics.push({
      title: str(to.title ?? to.name ?? to.topic, 80) || cards[0].title,
      emoji: firstEmoji(to.emoji, '📘'),
      cards: cards.slice(0, 6),
    });
  }
  return {
    deckTitle: str(o.deckTitle ?? o.title, 80) || undefined,
    subject: str(o.subject, 40) || undefined,
    emoji: firstEmoji(o.deckEmoji ?? o.emoji, '📚'),
    topics,
  };
}

/** Parse model output; tolerates ```json fences and text around the object. */
export function parseJsonLoose(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(content.slice(start, end + 1));
    throw new Error('Model did not return JSON');
  }
}

// ───────────────────────────── provider call ─────────────────────────────

export interface ProviderConfig {
  baseUrl: string;
  apiKey: string;
  models: string[];
}

type CallResult = { ok: true; data: GenerateResponse } | { ok: false; status: number; error: GenerateError };

function parseRetryAfter(res: Response, body: string): number {
  const header = res.headers.get('retry-after');
  if (header && !isNaN(Number(header))) return Math.max(1, Number(header));
  // Groq: "Please try again in 7.53s" / "in 1m2.5s"
  const m = body.match(/try again in (?:(\d+)m)?([\d.]+)s/i);
  if (m) return Math.max(1, (m[1] ? Number(m[1]) * 60 : 0) + Number(m[2]));
  return 10;
}

/**
 * Calls the provider, walking the model list when a model is rate limited,
 * unavailable, or returns unusable output.
 */
export async function generateSection(req: GenerateRequest, cfg: ProviderConfig): Promise<CallResult> {
  const cardBudget = req.topicCount * req.maxDepth;
  const maxTokens = Math.min(5000, 500 + cardBudget * 190);
  const messages = buildMessages(req);
  let shortestWait = Infinity;
  let lastError: GenerateError = { error: 'provider_error', message: 'No model available' };

  for (const model of cfg.models) {
    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: 0.4,
      max_completion_tokens: maxTokens,
      response_format: { type: 'json_object' },
    };
    if (model.includes('gpt-oss')) body.reasoning_effort = 'low';

    let res: Response;
    try {
      res = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      lastError = { error: 'provider_error', message: `Could not reach the AI provider (${(e as Error).message})` };
      continue;
    }

    const text = await res.text();
    if (res.status === 401 || res.status === 403) {
      return { ok: false, status: 401, error: { error: 'no_api_key', message: 'The AI provider rejected the API key.' } };
    }
    if (res.status === 429) {
      shortestWait = Math.min(shortestWait, parseRetryAfter(res, text));
      lastError = { error: 'rate_limited', message: 'The AI is busy, retrying shortly.', retryAfter: shortestWait };
      continue;
    }
    if (!res.ok) {
      // 404 model gone, 400 json_validate_failed, 413 too large, 5xx … try the next model
      lastError = { error: 'provider_error', message: `Provider error ${res.status}: ${text.slice(0, 200)}` };
      continue;
    }

    try {
      const json = JSON.parse(text);
      const content: string = json?.choices?.[0]?.message?.content ?? '';
      const out = normalizeOutput(parseJsonLoose(content));
      if (!out.topics.length) throw new Error('No usable cards in output');
      return { ok: true, data: { ...out, model } };
    } catch (e) {
      lastError = { error: 'bad_output', message: (e as Error).message };
      continue;
    }
  }

  if (lastError.error === 'rate_limited') return { ok: false, status: 429, error: lastError };
  return { ok: false, status: 502, error: lastError };
}

export function validateRequest(b: unknown): GenerateRequest | null {
  if (!b || typeof b !== 'object') return null;
  const o = b as Record<string, unknown>;
  const s = (o.section ?? {}) as Record<string, unknown>;
  const text = typeof o.text === 'string' ? o.text.slice(0, 16000) : '';
  if (text.trim().length < 40) return null;
  const clamp = (v: unknown, lo: number, hi: number, d: number) => {
    const n = toInt(v);
    return n === null ? d : Math.max(lo, Math.min(hi, n));
  };
  const minDepth = clamp(o.minDepth, 1, 5, 2);
  return {
    docName: str(o.docName, 120) || 'document.pdf',
    section: {
      index: clamp(s.index, 0, 500, 0),
      total: clamp(s.total, 1, 500, 1),
      pageStart: clamp(s.pageStart, 1, 100000, 1),
      pageEnd: clamp(s.pageEnd, 1, 100000, 1),
    },
    text,
    topicCount: clamp(o.topicCount, 1, 8, 3),
    minDepth,
    maxDepth: clamp(o.maxDepth, minDepth, 6, 4),
    wantDeckMeta: o.wantDeckMeta === true,
  };
}

// ───────────────────────────── HTTP handler ─────────────────────────────

// Minimal structural types so this file needs neither @types/node nor @vercel/node.
interface Req {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  on(event: string, cb: (chunk?: unknown) => void): void;
}
interface Res {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
}

function readEnv(): Record<string, string | undefined> {
  return (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
}

function readBody(req: Req): Promise<unknown> {
  // Vercel pre-parses JSON into req.body; the raw Node server (vite dev) does not.
  try {
    if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
    if (typeof req.body === 'string') return Promise.resolve(JSON.parse(req.body));
  } catch {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    let raw = '';
    const dec = new TextDecoder();
    req.on('data', (c) => (raw += typeof c === 'string' ? c : dec.decode(c as Uint8Array, { stream: true })));
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

function send(res: Res, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

export default async function handler(req: Req, res: Res) {
  const env = readEnv();
  const serverKey = env.LLM_API_KEY || env.GROQ_API_KEY || '';
  const models = (env.LLM_MODELS || '').split(',').map((m) => m.trim()).filter(Boolean);
  const baseUrl = env.LLM_BASE_URL || DEFAULT_BASE_URL;

  if (req.method === 'GET') {
    return send(res, 200, { ok: true, serverKey: !!serverKey, provider: new URL(baseUrl).host });
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'bad_request', message: 'Use POST' });

  // A user may bring their own key (Settings → AI key). It is only forwarded to the provider.
  const headerKey = req.headers['x-llm-key'];
  const userKey = (Array.isArray(headerKey) ? headerKey[0] : headerKey) || '';
  const apiKey = userKey || serverKey;
  if (!apiKey) {
    return send(res, 401, { error: 'no_api_key', message: 'No AI key configured on the server.' } satisfies GenerateError);
  }

  const parsed = validateRequest(await readBody(req));
  if (!parsed) return send(res, 400, { error: 'bad_request', message: 'Invalid request body' } satisfies GenerateError);

  const result = await generateSection(parsed, {
    baseUrl: userKey ? DEFAULT_BASE_URL : baseUrl,
    apiKey,
    models: models.length && !userKey ? models : DEFAULT_MODELS,
  });
  if (result.ok) return send(res, 200, result.data);
  if (result.error.retryAfter) res.setHeader('Retry-After', String(Math.ceil(result.error.retryAfter)));
  return send(res, result.status, result.error);
}
