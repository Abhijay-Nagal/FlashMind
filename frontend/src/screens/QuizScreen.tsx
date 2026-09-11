import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight, RotateCcw, X } from 'lucide-react';
import { actions, getState, useStore } from '../lib/store';
import { shuffle } from '../lib/util';
import { topicGradient } from '../lib/palette';
import { haptic, sfx } from '../lib/feedback';
import { burst, celebrate } from '../lib/confetti';
import { useBackHandler } from '../lib/backHandler';
import { Mascot } from '../components/mascot/Mascot';
import { ProgressRing } from '../components/common/ProgressRing';
import type { Card, Topic } from '../types/deck';

interface Props {
  deckId: string;
  mode: 'mix' | 'mistakes' | 'starred';
  onExit: () => void;
}

interface Q {
  card: Card;
  topic: Topic;
}

function buildPool(deckId: string, mode: Props['mode']): Q[] {
  const s = getState();
  const deck = s.decks.find((d) => d.id === deckId);
  const prog = s.progress[deckId];
  if (!deck) return [];
  const all: Q[] = deck.topics.flatMap((t) => t.cards.map((c) => ({ card: c, topic: t })));
  if (mode === 'mistakes') return shuffle(all.filter((q) => prog?.cards[q.card.id]?.picked !== undefined && !prog.cards[q.card.id].correct));
  if (mode === 'starred') return shuffle(all.filter((q) => prog?.cards[q.card.id]?.starred));
  return shuffle(all).slice(0, 10);
}

const TITLES = { mix: 'Quick quiz', mistakes: 'Review mistakes', starred: 'Starred cards' };

export function QuizScreen({ deckId, mode, onExit }: Props) {
  const deck = useStore((s) => s.decks.find((d) => d.id === deckId));
  const [pool, setPool] = useState<Q[]>(() => buildPool(deckId, mode));
  const [index, setIndex] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [xp, setXp] = useState(0);
  const advancing = useRef(false);
  useBackHandler(true, onExit);

  const done = index >= pool.length;
  const q = pool[index];

  const answer = (i: number) => {
    if (pick !== null || !q) return;
    setPick(i);
    const correct = i === q.card.quiz.answer;
    const gained = actions.answer(deckId, q.card.id, i, correct);
    if (correct && mode === 'mistakes') actions.updateCard(deckId, q.card.id, { correct: true, picked: i });
    setXp((x) => x + gained);
    setResults((r) => [...r, correct]);
    if (correct) {
      sfx.correct();
      haptic([12, 40, 18]);
      burst(0.5, 0.6, 40);
    } else {
      sfx.wrong();
      haptic([30, 50, 30]);
    }
  };

  const next = () => {
    if (advancing.current || pick === null) return;
    advancing.current = true;
    window.setTimeout(() => (advancing.current = false), 350);
    setPick(null);
    setIndex((i) => i + 1);
    if (index + 1 >= pool.length) {
      const score = [...results].filter(Boolean).length / Math.max(pool.length, 1);
      if (score >= 0.7) {
        celebrate();
        sfx.win();
      }
      actions.quizXp(5);
    }
  };

  const retryWrong = () => {
    const wrong = pool.filter((_, i) => !results[i]);
    setPool(shuffle(wrong));
    setIndex(0);
    setPick(null);
    setResults([]);
  };

  if (!deck) return null;

  if (!pool.length) {
    return (
      <div className="quiz">
        <QuizTop title={TITLES[mode]} onExit={onExit} progress={0} label="" />
        <div className="quiz-empty">
          <Mascot mood="happy" size={110} />
          <h2>Nothing to review!</h2>
          <p className="muted">{mode === 'mistakes' ? 'You have no wrong answers in this deck. Impressive.' : 'Star cards while studying to review them here.'}</p>
          <button className="btn btn-primary" onClick={onExit}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    const correct = results.filter(Boolean).length;
    const score = correct / pool.length;
    const mood = score >= 0.8 ? 'laugh' : score >= 0.5 ? 'happy' : 'sad';
    const msg = score === 1 ? 'Perfect score! 🏆' : score >= 0.8 ? 'Excellent work!' : score >= 0.5 ? 'Good effort — keep going!' : 'A little more practice and you’ll have it.';
    return (
      <div className="quiz">
        <QuizTop title={TITLES[mode]} onExit={onExit} progress={1} label="" />
        <motion.div className="quiz-result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Mascot mood={mood} size={120} />
          <ProgressRing value={score} size={120} stroke={10} color={score >= 0.5 ? 'var(--mint)' : 'var(--danger)'}>
            <div>
              <strong style={{ fontSize: 30, fontFamily: 'var(--font-display)' }}>
                {correct}/{pool.length}
              </strong>
            </div>
          </ProgressRing>
          <h2>{msg}</h2>
          <p className="muted">+{xp + 5} XP earned</p>
          <div className="quiz-result-actions">
            {correct < pool.length && (
              <button className="btn btn-soft btn-block" onClick={retryWrong}>
                <RotateCcw size={18} /> Retry the {pool.length - correct} I missed
              </button>
            )}
            <button className="btn btn-primary btn-block" onClick={onExit}>
              Done
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const correct = pick !== null && pick === q.card.quiz.answer;

  return (
    <div className="quiz">
      <QuizTop title={TITLES[mode]} onExit={onExit} progress={index / pool.length} label={`${index + 1}/${pool.length}`} />
      <div className="quiz-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.card.id + index}
            className="quiz-card card-surface"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <span className="quiz-topic" style={{ background: topicGradient(q.topic.hue) }}>
              {q.topic.emoji} {q.topic.title}
            </span>
            <h2 className="quiz-question">{q.card.quiz.question}</h2>
            <div className="quiz-opts">
              {q.card.quiz.options.map((o, i) => {
                const state = pick === null ? '' : i === q.card.quiz.answer ? 'right' : i === pick ? 'wrong' : 'dim';
                return (
                  <motion.button
                    key={i}
                    className={`opt ${state}`}
                    onClick={() => answer(i)}
                    disabled={pick !== null}
                    animate={state === 'wrong' ? { x: [0, -7, 7, -5, 5, 0] } : {}}
                  >
                    <span className="opt-letter">{'ABCD'[i]}</span>
                    <span className="opt-text">{o}</span>
                    {state === 'right' && <Check size={18} strokeWidth={3} className="opt-ic" />}
                    {state === 'wrong' && <X size={18} strokeWidth={3} className="opt-ic" />}
                  </motion.button>
                );
              })}
            </div>
            {pick !== null && (
              <motion.div className={`quiz-feedback ${correct ? 'ok' : 'no'}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <strong>{correct ? '✨ Correct!' : 'Not quite.'}</strong>
                <p>{q.card.quiz.explanation || q.card.body}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="quiz-bottom">
        <button className="btn btn-primary btn-block" disabled={pick === null} onClick={next}>
          {index + 1 >= pool.length ? 'See results' : 'Next question'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function QuizTop({ title, onExit, progress, label }: { title: string; onExit: () => void; progress: number; label: string }) {
  return (
    <header className="quiz-top">
      <button className="icon-btn" onClick={onExit} aria-label="Close quiz">
        <X size={20} />
      </button>
      <div className="quiz-progress">
        <div className="quiz-progress-head">
          <strong>{title}</strong>
          <span>{label}</span>
        </div>
        <div className="gen-bar">
          <motion.span animate={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </header>
  );
}
