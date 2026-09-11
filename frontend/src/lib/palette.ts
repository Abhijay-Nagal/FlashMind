/** Each topic gets its own colour so the deck reads like a map. White text passes contrast on all. */
export const TOPIC_HUES = [
  { name: 'teal', from: '#00AFAA', to: '#006D78', glow: 'rgba(0,175,170,.45)' },
  { name: 'coral', from: '#FF5A80', to: '#D12F5B', glow: 'rgba(255,90,128,.45)' },
  { name: 'ocean', from: '#1E8BE0', to: '#1358A6', glow: 'rgba(30,139,224,.45)' },
  { name: 'emerald', from: '#12B384', to: '#0A7659', glow: 'rgba(18,179,132,.45)' },
  { name: 'tangerine', from: '#FF8A4C', to: '#D9571E', glow: 'rgba(255,138,76,.45)' },
  { name: 'lagoon', from: '#0DB0D4', to: '#0A6C94', glow: 'rgba(13,176,212,.45)' },
  { name: 'forest', from: '#4FAF45', to: '#2B7A30', glow: 'rgba(79,175,69,.45)' },
  { name: 'deepsea', from: '#14869A', to: '#073F4D', glow: 'rgba(20,134,154,.45)' },
] as const;

export function hue(i: number) {
  return TOPIC_HUES[((i % TOPIC_HUES.length) + TOPIC_HUES.length) % TOPIC_HUES.length];
}

export function topicGradient(i: number, angle = 150) {
  const h = hue(i);
  return `linear-gradient(${angle}deg, ${h.from} 0%, ${h.to} 100%)`;
}
