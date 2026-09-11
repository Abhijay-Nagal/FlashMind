"""Section → topics/cards generation.

Python twin of `frontend/api/generate.ts` (same prompt, same JSON contract), so
the web app can talk to either the Vercel function or this server — e.g. one
deployed next to the institute's GPU. Point the frontend at it with
VITE_GENERATE_URL=https://<host>/api/generate.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass

import httpx

from app.core.config import settings

GROQ_BASE_URL = "https://api.groq.com/openai/v1"
GROQ_MODELS = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]

CARD_KINDS = {"core", "detail", "example", "formula", "comparison", "application", "misconception"}

SYSTEM_PROMPT = (
    "You are FlashMind, an expert teacher who turns study material into a connected deck of flashcards "
    "for university students. Use ONLY facts stated in the material - never invent facts. "
    "Write clear, friendly, precise text in the language of the material (English if unsure). "
    "Respond with a single JSON object and nothing else."
)


@dataclass
class SectionRequest:
    doc_name: str
    index: int
    total: int
    page_start: int
    page_end: int
    text: str
    topic_count: int
    min_depth: int
    max_depth: int
    want_deck_meta: bool


class GenerationError(Exception):
    def __init__(self, kind: str, message: str, status: int = 502, retry_after: float | None = None):
        super().__init__(message)
        self.kind = kind
        self.message = message
        self.status = status
        self.retry_after = retry_after


def build_messages(req: SectionRequest) -> list[dict]:
    pages = f"page {req.page_start}" if req.page_start == req.page_end else f"pages {req.page_start}-{req.page_end}"
    meta = (
        '"deckTitle": "max 6 words naming the whole document", "subject": "1-3 words", "deckEmoji": "one emoji",\n  '
        if req.want_deck_meta
        else ""
    )
    user = f"""Document: "{req.doc_name}". This is section {req.index + 1} of {req.total} ({pages}).

Create exactly {req.topic_count} topics from this section, in the order they appear in the text. A topic is one distinct concept, process, definition or idea. Together the topics must cover the WHOLE section, not just the beginning. Ignore reference lists, citations, acknowledgements, author lists and tables of contents.

Each topic is a chain of {req.min_depth} to {req.max_depth} cards (give richer topics more cards):
- Card 1 has kind "core": the essential idea of the topic, understandable on its own.
- Every following card goes DEEPER into the same topic: a key detail, how it works, an example, a formula, a comparison, an application or a common misconception. Each card builds on the previous one and never repeats it.

Card rules:
- "title": max 8 words.
- "body": 1-3 sentences, max 45 words, plain text (no markdown, no bullet symbols).
- "kind": one of core, detail, example, formula, comparison, application, misconception.
- "page": the page number the information comes from, read from the [Page N] markers.
- "quiz": one multiple-choice question that tests THIS card. "question" max 22 words. "options": exactly 4 short options (max 12 words each), one clearly correct and three plausible but wrong. "answer": index 0-3 of the correct option. "explanation": max 25 words, why the answer is right.

Return JSON in exactly this shape:
{{
  {meta}"topics": [
    {{
      "title": "short topic name",
      "emoji": "one emoji",
      "cards": [
        {{
          "title": "...",
          "body": "...",
          "kind": "core",
          "page": 1,
          "quiz": {{ "question": "...", "options": ["...", "...", "...", "..."], "answer": 0, "explanation": "..." }}
        }}
      ]
    }}
  ]
}}

Material:
\"\"\"
{req.text}
\"\"\""""
    return [{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user}]


# ─────────────────────────── normalisation ───────────────────────────

def _s(v, max_len: int = 400) -> str:
    if not isinstance(v, str):
        return ""
    v = re.sub(r"\s+", " ", v).replace("**", "")
    v = re.sub("[\u2010\u2011]", "-", v)
    return v.strip()[:max_len]


def _int(v) -> int | None:
    try:
        return int(round(float(v)))
    except (TypeError, ValueError):
        return None


def _emoji(v, fallback: str) -> str:
    if isinstance(v, str) and v.strip():
        return v.strip()[:4]
    return fallback


def _quiz(q) -> dict | None:
    if not isinstance(q, dict):
        return None
    question = _s(q.get("question"), 300)
    options = [
        _s(o.get("text") if isinstance(o, dict) else o, 160) for o in (q.get("options") or []) if o
    ]
    options = [o for o in options if o][:4]
    answer = q.get("answer", q.get("correct"))
    idx = _int(answer)
    if idx is None and isinstance(answer, str):
        idx = "abcd".find(answer.strip().lower())
    if not question or len(options) < 2 or idx is None or not 0 <= idx < len(options):
        return None
    return {"question": question, "options": options, "answer": idx, "explanation": _s(q.get("explanation"), 300)}


