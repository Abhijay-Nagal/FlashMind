import { useSyncExternalStore } from 'react';
import type { GenerateResponse } from '../../api/generate';
import type { Deck } from '../types/deck';
import { toTopic } from './deckBuild';
import { GenError, requestSection } from './llmClient';
import { PdfError } from './pdf';
import { planDeck, type Density, type Plan } from './planner';
import { actions, getState } from './store';
import { prettyFileName, sleep, uid } from './util';

/**
 * One generation job at a time, kept outside React so it survives navigation.
 * Sections are requested with limited concurrency but appended to the deck
 * strictly in document order, so a learner can start studying the first
 * topics while later ones are still being written.
 */

export type GenPhase = 'reading' | 'planning' | 'writing' | 'done' | 'error' | 'cancelled';

export interface GenJob {
  id: string;
  fileName: string;
  phase: GenPhase;
  pagesRead: number;
  pageCount: number;
  sectionsDone: number;
  sectionsTotal: number;
  cardsDone: number;
  cardsTarget: number;
  preview: { title: string; emoji: string; hue: number; cards: number }[];
  deckId: string | null;
  /** seconds until the rate-limit cooldown ends */
  cooldown: number;
  error?: { kind: string; message: string };
  startedAt: number;
}

let job: GenJob | null = null;
let controller: AbortController | null = null;
const listeners = new Set<() => void>();

function emit(patch: Partial<GenJob>) {
  if (!job) return;
  job = { ...job, ...patch };
  listeners.forEach((l) => l());
}

export function useGenJob() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => job,
  );
}

export function getGenJob() {
  return job;
}

export function dismissJob() {
  if (job && (job.phase === 'writing' || job.phase === 'reading' || job.phase === 'planning')) return;
  job = null;
  listeners.forEach((l) => l());
}

export function cancelGeneration() {
  controller?.abort();
}

export interface PdfSource {
  fileName: string;
  pages: string[];
  words: number;
  title?: string;
}

