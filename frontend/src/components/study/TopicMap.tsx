import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Check, FileText, X } from 'lucide-react';
import { Sheet } from '../common/Sheet';
import type { Deck, DeckProgress } from '../../types/deck';
import { topicGradient } from '../../lib/palette';
import { deckStats, useStore } from '../../lib/store';

interface Props {
  open: boolean;
  onClose: () => void;
  deck: Deck;
  progress?: DeckProgress;
  current: { topic: number; depth: number };
  onJump: (topic: number, depth: number) => void;
}

/** The deck as a map: topics run top→bottom (PDF order), each topic's chain runs left→right. */
export function TopicMap({ open, onClose, deck, progress, current, onJump }: Props) {
  const st = deckStats(deck, progress);
  const nextSwipe = useStore((s) => s.settings.nextTopicSwipe);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      listRef.current?.querySelector('.map-topic.current')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 350);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Deck map"
      subtitle={`${deck.topics.length} topics · ${st.total} cards · ${Math.round(st.pct * 100)}% explored`}
    >
      <div className="map-legend">
        <span>
          {nextSwipe === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />} swipe for next topic
        </span>
        <span>
          <ArrowLeft size={14} /> go deeper
        </span>
      </div>
      <ol className="map" ref={listRef}>
        {deck.topics.map((t, i) => {
          const pages = t.cards.map((c) => c.page).filter((p): p is number => !!p);
          const isCurrent = i === current.topic;
          return (
            <li key={t.id} className={`map-topic ${isCurrent ? 'current' : ''}`}>
              <span className="map-node" style={{ background: topicGradient(t.hue) }}>
                {i + 1}
              </span>
              <div className="map-body">
                <button className="map-title" onClick={() => onJump(i, 0)}>
                  <span aria-hidden="true">{t.emoji}</span> {t.title}
                  {pages.length > 0 && (
                    <span className="map-pages">
                      <FileText size={11} /> p.{Math.min(...pages)}
                      {Math.max(...pages) !== Math.min(...pages) ? `–${Math.max(...pages)}` : ''}
                    </span>
                  )}
                </button>
                <div className="map-chain">
                  {t.cards.map((c, d) => {
                    const cp = progress?.cards[c.id];
                    const here = isCurrent && d === current.depth;
                    return (
                      <button
                        key={c.id}
                        className={`map-card ${cp?.seen ? 'seen' : ''} ${here ? 'here' : ''}`}
                        style={cp?.seen || here ? { background: topicGradient(t.hue) } : undefined}
                        onClick={() => onJump(i, d)}
                        aria-label={`${c.title}${cp?.seen ? ', seen' : ''}`}
                        title={c.title}
                      >
                        {cp?.picked !== undefined ? cp.correct ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} /> : d + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
        {deck.generating && <li className="map-more">Flashy is writing more topics…</li>}
      </ol>
    </Sheet>
  );
}
