import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Flashcard } from '../../types/flashcard';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  card: Flashcard;
  onAnswerSelected?: (isCorrect: boolean) => void;
  currentIndex?: number;
  totalCards?: number;
}

export function FlashcardBack({ card, onAnswerSelected, currentIndex = 0, totalCards = 1 }: Props) {
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
              <motion.button
                key={option.id}
                className={btnClass}
                whileTap={{ scale: 0.98 }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation(); // Prevent flipping the card when answering
                  handleSelect(option.id);
                }}
                disabled={!!selectedId}
              >
                <span className="option-text">{option.text}</span>
                {showCorrect && <CheckCircle2 className="icon-correct" size={20} />}
                {showIncorrect && <XCircle className="icon-incorrect" size={20} />}
              </motion.button>
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
