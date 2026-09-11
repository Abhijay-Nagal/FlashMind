import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, type TargetAndTransition } from 'framer-motion';

export type Mood = 'idle' | 'happy' | 'laugh' | 'sad' | 'think' | 'wave' | 'sleep' | 'wow';

interface Props {
  mood?: Mood;
  size?: number;
  /** pupils follow the pointer / finger */
  track?: boolean;
  className?: string;
  onClick?: () => void;
}

const INK = '#021F28';

const bodyAnim: Record<Mood, TargetAndTransition> = {
  idle: { y: [0, -3, 0], rotate: 0, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
  happy: { y: [0, -12, 0, -6, 0], rotate: 0, transition: { duration: 0.9, ease: 'easeOut' } },
  laugh: { y: [0, -8, 0, -8, 0], rotate: [0, -5, 5, -5, 0], transition: { duration: 0.8, repeat: 1 } },
  sad: { y: 3, rotate: -4, transition: { type: 'spring', stiffness: 120, damping: 12 } },
  think: { y: [0, -2, 0], rotate: 6, transition: { y: { duration: 2.4, repeat: Infinity }, rotate: { type: 'spring', stiffness: 80 } } },
  wave: { y: [0, -4, 0], rotate: [0, -3, 0], transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } },
  sleep: { y: 2, rotate: -6, scaleY: [1, 1.03, 1], transition: { scaleY: { duration: 2.6, repeat: Infinity }, rotate: { duration: 0.6 } } },
  wow: { y: [0, -16, 0], scale: [1, 1.06, 1], transition: { duration: 0.6, ease: 'easeOut' } },
};

