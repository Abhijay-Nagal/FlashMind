import type { Flashcard } from '../../types/flashcard';

interface Props {
  card: Flashcard;
  currentIndex?: number;
  totalCards?: number;
}

export function FlashcardFront({ card, currentIndex = 0, totalCards = 1 }: Props) {
  return (
    <div className="flashcard-face flashcard-front">
      <div className="card-header" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="card-category">{card.category}</span>
          <span className="card-topic">{card.topic}</span>
        </div>
        {totalCards > 1 && (
          <span className="card-page" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', opacity: 0.8 }}>
            {currentIndex + 1} / {totalCards}
          </span>
        )}
      </div>
      <div className="card-body">
        <h2 className="card-title">{card.title}</h2>
        <p className="card-content">{card.content}</p>
      </div>
      <div className="card-footer">
        <span className="hint-text">Tap to flip & test yourself</span>
      </div>
    </div>
  );
}
