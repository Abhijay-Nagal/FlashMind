import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';

export type Dir = 'left' | 'right' | 'up' | 'down';

interface Props {
  x: MotionValue<number>;
  y: MotionValue<number>;
  flipped: boolean;
  allowed: (d: Dir) => boolean;
  onDir: (d: Dir | null) => void;
  /** commit = the swipe passed the threshold in an allowed direction */
  onRelease: (d: Dir | null, attempted: Dir | null) => void;
  onHold: () => void;
  onTap: () => void;
  front: ReactNode;
  back: ReactNode;
}

const HOLD_MS = 430;
const SLOP = 9;

function rubber(d: number) {
  return Math.sign(d) * 70 * (1 - Math.exp(-Math.abs(d) / 180));
}

/**
 * The draggable, flippable card.
 *  - drag is axis-locked after a few pixels
 *  - press & hold (no movement) flips the card, with a ring that fills under the finger
 *  - taps pass through to buttons (quiz options) untouched
 */
export function SwipeCard({ x, y, flipped, allowed, onDir, onRelease, onHold, onTap, front, back }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [press, setPress] = useState<{ x: number; y: number; id: number } | null>(null);
  const g = useRef({
    id: -1,
    sx: 0,
    sy: 0,
    axis: null as 'x' | 'y' | null,
    dir: null as Dir | null,
    samples: [] as { t: number; v: number }[],
    hold: 0,
    ring: 0,
    held: false,
    dragged: false,
  });
  const rotate = useTransform(x, [-300, 0, 300], [-9, 0, 9]);

  // keep the latest callbacks without re-binding listeners mid-gesture
  const cb = useRef({ allowed, onDir, onRelease, onHold, onTap });
  useEffect(() => {
    cb.current = { allowed, onDir, onRelease, onHold, onTap };
  });

  // iOS: stop the page from rubber-banding while dragging the card
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const stop = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    el.addEventListener('touchmove', stop, { passive: false });
    return () => el.removeEventListener('touchmove', stop);
  }, []);

  useEffect(() => {
    const s = g.current;
    return () => {
      clearTimeout(s.hold);
      clearTimeout(s.ring);
    };
  }, []);

  const endListeners = useRef<() => void>(() => {});

  const onPointerDown = (e: React.PointerEvent) => {
    const s = g.current;
    if (s.id !== -1) return; // ignore a second finger
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    s.id = e.pointerId;
    s.sx = e.clientX;
    s.sy = e.clientY;
    s.axis = null;
    s.dir = null;
    s.held = false;
    s.dragged = false;
    s.samples = [];
    const target = e.target as HTMLElement;
    const onControl = !!target.closest('button, a, input, textarea');
    const rect = rootRef.current?.getBoundingClientRect();
    if (!onControl && rect) {
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      s.ring = window.setTimeout(() => setPress({ x: px, y: py, id: Date.now() }), 110);
      s.hold = window.setTimeout(() => {
        s.held = true;
        setPress(null);
        cb.current.onHold();
      }, HOLD_MS);
    }

    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== s.id || s.held) return;
      const dx = ev.clientX - s.sx;
      const dy = ev.clientY - s.sy;
      if (!s.axis) {
        if (Math.hypot(dx, dy) < SLOP) return;
        s.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        s.dragged = true;
        clearTimeout(s.hold);
        clearTimeout(s.ring);
        setPress(null);
      }
      const d = s.axis === 'x' ? dx : dy;
      const dir: Dir = s.axis === 'x' ? (d < 0 ? 'left' : 'right') : d < 0 ? 'up' : 'down';
      if (dir !== s.dir) {
        s.dir = dir;
        cb.current.onDir(dir);
      }
      const ok = cb.current.allowed(dir);
      const v = ok ? d : rubber(d);
      if (s.axis === 'x') {
        x.set(v);
        y.set(0);
      } else {
        y.set(v);
        x.set(0);
      }
      s.samples.push({ t: ev.timeStamp, v: d });
      if (s.samples.length > 6) s.samples.shift();
    };

    const finish = (ev: PointerEvent, cancelled: boolean) => {
      if (ev.pointerId !== s.id) return;
      endListeners.current();
      clearTimeout(s.hold);
      clearTimeout(s.ring);
      setPress(null);
      s.id = -1;
      if (s.held) {
        cb.current.onDir(null);
        return;
      }
      if (!s.axis) {
        if (!cancelled && !onControl) cb.current.onTap();
        return;
      }
      const rectNow = rootRef.current?.getBoundingClientRect();
      const size = s.axis === 'x' ? rectNow?.width ?? 320 : rectNow?.height ?? 500;
      const first = s.samples[0];
      const last = s.samples[s.samples.length - 1];
      const vel = first && last && last.t > first.t ? (last.v - first.v) / (last.t - first.t) : 0;
      const d = last?.v ?? 0;
      const dir = s.dir;
      const far = Math.abs(d) > size * (s.axis === 'x' ? 0.24 : 0.18);
      const flick = Math.abs(vel) > 0.45 && Math.sign(vel) === Math.sign(d) && Math.abs(d) > 28;
      const attempted = !cancelled && (far || flick) ? dir : null;
      const commit = attempted && cb.current.allowed(attempted) ? attempted : null;
      cb.current.onRelease(commit, attempted);
    };

    const up = (ev: PointerEvent) => finish(ev, false);
    const cancel = (ev: PointerEvent) => finish(ev, true);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    endListeners.current = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
  };

  useEffect(() => () => endListeners.current(), []);

  return (
    <motion.div
      ref={rootRef}
      className="swipe-card"
      style={{ x, y, rotate }}
      onPointerDown={onPointerDown}
      onContextMenu={(e) => e.preventDefault()}
      onClickCapture={(e) => {
        // a drag that ends over a quiz option — or the finger lifting after a
        // hold-to-flip — must not select the option now under the finger
        if (g.current.dragged || g.current.held) {
          e.stopPropagation();
          e.preventDefault();
          g.current.dragged = false;
          g.current.held = false;
        }
      }}
      initial={{ scale: 0.93, opacity: 0.4 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    >
      <motion.div
        className="flip"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 20 }}
      >
        <div className="flip-face flip-front" aria-hidden={flipped}>
          {front}
        </div>
        <div className="flip-face flip-back" aria-hidden={!flipped}>
          {back}
        </div>
      </motion.div>
      {press && (
        <span key={press.id} className="hold-ring" style={{ left: press.x, top: press.y }}>
          <svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" />
          </svg>
        </span>
      )}
    </motion.div>
  );
}