export function Mascot({ mood = 'idle', size = 120, track = false, className = '', onClick }: Props) {
  const [blink, setBlink] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });

  // natural, irregular blinking
  useEffect(() => {
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        loop();
      }, 2200 + Math.random() * 3200);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!track) return;
    const move = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.5);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 160);
      px.set((dx / d) * 3.2 * k);
      py.set((dy / d) * 3.2 * k);
    };
    const reset = () => {
      px.set(0);
      py.set(0);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', move, { passive: true });
    window.addEventListener('pointerup', reset, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', move);
      window.removeEventListener('pointerup', reset);
    };
  }, [track, px, py]);

  const eyesClosed = mood === 'happy' || mood === 'laugh' || mood === 'sleep';
  const lookUp = mood === 'think' ? -3 : mood === 'sad' ? 2.5 : 0;
  const lookSide = mood === 'think' ? 2.5 : 0;

  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 140 140"
      width={size}
      height={size}
      className={`mascot ${className}`}
      onClick={onClick}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fm-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3DEBDB" />
          <stop offset="1" stopColor="#00A2A8" />
        </linearGradient>
        <linearGradient id="fm-bolt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD66B" />
          <stop offset="1" stopColor="#FFA41B" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <motion.ellipse
        cx="70"
        cy="131"
        rx="30"
        ry="5"
        fill="rgba(2,31,40,.22)"
        animate={mood === 'happy' || mood === 'wow' || mood === 'laugh' ? { scaleX: [1, 0.7, 1] } : { scaleX: 1 }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: '70px 131px' }}
      />

      <motion.g key={mood} animate={bodyAnim[mood]} style={{ transformOrigin: '70px 120px' }}>
        {/* a card peeking from behind */}
        <rect x="36" y="30" width="74" height="88" rx="20" fill="#FF4D78" transform="rotate(-11 73 74)" />
        <rect x="36" y="30" width="74" height="88" rx="20" fill="#01FFC3" opacity=".95" transform="rotate(8 73 74)" />

        {/* lightning tuft */}
        <motion.path
          d="M74 4 L60 30 L70 30 L64 46 L84 20 L73 20 Z"
          fill="url(#fm-bolt)"
          stroke="#E08600"
          strokeWidth="1.5"
          strokeLinejoin="round"
          animate={mood === 'think' ? { rotate: [0, 8, -8, 0] } : mood === 'wow' || mood === 'laugh' ? { scale: [1, 1.25, 1] } : { rotate: [0, 4, 0] }}
          transition={{ duration: mood === 'think' ? 1 : 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '70px 40px' }}
        />

        {/* arms */}
        <path d="M31 84 Q18 90 16 100" stroke="#008A91" strokeWidth="8" strokeLinecap="round" fill="none" />
        <motion.path
          d={mood === 'wave' || mood === 'laugh' || mood === 'wow' ? 'M109 80 Q122 70 124 56' : 'M109 84 Q122 90 124 100'}
          stroke="#008A91"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          animate={mood === 'wave' ? { rotate: [0, -18, 8, -18, 0] } : { rotate: 0 }}
          transition={{ duration: 1.2, repeat: mood === 'wave' ? Infinity : 0 }}
          style={{ transformOrigin: '109px 82px' }}
        />

        {/* feet */}
        <rect x="48" y="114" width="16" height="12" rx="6" fill="#00707A" />
        <rect x="76" y="114" width="16" height="12" rx="6" fill="#00707A" />

        {/* body */}
        <rect x="28" y="28" width="84" height="92" rx="24" fill="url(#fm-body)" />
        <rect x="38" y="36" width="36" height="7" rx="3.5" fill="#fff" opacity=".28" />
        <rect x="38" y="47" width="18" height="5" rx="2.5" fill="#fff" opacity=".18" />

        {/* eyes */}
        {eyesClosed ? (
          mood === 'sleep' ? (
            <g stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M47 72 Q55 77 63 72" />
              <path d="M77 72 Q85 77 93 72" />
            </g>
          ) : (
            <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M46 74 Q55 63 64 74" />
              <path d="M76 74 Q85 63 94 74" />
            </g>
          )
        ) : (
          <motion.g animate={{ scaleY: blink ? 0.08 : 1 }} transition={{ duration: 0.07 }} style={{ transformOrigin: '70px 70px' }}>
            <ellipse cx="55" cy="70" rx="10.5" ry={mood === 'wow' ? 12.5 : 11.5} fill="#fff" />
            <ellipse cx="85" cy="70" rx="10.5" ry={mood === 'wow' ? 12.5 : 11.5} fill="#fff" />
            <motion.g style={{ x: sx, y: sy }}>
              <g transform={`translate(${lookSide} ${lookUp})`}>
                <circle cx="56" cy="71" r={mood === 'wow' ? 4.5 : 5.5} fill={INK} />
                <circle cx="86" cy="71" r={mood === 'wow' ? 4.5 : 5.5} fill={INK} />
                <circle cx="54" cy="68.5" r="1.8" fill="#fff" />
                <circle cx="84" cy="68.5" r="1.8" fill="#fff" />
              </g>
            </motion.g>
            {mood === 'sad' && (
              <g stroke={INK} strokeWidth="3" strokeLinecap="round">
                <path d="M45 57 L60 61" />
                <path d="M95 57 L80 61" />
              </g>
            )}
          </motion.g>
        )}

        {/* cheeks */}
        <ellipse cx="42" cy="87" rx="6.5" ry="4" fill="#FF8AA5" opacity={mood === 'sad' ? 0.3 : 0.75} />
        <ellipse cx="98" cy="87" rx="6.5" ry="4" fill="#FF8AA5" opacity={mood === 'sad' ? 0.3 : 0.75} />

        {/* mouth */}
        <Mouth mood={mood} />

        {mood === 'sad' && (
          <motion.path
            d="M104 50 Q108 58 104 62 Q100 58 104 50 Z"
            fill="#7FD3FF"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: [0, 1, 1, 0], y: [-4, 0, 6, 10] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
      </motion.g>

      {/* extras */}
      {mood === 'think' && (
        <g fill="currentColor" className="mascot-extra">
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={118 + i * 7}
              cy={30 - i * 8}
              r={2.5 + i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
            />
          ))}
        </g>
      )}
      {mood === 'sleep' && (
        <motion.text
          x="112"
          y="30"
          fontSize="16"
          fontWeight="800"
          fill="currentColor"
          className="mascot-extra"
          animate={{ opacity: [0, 1, 0], y: [34, 20, 8] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          z
        </motion.text>
      )}
      {(mood === 'laugh' || mood === 'happy' || mood === 'wow') && <Sparkles />}
    </motion.svg>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  switch (mood) {
    case 'happy':
    case 'wave':
      return (
        <g>
          <path d="M58 88 Q70 104 82 88 Z" fill={INK} strokeLinejoin="round" stroke={INK} strokeWidth="2" />
          <path d="M64 96 Q70 100 76 96 Q70 93 64 96 Z" fill="#FF7A98" />
        </g>
      );
    case 'laugh':
      return (
        <g>
          <path d="M55 86 Q70 110 85 86 Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M62 98 Q70 104 78 98 Q70 94 62 98 Z" fill="#FF7A98" />
        </g>
      );
    case 'sad':
      return <path d="M61 98 Q70 90 79 98" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />;
    case 'wow':
      return <ellipse cx="70" cy="95" rx="6" ry="7.5" fill={INK} />;
    case 'think':
      return <path d="M63 95 Q71 92 78 94" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />;
    case 'sleep':
      return <ellipse cx="70" cy="95" rx="3.5" ry="3" fill={INK} />;
    default:
      return <path d="M61 91 Q70 99 79 91" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />;
  }
}

function Sparkles() {
  const pts = [
    [14, 34, 0],
    [124, 40, 0.15],
    [20, 110, 0.3],
    [126, 104, 0.1],
  ];
  return (
    <g>
      {pts.map(([x, y, d], i) => (
        <motion.path
          key={i}
          d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2} Z`}
          fill={i % 2 ? '#01FFC3' : '#FF4D78'}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: d, repeat: 2 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
    </g>
  );
}
