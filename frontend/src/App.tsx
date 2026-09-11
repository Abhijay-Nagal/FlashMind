import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './components/common/SplashScreen';
import { TabBar, type Tab } from './components/common/TabBar';
import { Toasts } from './components/common/Toasts';
import { SettingsSheet } from './components/settings/SettingsSheet';
import { HomeScreen } from './screens/HomeScreen';
import { CreateScreen } from './screens/CreateScreen';
import { StatsScreen } from './screens/StatsScreen';
import { StudyScreen } from './screens/StudyScreen';
import { QuizScreen } from './screens/QuizScreen';
import { GeneratingScreen } from './screens/GeneratingScreen';
import { useStore } from './lib/store';
import { dismissJob, getGenJob } from './lib/generator';
import { useBackHandler } from './lib/backHandler';
import { ensureSampleDeck } from './data/sampleDeck';
import { toast } from './lib/toast';

type QuizMode = 'mix' | 'mistakes' | 'starred';
type Route = { name: 'tabs' } | { name: 'study'; deckId: string } | { name: 'quiz'; deckId: string; mode: QuizMode };

function useTheme() {
  const theme = useStore((s) => s.settings.theme);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0c0a1b' : '#f4f1ff');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
}

export default function App() {
  const [splash, setSplash] = useState(() => !new URLSearchParams(location.search).has('nosplash'));
  const [tab, setTab] = useState<Tab>('home');
  const [route, setRoute] = useState<Route>({ name: 'tabs' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(false);

  useTheme();

  useEffect(() => {
    const full = () => toast('Storage is full — delete an old deck to keep saving progress', '💾', 4000);
    window.addEventListener('fm-storage-full', full);
    return () => window.removeEventListener('fm-storage-full', full);
  }, []);
  useBackHandler(route.name === 'tabs' && tab !== 'home', () => setTab('home'));

  const endSplash = useCallback(() => setSplash(false), []);

  const openDeck = useCallback((deckId: string) => {
    setGenOpen(false);
    if (getGenJob()?.phase === 'done' && getGenJob()?.deckId === deckId) dismissJob();
    setRoute({ name: 'study', deckId });
  }, []);

  const openSample = useCallback(() => {
    dismissJob();
    openDeck(ensureSampleDeck());
  }, [openDeck]);

  return (
    <div className="app">
      <div className="backdrop">
        <span />
      </div>

      <main className="screen">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            className="screen"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {tab === 'home' && (
              <HomeScreen
                onOpenDeck={openDeck}
                onCreate={() => setTab('create')}
                onSettings={() => setSettingsOpen(true)}
                onShowGeneration={() => setGenOpen(true)}
                onQuiz={(deckId, mode) => setRoute({ name: 'quiz', deckId, mode })}
              />
            )}
            {tab === 'create' && (
              <CreateScreen
                onStarted={() => {
                  setTab('home');
                  setGenOpen(true);
                }}
                onSettings={() => setSettingsOpen(true)}
              />
            )}
            {tab === 'stats' && <StatsScreen onSettings={() => setSettingsOpen(true)} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <TabBar active={tab} onChange={setTab} />

      <AnimatePresence>
        {route.name === 'study' && (
          <motion.div
            key={`study-${route.deckId}`}
            className="layer"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <StudyScreen
              deckId={route.deckId}
              onExit={() => setRoute({ name: 'tabs' })}
              onQuiz={(mode) => setRoute({ name: 'quiz', deckId: route.deckId, mode })}
            />
          </motion.div>
        )}
        {route.name === 'quiz' && (
          <motion.div
            key={`quiz-${route.deckId}-${route.mode}`}
            className="layer"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <QuizScreen deckId={route.deckId} mode={route.mode} onExit={() => setRoute({ name: 'tabs' })} />
          </motion.div>
        )}
      </AnimatePresence>

      <GeneratingScreen
        open={genOpen}
        onMinimize={() => setGenOpen(false)}
        onStudy={openDeck}
        onSettings={() => {
          setGenOpen(false);
          setSettingsOpen(true);
        }}
        onSample={openSample}
      />

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Toasts />

      <AnimatePresence>{splash && <SplashScreen key="splash" onDone={endSplash} />}</AnimatePresence>
    </div>
  );
}
