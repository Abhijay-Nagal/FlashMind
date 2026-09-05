import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from './components/flashcard/Flashcard';
import { BottomNav } from './components/navigation/BottomNav';
import { SplashScreen } from './components/common/SplashScreen';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import { Logo } from './components/common/Logo';
import { SettingsModal } from './components/settings/SettingsModal';
import { UploadView } from './components/upload/UploadView';
import type { Theme } from './components/settings/SettingsModal';
import type { Flashcard as FlashcardType } from './types/flashcard';
import { flashcards as defaultFlashcards, flashcardChains as defaultChains } from './data/flashcards';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'upload'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Flashcard Data State
  const [activeCards, setActiveCards] = useState<FlashcardType[]>(defaultFlashcards);
  const [activeChains, setActiveChains] = useState<string[][]>(defaultChains);
  
  // Swipe State
  const [vIndex, setVIndex] = useState(0);
  const [hIndex, setHIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
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

  // Derived state for current card
  const currentChain = activeChains[vIndex] || [];
  const currentCardId = currentChain[hIndex];
  const currentCard = activeCards.find(c => c.id === currentCardId) || activeCards[0];

  const canSwipeLeft = hIndex < currentChain.length - 1;
  const canSwipeRight = hIndex > 0;
  const canSwipeUp = vIndex < activeChains.length - 1;
  const canSwipeDown = vIndex > 0;

  const handleSwipeLeft = () => { setHIndex(h => h + 1); setIsFlipped(false); };
  const handleSwipeRight = () => { setHIndex(h => h - 1); setIsFlipped(false); };
  const handleSwipeUp = () => { setVIndex(v => v + 1); setHIndex(0); setIsFlipped(false); };
  const handleSwipeDown = () => { setVIndex(v => v - 1); setHIndex(0); setIsFlipped(false); };

  const resetFeed = () => {
    setActiveTab('home');
    setVIndex(0);
    setHIndex(0);
    setIsFlipped(false);
  };
  
  const handleFlashcardsGenerated = (generatedCards: FlashcardType[]) => {
    setActiveCards(generatedCards);
    // Create a flat chain for the generated cards
    setActiveChains([generatedCards.map(c => c.id)]);
    resetFeed(); // This will also switch back to the 'home' tab to view them
  };

  return (
    <div className="app-container">
      <AnimatedBackground />
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      
      {!showSplash && (
        <>
          <header className="app-header" style={{ position: 'relative', zIndex: 10 }}>
            <Logo animated={false} className="header-logo" />
          </header>
          
          <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div 
            key="home"
            className="feed-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentCard && (
              <Flashcard
                key={currentCard.id}
                card={currentCard}
                currentIndex={hIndex}
                totalCards={currentChain.length}
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
            )}
          </motion.div>
        )}

        {activeTab === 'upload' && (
          <motion.div 
            key="upload" 
            style={{ flex: 1, display: 'flex', width: '100%', overflowY: 'auto' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <UploadView onFlashcardsGenerated={handleFlashcardsGenerated} />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav 
        onHomeClick={resetFeed} 
        onUploadClick={() => setActiveTab('upload')}
        onSettingsClick={() => setIsSettingsOpen(true)}
        activeTab={isSettingsOpen ? 'settings' : activeTab}
      />
      
      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)} 
          theme={theme}
          setTheme={setTheme}
        />
      )}
        </>
      )}
    </div>
  );
}

export default App;