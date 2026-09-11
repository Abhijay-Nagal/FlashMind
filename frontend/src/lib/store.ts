import { useSyncExternalStore } from 'react';
import type { CardProgress, Deck, DeckProgress } from '../types/deck';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type ThemePref = 'system' | 'light' | 'dark';

export interface Settings {
  theme: ThemePref;
  sound: boolean;
  haptics: boolean;
  /** which vertical swipe goes to the next topic */
  nextTopicSwipe: 'down' | 'up';
  /** optional user-supplied Groq key (kept on this device only) */
  apiKey: string;
  dailyGoal: number;
  name: string;
}

export interface Stats {
  xp: number;
  streak: number;
  bestStreak: number;
  lastActiveDay: string | null;
  cardsSeen: number;
  answered: number;
  correct: number;
  combo: number;
  bestCombo: number;
  decksCreated: number;
  decksCompleted: number;
  today: { day: string; cards: number; answered: number };
  /** cards explored per day (last 30 days) */
  history: Record<string, number>;
}

export interface Flags {
  gestureTutorial: boolean;
  sampleAdded: boolean;
}

interface State {
  decks: Deck[];
  progress: Record<string, DeckProgress>;
  stats: Stats;
  settings: Settings;
  flags: Flags;
}

/* ------------------------------------------------------------------ */
/*  Persistence (localStorage, always guarded)                          */
/* ------------------------------------------------------------------ */

const KEYS = {
  decks: 'fm.decks.v2',
  progress: 'fm.progress.v2',
  stats: 'fm.stats.v2',
  settings: 'fm.settings.v2',
  flags: 'fm.flags.v2',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (fallback && typeof fallback === 'object' && !Array.isArray(fallback)) return { ...fallback, ...parsed };
    return parsed as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode: keep working in memory */
  }
}

export function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const defaultStats: Stats = {
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActiveDay: null,
  cardsSeen: 0,
  answered: 0,
  correct: 0,
  combo: 0,
  bestCombo: 0,
  decksCreated: 0,
  decksCompleted: 0,
  today: { day: dayKey(), cards: 0, answered: 0 },
  history: {},
};

const defaultSettings: Settings = {
  theme: 'system',
  sound: true,
  haptics: true,
  nextTopicSwipe: 'down',
  apiKey: '',
  dailyGoal: 20,
  name: '',
};

let state: State = {
  decks: load<Deck[]>(KEYS.decks, []),
  progress: load<Record<string, DeckProgress>>(KEYS.progress, {}),
  stats: load<Stats>(KEYS.stats, defaultStats),
  settings: load<Settings>(KEYS.settings, defaultSettings),
  flags: load<Flags>(KEYS.flags, { gestureTutorial: false, sampleAdded: false }),
};

// A deck that was mid-generation when the app closed can't resume.
state.decks = state.decks.filter((d) => !(d.generating && d.topics.length === 0)).map((d) => (d.generating ? { ...d, generating: false } : d));

const listeners = new Set<() => void>();
const dirty = new Set<keyof State>();
let saveTimer: number | undefined;

function flush() {
  saveTimer = undefined;
  for (const k of dirty) save(KEYS[k], state[k]);
  dirty.clear();
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush());
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  (Object.keys(patch) as (keyof State)[]).forEach((k) => dirty.add(k));
  if (saveTimer === undefined) saveTimer = window.setTimeout(flush, 250);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getState() {
  return state;
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state));
}

/* ------------------------------------------------------------------ */
/*  Derived helpers                                                     */
/* ------------------------------------------------------------------ */

export function levelFromXp(xp: number) {
  const level = Math.floor((1 + Math.sqrt(1 + (8 * xp) / 100)) / 2);
  const base = 50 * level * (level - 1);
  const next = 50 * (level + 1) * level;
  return { level, into: xp - base, span: next - base };
}

export function deckCardCount(d: Deck) {
  return d.topics.reduce((n, t) => n + t.cards.length, 0);
}

export function deckStats(d: Deck, p?: DeckProgress) {
  const total = deckCardCount(d);
  let seen = 0;
  let answered = 0;
  let correct = 0;
  let starred = 0;
  if (p) {
    for (const t of d.topics)
      for (const c of t.cards) {
        const cp = p.cards[c.id];
        if (!cp) continue;
        if (cp.seen) seen++;
        if (cp.picked !== undefined) answered++;
        if (cp.correct) correct++;
        if (cp.starred) starred++;
      }
  }
  return { total, seen, answered, correct, starred, pct: total ? seen / total : 0 };
}

/* ------------------------------------------------------------------ */
/*  Actions                                                             */
/* ------------------------------------------------------------------ */

