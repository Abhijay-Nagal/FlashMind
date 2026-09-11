import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogoMark } from './LogoMark';
import { Mascot } from '../mascot/Mascot';

interface Props {
  onDone: () => void;
}

export function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
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
        <LogoMark size={132} animated />
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
