import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, RotateCcw, Target, Zap } from 'lucide-react';
import { Mascot } from '../mascot/Mascot';
import { ProgressRing } from '../common/ProgressRing';
import type { Deck, DeckProgress } from '../../types/deck';
import { deckStats } from '../../lib/store';
import { celebrate } from '../../lib/confetti';
import { sfx } from '../../lib/feedback';
import { useBackHandler } from '../../lib/backHandler';

interface Props {
  deck: Deck;
  progress?: DeckProgress;
  onClose: () => void;
  onRestart: () => void;
  onDismiss: () => void;
  onQuiz: (mode: 'mix' | 'mistakes') => void;
}

export function DeckComplete({ deck, progress, onClose, onRestart, onDismiss, onQuiz }: Props) {
  const st = deckStats(deck, progress);
  const acc = st.answered ? st.correct / st.answered : 0;
  const mistakes = st.answered - st.correct;
  useBackHandler(true, onDismiss);

  useEffect(() => {
    celebrate();
    sfx.win();
  }, []);

  return (
    <motion.div className="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="complete-card" initial={{ y: 60, scale: 0.9 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
        <Mascot mood="laugh" size={110} />
        <h2>{st.pct >= 0.95 ? 'Deck complete!' : 'You reached the end!'}</h2>
        <p className="muted">
          {st.pct >= 0.95 ? (
            <>
              Every card of <strong>{deck.title}</strong> explored. +50 XP
            </>
          ) : (
            <>
              You walked through all {deck.topics.length} topics. {st.total - st.seen} deeper cards are still waiting — swipe left on a topic
              to find them.
            </>
          )}
        </p>
        <div className="complete-stats">
          <div>
            <ProgressRing value={st.pct} size={64} stroke={6}>
              <strong>{Math.round(st.pct * 100)}%</strong>
            </ProgressRing>
            <span>cards explored</span>
          </div>
          <div>
            <ProgressRing value={acc} size={64} stroke={6} color="var(--mint)">
              <strong>{st.answered ? `${Math.round(acc * 100)}%` : '–'}</strong>
            </ProgressRing>
            <span>quiz accuracy</span>
          </div>
        </div>
        <div className="complete-actions">
          <button className="btn btn-primary btn-block" onClick={() => onQuiz('mix')}>
            <Zap size={18} /> Quick quiz on this deck
          </button>
          {mistakes > 0 && (
            <button className="btn btn-soft btn-block" onClick={() => onQuiz('mistakes')}>
              <Target size={18} /> Review {mistakes} mistake{mistakes > 1 ? 's' : ''}
            </button>
          )}
          <div className="complete-row">
            <button className="btn btn-soft" onClick={onRestart}>
              <RotateCcw size={18} /> Start over
            </button>
            <button className="btn btn-soft" onClick={onClose}>
              <Home size={18} /> Home
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