function touchActivity(stats: Stats): Stats {
  const today = dayKey();
  const s = { ...stats, today: stats.today.day === today ? { ...stats.today } : { day: today, cards: 0, answered: 0 } };
  if (s.lastActiveDay !== today) {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    s.streak = s.lastActiveDay === dayKey(y) ? s.streak + 1 : 1;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
    s.lastActiveDay = today;
  }
  return s;
}

/** Streak shown on the home screen: 0 if the user missed yesterday. */
export function liveStreak(stats: Stats) {
  if (!stats.lastActiveDay) return 0;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return stats.lastActiveDay === dayKey() || stats.lastActiveDay === dayKey(y) ? stats.streak : 0;
}

export function todayCount(stats: Stats) {
  return stats.today.day === dayKey() ? stats.today.cards : 0;
}

export const actions = {
  upsertDeck(deck: Deck) {
    const exists = state.decks.some((d) => d.id === deck.id);
    set({ decks: exists ? state.decks.map((d) => (d.id === deck.id ? deck : d)) : [deck, ...state.decks] });
  },

  deleteDeck(id: string) {
    const progress = { ...state.progress };
    delete progress[id];
    set({ decks: state.decks.filter((d) => d.id !== id), progress });
  },

  updateCard(deckId: string, cardId: string, patch: Partial<CardProgress>) {
    const p = state.progress[deckId] ?? { cards: {}, position: { topic: 0, depth: 0 }, lastStudiedAt: Date.now() };
    set({
      progress: {
        ...state.progress,
        [deckId]: { ...p, lastStudiedAt: Date.now(), cards: { ...p.cards, [cardId]: { ...p.cards[cardId], ...patch } } },
      },
    });
  },

  /** returns XP gained */
  markSeen(deckId: string, cardId: string): number {
    const cp = state.progress[deckId]?.cards[cardId];
    if (cp?.seen) return 0;
    actions.updateCard(deckId, cardId, { seen: true });
    const s = touchActivity(state.stats);
    s.cardsSeen += 1;
    s.today.cards += 1;
    s.xp += 2;
    const today = dayKey();
    const history: Record<string, number> = {};
    const cutoff = dayKey(new Date(Date.now() - 30 * 864e5));
    for (const [d, n] of Object.entries(s.history ?? {})) if (d >= cutoff) history[d] = n;
    history[today] = (history[today] ?? 0) + 1;
    s.history = history;
    set({ stats: s });
    return 2;
  },

  /** records the first attempt; returns XP gained */
  answer(deckId: string, cardId: string, picked: number, correct: boolean): number {
    const cp = state.progress[deckId]?.cards[cardId];
    const first = cp?.picked === undefined;
    if (first) actions.updateCard(deckId, cardId, { picked, correct });
    const s = touchActivity(state.stats);
    s.combo = correct ? s.combo + 1 : 0;
    s.bestCombo = Math.max(s.bestCombo, s.combo);
    let gained = 0;
    if (first) {
      s.answered += 1;
      s.today.answered += 1;
      if (correct) {
        s.correct += 1;
        gained = 10 + Math.min(s.combo - 1, 5) * 2;
      }
    } else if (correct) {
      gained = 3;
    }
    s.xp += gained;
    set({ stats: s });
    return gained;
  },

  toggleStar(deckId: string, cardId: string) {
    const cp = state.progress[deckId]?.cards[cardId];
    actions.updateCard(deckId, cardId, { starred: !cp?.starred });
  },

  setPosition(deckId: string, topic: number, depth: number) {
    const p = state.progress[deckId] ?? { cards: {}, position: { topic: 0, depth: 0 }, lastStudiedAt: Date.now() };
    set({ progress: { ...state.progress, [deckId]: { ...p, position: { topic, depth }, lastStudiedAt: Date.now() } } });
  },

  markCompleted(deckId: string) {
    const p = state.progress[deckId];
    if (!p || p.completed) return;
    set({
      progress: { ...state.progress, [deckId]: { ...p, completed: true } },
      stats: { ...state.stats, decksCompleted: state.stats.decksCompleted + 1, xp: state.stats.xp + 50 },
    });
  },

  resetDeckProgress(deckId: string) {
    const progress = { ...state.progress };
    delete progress[deckId];
    set({ progress });
  },

  deckCreated() {
    set({ stats: { ...state.stats, decksCreated: state.stats.decksCreated + 1 } });
  },

  quizXp(amount: number) {
    const s = touchActivity(state.stats);
    s.xp += amount;
    set({ stats: s });
  },

  setSettings(patch: Partial<Settings>) {
    set({ settings: { ...state.settings, ...patch } });
  },

  setFlag(patch: Partial<Flags>) {
    set({ flags: { ...state.flags, ...patch } });
  },

  resetAll() {
    set({
      decks: [],
      progress: {},
      stats: { ...defaultStats, today: { day: dayKey(), cards: 0, answered: 0 }, history: {} },
      flags: { gestureTutorial: false, sampleAdded: false },
    });
  },
};
