/** Each topic gets its own colour so the deck reads like a map. White text passes contrast on all. */
export const TOPIC_HUES = [
  { name: 'violet', from: '#7C4DFF', to: '#4B22C9', glow: 'rgba(124,77,255,.45)' },
  { name: 'coral', from: '#F2604A', to: '#C2304A', glow: 'rgba(242,96,74,.45)' },
  { name: 'teal', from: '#0E9F8F', to: '#0A6B66', glow: 'rgba(14,159,143,.45)' },
  { name: 'blue', from: '#2F6BF0', to: '#1B3FB8', glow: 'rgba(47,107,240,.45)' },
  { name: 'pink', from: '#E0388C', to: '#A31866', glow: 'rgba(224,56,140,.45)' },
  { name: 'amber', from: '#E07B0C', to: '#A94E06', glow: 'rgba(224,123,12,.45)' },
  { name: 'green', from: '#1C9C4E', to: '#11703A', glow: 'rgba(28,156,78,.45)' },
  { name: 'cyan', from: '#0A8DB8', to: '#0B5E84', glow: 'rgba(10,141,184,.45)' },
] as const;

export function hue(i: number) {
  return TOPIC_HUES[((i % TOPIC_HUES.length) + TOPIC_HUES.length) % TOPIC_HUES.length];
}

export function topicGradient(i: number, angle = 150) {
  const h = hue(i);
  return `linear-gradient(${angle}deg, ${h.from} 0%, ${h.to} 100%)`;
}
