import { useState, useEffect } from 'react';
import { Flashcard } from './components/flashcard/Flashcard';
import { BottomNav } from './components/navigation/BottomNav';
import { SplashScreen } from './components/common/SplashScreen';
import { Logo } from './components/common/Logo';
import { SettingsModal } from './components/settings/SettingsModal';
import type { Theme } from './components/settings/SettingsModal';
import { flashcards, flashcardChains } from './data/flashcards';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [vIndex, setVIndex] = useState(0);
  const [hIndex, setHIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Theme logic
  const [theme, setTheme] = useState<Theme>('system');
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const currentChain = flashcardChains[vIndex];
  const currentCardId = currentChain[hIndex];
  const currentCard = flashcards.find(c => c.id === currentCardId) || flashcards[0];

  const canSwipeLeft = hIndex < currentChain.length - 1;
  const canSwipeRight = hIndex > 0;
  const canSwipeUp = vIndex < flashcardChains.length - 1;
  const canSwipeDown = vIndex > 0;

  const handleSwipeLeft = () => { setHIndex(h => h + 1); setIsFlipped(false); };
  const handleSwipeRight = () => { setHIndex(h => h - 1); setIsFlipped(false); };
  const handleSwipeUp = () => { setVIndex(v => v + 1); setHIndex(0); setIsFlipped(false); };
  const handleSwipeDown = () => { setVIndex(v => v - 1); setHIndex(0); setIsFlipped(false); };

  const resetFeed = () => {
    setVIndex(0);
    setHIndex(0);
    setIsFlipped(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <Logo animated={false} className="header-logo" />
      </header>
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
      <BottomNav 
        onHomeClick={resetFeed} 
        onSettingsClick={() => setIsSettingsOpen(true)} 
      />
      
      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)} 
          theme={theme}
          setTheme={setTheme}
        />
      )}
    </div>
  );
}

export default App;