import { useState } from 'react';
import { Flashcard } from './components/flashcard/Flashcard';
import { BottomNav } from './components/navigation/BottomNav';
import { flashcards, getRandomUnrelatedCard } from './data/flashcards';

function App() {
  const [currentCardId, setCurrentCardId] = useState<string>('newton-1');
  const [isFlipped, setIsFlipped] = useState(false);

  // Derive the actual card object from the current ID
  const currentCard = flashcards.find(c => c.id === currentCardId) || flashcards[0];

  const handleSwipeLeft = () => {
    // Left swipe -> Related card
    if (currentCard.relatedCardId) {
      setCurrentCardId(currentCard.relatedCardId);
    } else {
      // If no related card, just show an unrelated one for now so the feed doesn't break
      setCurrentCardId(getRandomUnrelatedCard(currentCard.id).id);
    }
  };

  const handleSwipeUp = () => {
    // Up swipe -> Different topic (random unrelated)
    setCurrentCardId(getRandomUnrelatedCard(currentCard.id).id);
  };

  const resetFeed = () => {
    setCurrentCardId('newton-1');
    setIsFlipped(false);
  };

  return (
    <div className="app-container">
      <div className="feed-container">
        {/* React uses key to completely unmount/remount component when card changes, 
            but for smooth continuous swiping, we keep the same component and just 
            update its props (which triggers the internal useEffect to reset positions). */}
        <Flashcard
          key={currentCard.id} // using key forces a fresh mount so animations reset properly if needed
          card={currentCard}
          onSwipeLeft={handleSwipeLeft}
          onSwipeUp={handleSwipeUp}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
        />
      </div>
      <BottomNav onHomeClick={resetFeed} />
    </div>
  );
}

export default App;