import { getState } from './store';

/* Haptics (Android; silently ignored on iOS) and tiny synthesized sounds —
   no audio files to download, works offline. */

export function haptic(pattern: number | number[] = 12) {
  if (!getState().settings.haptics) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported */
  }
}

let ctx: AudioContext | null = null;
function audio() {
  if (!getState().settings.sound) return null;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.08) {
  const a = audio();
  if (!a) return;
  const t0 = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  swipe() {
    const a = audio();
    if (!a) return;
    const t0 = a.currentTime;
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, t0);
    osc.frequency.exponentialRampToValueAtTime(300, t0 + 0.09);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.035, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
    osc.connect(gain).connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + 0.12);
  },
  flip() {
    tone(660, 0, 0.08, 'triangle', 0.04);
    tone(880, 0.05, 0.1, 'triangle', 0.035);
  },
  correct() {
    tone(784, 0, 0.12, 'sine', 0.09);
    tone(1047, 0.09, 0.2, 'sine', 0.09);
  },
  wrong() {
    tone(220, 0, 0.16, 'square', 0.03);
    tone(185, 0.1, 0.22, 'square', 0.03);
  },
  bump() {
    tone(140, 0, 0.08, 'sine', 0.06);
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.07));
  },
  pop() {
    tone(900, 0, 0.06, 'sine', 0.05);
  },
};
