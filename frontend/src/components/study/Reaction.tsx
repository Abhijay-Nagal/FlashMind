import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mascot, type Mood } from '../mascot/Mascot';

export interface ReactionState {
  id: number;
  mood: Mood;
  text: string;
  xp: number;
}

/** Flashy pops up from the corner to react to a quiz answer. */
export function Reaction({ state, onDone }: { state: ReactionState | null; onDone: () => void }) {
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });
  useEffect(() => {
    if (!state) return;
    const t = setTimeout(() => done.current(), 2100);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          key={state.id}
          className="reaction"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          aria-live="polite"
        >
          <Mascot mood={state.mood} size={74} />
          <div className="reaction-bubble">
            <strong>{state.text}</strong>
            {state.xp > 0 && (
              <motion.span className="xp-pop" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.15 }}>
                +{state.xp} XP
              </motion.span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
