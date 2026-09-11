import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogoMark } from './LogoMark';
import { Mascot } from '../mascot/Mascot';

const SPARKS: [number, number, string][] = [
  [-86, -40, '#FFC247'],
  [84, -52, '#FF5FA2'],
  [-70, 58, '#8C6DFF'],
  [92, 40, '#3DDC97'],
  [0, -96, '#FFFFFF'],
  [-104, 4, '#FF5FA2'],
  [104, -6, '#FFC247'],
  [18, 92, '#FFFFFF'],
];

interface Props {
  onDone: () => void;
}

export function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const word = 'FlashMind'.split('');

  return (
    <motion.div
      className="splash"
      onClick={onDone}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      <motion.div
        className="splash-glow"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <div className="splash-center">
        <div className="splash-logo">
          <motion.span
            className="splash-ring"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.6], opacity: [0, 0.6, 0] }}
            transition={{ delay: 0.55, duration: 1.1, ease: 'easeOut' }}
          />
          {SPARKS.map(([x, y, c], i) => (
            <motion.span
              key={i}
              className="splash-spark"
              style={{ background: c }}
              initial={{ x: 0, y: 0, rotate: 45, scale: 0, opacity: 0 }}
              animate={{ x, y, rotate: 45, scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
              transition={{ delay: 0.6 + i * 0.02, duration: 0.9, ease: 'easeOut' }}
            />
          ))}
          <LogoMark size={132} animated />
        </div>
        <h1 className="splash-word" aria-label="FlashMind">
          {word.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: 28, opacity: 0, rotate: 8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.75 + i * 0.045, type: 'spring', stiffness: 380, damping: 20 }}
              className={i >= 5 ? 'accent' : undefined}
            >
              {ch}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="splash-tag"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.5 }}
        >
          Learn · Swipe · Remember
        </motion.p>
      </div>
      <motion.div
        className="splash-mascot"
        initial={{ y: 140, rotate: -10 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 160, damping: 14 }}
      >
        <Mascot mood="wave" size={110} />
      </motion.div>
    </motion.div>
  );
}
