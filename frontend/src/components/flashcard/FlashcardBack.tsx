import { useState } from 'react';
import type { Flashcard } from '../../types/flashcard';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  card: Flashcard;
  onAnswerSelected?: (isCorrect: boolean) => void;
}

export function FlashcardBack({ card, onAnswerSelected }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (selectedId) return; // Prevent multiple selections
    setSelectedId(id);
    if (onAnswerSelected) {
      onAnswerSelected(id === card.correctAnswerId);
    }
  };

  return (
    <div className="flashcard-face flashcard-back">
      <div className="card-body mcq-body">
        <h3 className="mcq-question">{card.question}</h3>
        <div className="mcq-options">
          {card.options.map((option) => {
            const isSelected = selectedId === option.id;
            const isCorrect = option.id === card.correctAnswerId;
            const showCorrect = selectedId && isCorrect;
            const showIncorrect = isSelected && !isCorrect;

            let btnClass = 'mcq-option-btn';
            if (showCorrect) btnClass += ' correct';
            if (showIncorrect) btnClass += ' incorrect';
            if (selectedId && !isSelected && !isCorrect) btnClass += ' disabled';

            return (
              <button
                key={option.id}
                className={btnClass}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent flipping the card when answering
                  handleSelect(option.id);
                }}
                disabled={!!selectedId}
              >
                <span className="option-text">{option.text}</span>
                {showCorrect && <CheckCircle2 className="icon-correct" size={20} />}
                {showIncorrect && <XCircle className="icon-incorrect" size={20} />}
              </button>
            );
          })}
        </div>
      </div>
      {selectedId && (
        <div className="card-footer mcq-footer fade-in">
           <span className="hint-text">Swipe left for related, up for new topic</span>
        </div>
      )}
    </div>
  );
}