def _card(c) -> dict | None:
    if not isinstance(c, dict):
        return None
    title = _s(c.get("title"), 120)
    body = _s(c.get("body") or c.get("content") or c.get("text"), 600)
    quiz = _quiz(c.get("quiz") or c.get("mcq"))
    if not title or not body or not quiz:
        return None
    kind = str(c.get("kind", "")).lower()
    return {"title": title, "body": body, "kind": kind if kind in CARD_KINDS else "detail", "page": _int(c.get("page")), "quiz": quiz}


def normalize_output(data) -> dict:
    data = data if isinstance(data, dict) else {}
    topics = []
    for t in data.get("topics") or []:
        if not isinstance(t, dict):
            continue
        cards = [c for c in (_card(x) for x in t.get("cards") or []) if c]
        if not cards:
            continue
        cards[0]["kind"] = "core"
        topics.append(
            {
                "title": _s(t.get("title") or t.get("name") or t.get("topic"), 80) or cards[0]["title"],
                "emoji": _emoji(t.get("emoji"), "📘"),
                "cards": cards[:6],
            }
        )
    return {
        "deckTitle": _s(data.get("deckTitle") or data.get("title"), 80) or None,
        "subject": _s(data.get("subject"), 40) or None,
        "emoji": _emoji(data.get("deckEmoji") or data.get("emoji"), "📚"),
        "topics": topics,
    }


def _parse_json_loose(content: str):
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start, end = content.find("{"), content.rfind("}")
        if start >= 0 and end > start:
            return json.loads(content[start : end + 1])
        raise


def _retry_after(res: httpx.Response) -> float:
    header = res.headers.get("retry-after")
    if header:
        try:
            return max(1.0, float(header))
        except ValueError:
            pass
    m = re.search(r"try again in (?:(\d+)m)?([\d.]+)s", res.text, re.I)
    if m:
        return max(1.0, (int(m.group(1)) * 60 if m.group(1) else 0) + float(m.group(2)))
    return 10.0


# ─────────────────────────── provider call ───────────────────────────

async def generate_section(req: SectionRequest, api_key: str | None = None, base_url: str | None = None, models: list[str] | None = None) -> dict:
    key = api_key or settings.api_key
    if not key:
        raise GenerationError("no_api_key", "No AI key configured on the server.", status=401)
    base = (base_url or settings.llm_base_url).rstrip("/")
    card_budget = req.topic_count * req.max_depth
    max_tokens = min(5000, 500 + card_budget * 190)
    messages = build_messages(req)
    shortest_wait: float | None = None
    last = GenerationError("provider_error", "No model available")

    async with httpx.AsyncClient(timeout=settings.llm_timeout_seconds) as client:
        for model in models or settings.models:
            body = {
                "model": model,
                "messages": messages,
                "temperature": 0.4,
                "max_completion_tokens": max_tokens,
                "response_format": {"type": "json_object"},
            }
            if "gpt-oss" in model:
                body["reasoning_effort"] = "low"
            try:
                res = await client.post(f"{base}/chat/completions", json=body, headers={"Authorization": f"Bearer {key}"})
            except httpx.HTTPError as e:
                last = GenerationError("provider_error", f"Could not reach the AI provider ({e})")
                continue

            if res.status_code in (401, 403):
                raise GenerationError("no_api_key", "The AI provider rejected the API key.", status=401)
            if res.status_code == 429:
                wait = _retry_after(res)
                shortest_wait = wait if shortest_wait is None else min(shortest_wait, wait)
                last = GenerationError("rate_limited", "The AI is busy, retrying shortly.", status=429, retry_after=shortest_wait)
                continue
            if res.status_code >= 400:
                last = GenerationError("provider_error", f"Provider error {res.status_code}: {res.text[:200]}")
                continue
            try:
                content = res.json()["choices"][0]["message"]["content"] or ""
                out = normalize_output(_parse_json_loose(content))
                if not out["topics"]:
                    raise ValueError("No usable cards in output")
                out["model"] = model
                return {k: v for k, v in out.items() if v is not None}
            except (ValueError, KeyError, IndexError, json.JSONDecodeError) as e:
                last = GenerationError("bad_output", str(e))
                continue

    raise last
