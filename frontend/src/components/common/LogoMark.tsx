import { motion } from 'framer-motion';

interface Props {
  size?: number;
  animated?: boolean;
}

/** Three fanned flashcards with a lightning bolt — the FlashMind mark. */
export function LogoMark({ size = 40, animated = false }: Props) {
  const card = (delay: number, rotate: number, fill: string, from: number) =>
    animated
      ? {
          initial: { rotate: 0, y: 30, opacity: 0, scale: 0.6 },
          animate: { rotate, y: 0, opacity: 1, scale: 1 },
          transition: { delay, type: 'spring' as const, stiffness: 260, damping: 18 },
          fill,
          style: { transformOrigin: `50px ${from}px` },
        }
      : { initial: false as const, animate: { rotate }, fill, style: { transformOrigin: `50px ${from}px` } };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="lm-front" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22DCD2" />
          <stop offset="1" stopColor="#008893" />
        </linearGradient>
      </defs>
      <motion.rect x="27" y="16" width="46" height="64" rx="11" {...card(0.05, -18, '#FF4D78', 90)} />
      <motion.rect x="27" y="16" width="46" height="64" rx="11" {...card(0.18, -6, '#01FFC3', 90)} />
      <motion.g {...card(0.32, 8, 'url(#lm-front)', 90)}>
        <rect x="27" y="16" width="46" height="64" rx="11" />
        <motion.path
          d="M55 27 L39 52 L49 52 L45 70 L62 43 L52 43 Z"
          fill="#fff"
          initial={animated ? { scale: 0, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: animated ? 0.6 : 0, type: 'spring', stiffness: 400, damping: 12 }}
          style={{ transformOrigin: '50px 48px' }}
        />
      </motion.g>
    </svg>
  );
}
