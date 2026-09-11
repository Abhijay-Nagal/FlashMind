import type { RawTopic } from '../../api/generate';
import type { Card, CardKind, Topic } from '../types/deck';
import { TOPIC_HUES } from './palette';
import { shuffle, uid } from './util';
import { findSource } from './source';

const KINDS: CardKind[] = ['core', 'detail', 'example', 'formula', 'comparison', 'application', 'misconception'];

export interface SourceContext {
  pages: string[];
  range: [number, number];
}

export function toTopic(raw: RawTopic, index: number, ctx?: SourceContext): Topic {
  const topicId = uid('t');
  return {
    id: topicId,
    title: raw.title,
    emoji: raw.emoji,
    hue: index % TOPIC_HUES.length,
    cards: raw.cards.map((c, i): Card => {
      // LLMs favour putting the right answer first: shuffle the options.
      const order = shuffle(c.quiz.options.map((_, k) => k));
      const hit = ctx ? findSource(ctx.pages, c.page, ctx.range, c.title, c.body) : null;
      return {
        id: `${topicId}-${i}`,
        kind: (KINDS.includes(c.kind as CardKind) ? c.kind : 'detail') as CardKind,
        title: c.title,
        body: c.body,
        page: hit?.page ?? c.page,
        source: hit?.text,
        quiz: {
          question: c.quiz.question,
          options: order.map((k) => c.quiz.options[k]),
          answer: order.indexOf(c.quiz.answer),
          explanation: c.quiz.explanation,
        },
      };
    }),
  };
}

