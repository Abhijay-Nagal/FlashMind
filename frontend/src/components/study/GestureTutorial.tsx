import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hand } from 'lucide-react';
import { Mascot, type Mood } from '../mascot/Mascot';
import type { Dir } from './SwipeCard';

interface Props {
  nextDir: Dir;
  onDone: () => void;
}

/** First-run coach marks that demonstrate the three gestures. */
export function GestureTutorial({ nextDir, onDone }: Props) {
  const [step, setStep] = useState(0);
  const down = nextDir === 'down';

  const steps: { title: string; text: string; mood: Mood; hand: Record<string, number[]>; card: Record<string, number[]> }[] = [
    {
      title: `Swipe ${down ? 'down' : 'up'} → next topic`,
      text: 'Topics follow the order of your PDF, so you move through it like a guided tour.',
      mood: 'wave',
      hand: { y: down ? [-50, 60, 60] : [60, -50, -50], opacity: [0, 1, 0] },
      card: { y: down ? [0, 70, 0] : [0, -70, 0], rotate: [0, down ? -3 : 3, 0] },
    },
    {
      title: 'Swipe left → go deeper',
      text: 'Want more on the current topic? Each swipe left reveals the next card in its chain: details, examples, pitfalls.',
      mood: 'wow',
      hand: { x: [60, -60, -60], opacity: [0, 1, 0] },
      card: { x: [0, -80, 0], rotate: [0, -6, 0] },
    },
    {
      title: 'Press & hold → quiz',
      text: 'Hold any card to flip it and test yourself with a multiple-choice question.',
      mood: 'happy',
      hand: { scale: [1, 0.8, 0.8, 1], opacity: [0, 1, 1, 0] },
      card: { rotateY: [0, 0, 180, 180] },
    },
  ];
  const s = steps[step];
  const last = step === steps.length - 1;

  return (
    <motion.div className="tutorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="tutorial-skip" onClick={onDone}>
        Skip
      </button>
      <div className="tutorial-demo">
        <AnimatePresence mode="wait">
          <motion.div key={step} className="tut-stage" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <motion.div className="tut-card" animate={s.card} transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' }}>
              <span className="tut-line w1" />
              <span className="tut-line w2" />
              <span className="tut-line w3" />
            </motion.div>
            <motion.div className="tut-hand" animate={s.hand} transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' }}>
              <Hand size={40} strokeWidth={1.8} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="tutorial-panel">
        <Mascot mood={s.mood} size={70} />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="tutorial-foot">
          <div className="dots">
            {steps.map((_, i) => (
              <span key={i} className={i === step ? 'on' : ''} />
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => (last ? onDone() : setStep(step + 1))}>
            {last ? "Let's go!" : 'Next'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
