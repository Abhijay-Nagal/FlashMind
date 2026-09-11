import confetti from 'canvas-confetti';

const COLORS = ['#7C4DFF', '#FFC247', '#FF6FA8', '#3DDC97', '#4FB3FF'];

function reduced() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function burst(x = 0.5, y = 0.55, count = 45) {
  if (reduced()) return;
  void confetti({
    particleCount: count,
    spread: 70,
    startVelocity: 32,
    ticks: 110,
    origin: { x, y },
    colors: COLORS,
    scalar: 0.9,
    disableForReducedMotion: true,
    zIndex: 3000,
  });
}

export function celebrate() {
  if (reduced()) return;
  const end = Date.now() + 650;
  const frame = () => {
    void confetti({ particleCount: 3, angle: 60, spread: 60, ticks: 120, origin: { x: 0, y: 0.7 }, colors: COLORS, zIndex: 3000 });
    void confetti({ particleCount: 3, angle: 120, spread: 60, ticks: 120, origin: { x: 1, y: 0.7 }, colors: COLORS, zIndex: 3000 });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
