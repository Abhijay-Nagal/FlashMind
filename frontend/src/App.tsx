import { useState } from 'react';
import { Flashcard } from './components/flashcard/Flashcard';
import { BottomNav } from './components/navigation/BottomNav';
import { flashcards, flashcardChains } from './data/flashcards';

function App() {
  const [vIndex, setVIndex] = useState(0);
  const [hIndex, setHIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentChain = flashcardChains[vIndex];
  const currentCardId = currentChain[hIndex];
  const currentCard = flashcards.find(c => c.id === currentCardId) || flashcards[0];

  const canSwipeLeft = hIndex < currentChain.length - 1;
  const canSwipeRight = hIndex > 0;
  const canSwipeUp = vIndex < flashcardChains.length - 1;
  const canSwipeDown = vIndex > 0;

  const handleSwipeLeft = () => setHIndex(h => h + 1);
  const handleSwipeRight = () => setHIndex(h => h - 1);
  const handleSwipeUp = () => { setVIndex(v => v + 1); setHIndex(0); };
  const handleSwipeDown = () => { setVIndex(v => v - 1); setHIndex(0); };

  const resetFeed = () => {
    setVIndex(0);
    setHIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="app-container">
      <div className="feed-container">
        <Flashcard
          key={currentCard.id}
          card={currentCard}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDown}
          canSwipeLeft={canSwipeLeft}
          canSwipeRight={canSwipeRight}
          canSwipeUp={canSwipeUp}
          canSwipeDown={canSwipeDown}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
        />
      </div>
      <BottomNav onHomeClick={resetFeed} />
    </div>
  );
}

export default App;