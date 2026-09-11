import type { RawTopic } from '../../api/generate';
import type { Card, CardKind, Topic } from '../types/deck';
import { TOPIC_HUES } from './palette';
import { shuffle, uid } from './util';

const KINDS: CardKind[] = ['core', 'detail', 'example', 'formula', 'comparison', 'application', 'misconception'];

export function toTopic(raw: RawTopic, index: number): Topic {
  const topicId = uid('t');
  return {
    id: topicId,
    title: raw.title,
    emoji: raw.emoji,
    hue: index % TOPIC_HUES.length,
    cards: raw.cards.map((c, i): Card => {
      // LLMs favour putting the right answer first: shuffle the options.
      const order = shuffle(c.quiz.options.map((_, k) => k));
      return {
        id: `${topicId}-${i}`,
        kind: (KINDS.includes(c.kind as CardKind) ? c.kind : 'detail') as CardKind,
        title: c.title,
        body: c.body,
        page: c.page,
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

