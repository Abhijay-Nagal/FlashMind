import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  FileText,
  FlaskConical,
  Hand,
  Lightbulb,
  Puzzle,
  Quote,
  RotateCcw,
  Scale,
  Sigma,
  X,
} from 'lucide-react';
import type { Card, CardKind, Topic } from '../../types/deck';
import { topicGradient } from '../../lib/palette';

const KIND_META: Record<CardKind, { label: string; icon: ReactNode }> = {
  core: { label: 'Core idea', icon: <Lightbulb size={13} /> },
  detail: { label: 'Deeper', icon: <BookOpen size={13} /> },
  example: { label: 'Example', icon: <Puzzle size={13} /> },
  formula: { label: 'Formula', icon: <Sigma size={13} /> },
  comparison: { label: 'Compare', icon: <Scale size={13} /> },
  application: { label: 'In practice', icon: <FlaskConical size={13} /> },
  misconception: { label: 'Watch out', icon: <AlertTriangle size={13} /> },
};

/** Shrinks the text (via a CSS variable) until it fits the card. */
function useFit(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let s = 1;
      el.style.setProperty('--fit', '1');
      while (s > 0.66 && el.scrollHeight > el.clientHeight + 1) {
        s = Math.round((s - 0.04) * 100) / 100;
        el.style.setProperty('--fit', String(s));
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dep]);
  return ref;
}

interface FrontProps {
  card: Card;
  topic: Topic;
  depth: number;
  hasDeeper: boolean;
  nextLabel: string;
  holdPulse: number;
  onSource: () => void;
}

export function CardFront({ card, topic, depth, hasDeeper, nextLabel, holdPulse, onSource }: FrontProps) {
  const fitRef = useFit(card.id);
  const meta = KIND_META[card.kind] ?? KIND_META.detail;
  return (
    <div className={`face front ${depth > 0 ? 'deep' : ''}`} style={{ background: topicGradient(topic.hue, depth > 0 ? 165 : 145) }}>
      <span className="face-orb o1" />
      <span className="face-orb o2" />
      <span className="face-emoji" aria-hidden="true">
        {topic.emoji}
      </span>

      <div className="face-top">
        <span className="topic-chip">
          <span aria-hidden="true">{topic.emoji}</span>
          <span className="topic-chip-text">{topic.title}</span>
        </span>
        {card.source ? (
          <button className="page-chip tappable" onClick={onSource} aria-label={`Show the passage from page ${card.page ?? ''} of your PDF`}>
            <Quote size={11} fill="currentColor" /> p.{card.page ?? '?'}
          </button>
        ) : card.page ? (
          <span className="page-chip" title="Page in your PDF">
            <FileText size={12} /> p.{card.page}
          </span>
        ) : null}
      </div>

      <div className="face-content" ref={fitRef}>
        <span className="kind-chip">
          {meta.icon} {meta.label}
          {depth > 0 && <span className="kind-depth">· level {depth + 1}</span>}
        </span>
        <h2 className="face-title">{card.title}</h2>
        <p className="face-body">{card.body}</p>
      </div>

      <div className="face-foot">
        <div className="chain" aria-label={`Card ${depth + 1} of ${topic.cards.length} in this topic`}>
          {topic.cards.map((_, i) => (
            <span key={i} className={i === depth ? 'on' : i < depth ? 'past' : ''} />
          ))}
        </div>
        <span className="foot-hint">
          {hasDeeper ? (
            <>
              <ArrowLeft size={13} /> swipe for more
            </>
          ) : (
            nextLabel
          )}
        </span>
        <motion.span key={holdPulse} className="hold-chip" animate={holdPulse ? { scale: [1, 1.18, 1], rotate: [0, -4, 4, 0] } : {}} transition={{ duration: 0.5 }}>
          <Hand size={13} /> Hold
        </motion.span>
      </div>
    </div>
  );
}

interface BackProps {
  card: Card;
  topic: Topic;
  storedPick?: number;
  onAnswer: (index: number) => void;
}

export function CardBack({ card, topic, storedPick, onAnswer }: BackProps) {
  const [pick, setPick] = useState<number | undefined>(storedPick);
  const fitRef = useFit(`${card.id}-${pick}`);
  const answered = pick !== undefined;
  const correct = pick === card.quiz.answer;

  return (
    <div className="face back">
      <span className="back-band" style={{ background: topicGradient(topic.hue, 90) }} />
      <div className="face-top">
        <span className="quiz-chip" style={{ background: topicGradient(topic.hue) }}>
          Quiz
        </span>
        <span className="back-topic">
          {topic.emoji} {topic.title}
        </span>
      </div>

      <div className="face-content" ref={fitRef}>
        <h3 className="quiz-q">{card.quiz.question}</h3>
        <div className="quiz-opts" role="radiogroup">
          {card.quiz.options.map((o, i) => {
            const state = !answered ? '' : i === card.quiz.answer ? 'right' : i === pick ? 'wrong' : 'dim';
            return (
              <motion.button
                key={i}
                className={`opt ${state}`}
                disabled={answered}
                role="radio"
                aria-checked={pick === i}
                onClick={() => {
                  if (answered) return;
                  setPick(i);
                  onAnswer(i);
                }}
                animate={state === 'wrong' ? { x: [0, -7, 7, -5, 5, 0] } : state === 'right' ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <span className="opt-letter">{'ABCD'[i]}</span>
                <span className="opt-text">{o}</span>
                {state === 'right' && <Check size={18} strokeWidth={3} className="opt-ic" />}
                {state === 'wrong' && <X size={18} strokeWidth={3} className="opt-ic" />}
              </motion.button>
            );
          })}
        </div>
        {answered && (
          <motion.div className={`quiz-feedback ${correct ? 'ok' : 'no'}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <strong>{correct ? '✨ Correct!' : 'Not quite — the answer is highlighted.'}</strong>
            {card.quiz.explanation && <p>{card.quiz.explanation}</p>}
          </motion.div>
        )}
      </div>

      <div className="face-foot back-foot">
        {answered && storedPick !== undefined && pick === storedPick ? (
          <button className="retry" onClick={() => setPick(undefined)}>
            <RotateCcw size={13} /> Try again
          </button>
        ) : (
          <span />
        )}
        <span className="foot-hint">
          <Hand size={13} /> Hold to flip back
        </span>
      </div>
    </div>
  );
}
