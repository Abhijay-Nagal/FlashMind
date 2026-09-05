import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  useEffect(() => {
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500); // reduced slightly to account for smooth framer fade

    return () => clearTimeout(completeTimer);
  }, [onComplete]);

  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Logo animated={true} />
    </motion.div>
  );
}
