/**
 * Core data model.
 *
 * A Deck is generated from one PDF. It is a 2-D structure:
 *  - topics[] run in the order they appear in the PDF   → swipe to the NEXT topic
 *  - topic.cards[] is a chain that goes deeper into it   → swipe LEFT for more depth
 * cards[0] is always the "core" card of the topic.
 */

export type CardKind =
  | 'core'
  | 'detail'
  | 'example'
  | 'formula'
  | 'comparison'
  | 'application'
  | 'misconception';

export interface Quiz {
  question: string;
  options: string[]; // always 4
  answer: number; // index into options
  explanation: string;
}

export interface Card {
  id: string;
  kind: CardKind;
  title: string;
  body: string;
  page: number | null; // page in the source PDF
  /** the passage of the PDF this card was written from */
  source?: string;
  quiz: Quiz;
}

export interface Topic {
  id: string;
  title: string;
  emoji: string;
  hue: number; // index into the topic colour palette
  cards: Card[];
}

export interface Deck {
  id: string;
  title: string;
  subject: string;
  emoji: string;
  sourceName: string;
  pageCount: number;
  createdAt: number;
  isSample?: boolean;
  /** true while the generator is still appending topics */
  generating?: boolean;
  topics: Topic[];
}

export interface CardProgress {
  seen?: boolean;
  /** index of the option picked on the first attempt */
  picked?: number;
  correct?: boolean;
  starred?: boolean;
}

export interface DeckProgress {
  /** keyed by card id */
  cards: Record<string, CardProgress>;
  position: { topic: number; depth: number };
  lastStudiedAt: number;
  completed?: boolean;
}
