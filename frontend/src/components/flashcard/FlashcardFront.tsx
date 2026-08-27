import type { Flashcard } from '../../types/flashcard';

interface Props {
  card: Flashcard;
}

export function FlashcardFront({ card }: Props) {
  return (
    <div className="flashcard-face flashcard-front">
      <div className="card-header">
        <span className="card-category">{card.category}</span>
        <span className="card-topic">{card.topic}</span>
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