export async function startGeneration(src: PdfSource, density: Density): Promise<void> {
  if (job && (job.phase === 'reading' || job.phase === 'planning' || job.phase === 'writing')) return;
  controller = new AbortController();
  const signal = controller.signal;
  job = {
    id: uid('job'),
    fileName: src.fileName,
    phase: 'planning',
    pagesRead: src.pages.length,
    pageCount: src.pages.length,
    sectionsDone: 0,
    sectionsTotal: 0,
    cardsDone: 0,
    cardsTarget: 0,
    preview: [],
    deckId: null,
    cooldown: 0,
    startedAt: Date.now(),
  };
  listeners.forEach((l) => l());

  let deck: Deck | null = null;
  try {
    const plan: Plan = planDeck(src.pages, src.words, density);
    emit({ sectionsTotal: plan.sections.length, cardsTarget: plan.targetCards });

    deck = {
      id: uid('d'),
      title: src.title && src.title.length < 60 ? src.title : prettyFileName(src.fileName),
      subject: '',
      emoji: '📚',
      sourceName: src.fileName,
      pageCount: src.pages.length,
      createdAt: Date.now(),
      generating: true,
      topics: [],
    };
    emit({ phase: 'writing', deckId: deck.id });

    const results: (GenerateResponse | null | undefined)[] = new Array(plan.sections.length).fill(undefined);
    let appended = 0;

    const flushInOrder = () => {
      while (appended < results.length && results[appended] !== undefined) {
        const r = results[appended];
        if (r && deck) {
          if (appended === 0 || (!deck.subject && r.subject)) {
            if (r.deckTitle) deck.title = r.deckTitle;
            if (r.subject) deck.subject = r.subject;
            if (r.emoji) deck.emoji = r.emoji;
          }
          const start = deck.topics.length;
          const sec = plan.sections[appended];
          const topics = r.topics.map((t, i) => toTopic(t, start + i, { pages: src.pages, range: [sec.pageStart, sec.pageEnd] }));
          deck = { ...deck, topics: [...deck.topics, ...topics] };
          actions.upsertDeck(deck);
          emit({
            preview: [...(job?.preview ?? []), ...topics.map((t) => ({ title: t.title, emoji: t.emoji, hue: t.hue, cards: t.cards.length }))],
            cardsDone: (job?.cardsDone ?? 0) + topics.reduce((n, t) => n + t.cards.length, 0),
          });
        }
        appended++;
      }
    };

    const runSection = async (i: number) => {
      const s = plan.sections[i];
      let attempts = 0;
      let rateLimitWaits = 0;
      for (;;) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        try {
          const res = await requestSection(
            {
              docName: src.fileName,
              section: { index: i, total: plan.sections.length, pageStart: s.pageStart, pageEnd: s.pageEnd },
              text: s.text,
              topicCount: s.topicCount,
              minDepth: plan.minDepth,
              maxDepth: plan.maxDepth,
              wantDeckMeta: i === 0,
            },
            signal,
          );
          return res;
        } catch (e) {
          if ((e as Error).name === 'AbortError') throw e;
          const err = e instanceof GenError ? e : new GenError('network', (e as Error).message);
          if (err.kind === 'no_api_key' || err.kind === 'no_server' || !navigator.onLine) throw err;
          if (err.kind === 'rate_limited' && rateLimitWaits < 8) {
            rateLimitWaits++;
            const wait = Math.min(60, Math.ceil(err.retryAfter ?? 10) + 1);
            for (let t = wait; t > 0; t--) {
              emit({ cooldown: t });
              await sleep(1000, signal);
            }
            emit({ cooldown: 0 });
            continue;
          }
          attempts++;
          if (attempts >= 3) return null; // give up on this section, keep the rest
          await sleep(1500 * attempts, signal);
        }
      }
    };

    // Two workers: requests overlap, results are appended in order.
    let next = 0;
    let fatal: unknown = null;
    const worker = async () => {
      while (next < plan.sections.length && !fatal) {
        const i = next++;
        try {
          results[i] = await runSection(i);
        } catch (e) {
          fatal = fatal ?? e;
          controller?.abort();
          return;
        }
        emit({ sectionsDone: results.filter((r) => r !== undefined).length });
        flushInOrder();
      }
    };
    await Promise.all([worker(), worker()]);
    if (fatal && (fatal as Error).name !== 'AbortError') throw fatal;
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

    const finalDeck = deck as Deck;
    if (!finalDeck.topics.length) throw new GenError('bad_output', 'The AI could not produce cards from this PDF. Please try again.');
    deck = { ...finalDeck, generating: false };
    actions.upsertDeck(deck);
    actions.deckCreated();
    emit({ phase: 'done', cooldown: 0 });
  } catch (e) {
    const current = deck as Deck | null;
    if (current && current.topics.length) {
      // keep what was generated so far
      actions.upsertDeck({ ...current, generating: false });
    } else if (current) {
      actions.deleteDeck(current.id);
    }
    if ((e as Error).name === 'AbortError') {
      emit({ phase: 'cancelled', cooldown: 0, deckId: current && current.topics.length ? current.id : null });
      return;
    }
    let kind = 'unknown';
    let message = 'Something went wrong while creating your cards. Please try again.';
    if (e instanceof PdfError) {
      kind = e.kind;
      message = e.message;
    } else if (e instanceof GenError) {
      kind = e.kind;
      message =
        e.kind === 'no_api_key' || e.kind === 'no_server'
          ? getState().settings.apiKey
            ? 'Your AI key was rejected. Check it in Settings → AI engine.'
            : 'The AI engine is not configured yet. Add a free Groq API key in Settings → AI engine.'
          : e.message;
    }
    emit({
      phase: 'error',
      cooldown: 0,
      error: { kind, message },
      deckId: current && current.topics.length ? current.id : null,
    });
  }
}
