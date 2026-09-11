import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowLeft,
  ChevronRight,
  Download,
  FileUp,
  Flame,
  Hand,
  Loader2,
  MoreHorizontal,
  Play,
  RotateCcw,
  Settings as SettingsIcon,
  Sparkles,
  Target,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { Mascot, type Mood } from '../components/mascot/Mascot';
import { ProgressRing } from '../components/common/ProgressRing';
import { Sheet } from '../components/common/Sheet';
import { actions, deckStats, levelFromXp, liveStreak, todayCount, useStore } from '../lib/store';
import { useGenJob } from '../lib/generator';
import { topicGradient } from '../lib/palette';
import { greeting, timeAgo } from '../lib/util';
import { ensureSampleDeck } from '../data/sampleDeck';
import { useInstallPrompt } from '../lib/install';
import { haptic, sfx } from '../lib/feedback';
import type { Deck } from '../types/deck';

interface Props {
  onOpenDeck: (id: string) => void;
  onCreate: () => void;
  onSettings: () => void;
  onShowGeneration: () => void;
  onQuiz: (deckId: string, mode: 'mix' | 'mistakes' | 'starred') => void;
}

export function HomeScreen({ onOpenDeck, onCreate, onSettings, onShowGeneration, onQuiz }: Props) {
  const decks = useStore((s) => s.decks);
  const progress = useStore((s) => s.progress);
  const stats = useStore((s) => s.stats);
  const settings = useStore((s) => s.settings);
  const job = useGenJob();
  const install = useInstallPrompt();
  const [menuDeck, setMenuDeck] = useState<Deck | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mascotMood, setMascotMood] = useState<Mood>('wave');
  const [tipIndex, setTipIndex] = useState(0);

  const streak = liveStreak(stats);
  const today = todayCount(stats);
  const goal = settings.dailyGoal;
  const lvl = levelFromXp(stats.xp);

  const sorted = useMemo(
    () =>
      [...decks].sort(
        (a, b) => (progress[b.id]?.lastStudiedAt ?? b.createdAt) - (progress[a.id]?.lastStudiedAt ?? a.createdAt),
      ),
    [decks, progress],
  );
  const continueDeck = sorted.find((d) => {
    const p = progress[d.id];
    return p && !p.completed && d.topics.length > 0;
  });

  const generating = job && (job.phase === 'reading' || job.phase === 'planning' || job.phase === 'writing');

  const lines = useMemo(() => {
    const l: string[] = [];
    if (!decks.length) l.push("Hi, I'm Flashy! Give me a PDF and I'll turn it into connected, swipeable flashcards ✨");
    else if (today >= goal) l.push(`Daily goal smashed — ${today} cards today! You're unstoppable 🎉`);
    else if (continueDeck) l.push(`Welcome back! ${goal - today} more cards to hit today's goal. Let's go!`);
    else l.push('Ready for a new deck? Upload your next chapter and I’ll get to work.');
    if (streak >= 2) l.push(`🔥 ${streak}-day streak! Don't break the chain.`);
    l.push('Tip: swipe left on a card to dig deeper into the same topic.');
    l.push('Tip: press and hold any card to flip it and take its quiz.');
    return l;
  }, [decks.length, today, goal, continueDeck, streak]);

  const pokeMascot = () => {
    const moods: Mood[] = ['laugh', 'wow', 'happy'];
    setMascotMood(moods[Math.floor(Math.random() * moods.length)]);
    setTipIndex((i) => (i + 1) % lines.length);
    haptic(10);
    sfx.pop();
    window.setTimeout(() => setMascotMood('idle'), 1600);
  };

  const addSample = () => onOpenDeck(ensureSampleDeck());

  return (
    <div className="scroll">
      <div className="page">
        {/* header */}
        <header className="home-head">
          <div>
            <p className="home-greet">{greeting()}{settings.name ? `, ${settings.name}` : ''} 👋</p>
            <h1 className="home-title">
              Ready to <span className="grad-text">learn</span>?
            </h1>
          </div>
          <div className="home-head-actions">
            <div className={`chip streak ${streak ? 'on' : ''}`} aria-label={`${streak} day streak`}>
              <Flame size={16} fill={streak ? 'currentColor' : 'none'} />
              {streak}
            </div>
            <button className="icon-btn" onClick={onSettings} aria-label="Settings">
              <SettingsIcon size={20} />
            </button>
          </div>
        </header>

        {/* mascot + daily goal */}
        <section className="hero card-surface">
          <button className="hero-mascot" onClick={pokeMascot} aria-label="Poke Flashy">
            <Mascot mood={mascotMood} size={96} track />
          </button>
          <div className="hero-main">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex % lines.length}
                className="bubble"
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {lines[tipIndex % lines.length]}
              </motion.p>
            </AnimatePresence>
            <div className="hero-stats">
              <ProgressRing value={today / goal} size={46} stroke={5} color="var(--accent)">
                <Target size={17} color="var(--accent-ink)" />
              </ProgressRing>
              <div className="hero-goal">
                <strong>
                  {Math.min(today, goal)}/{goal}
                </strong>
                <span>cards today</span>
              </div>
              <div className="hero-level">
                <div className="lvl-badge">
                  <Zap size={12} fill="currentColor" /> Lv {lvl.level}
                </div>
                <div className="xp-bar">
                  <span style={{ width: `${(lvl.into / lvl.span) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* generation in progress */}
        {job && job.phase !== 'cancelled' && (generating || job.phase === 'done' || job.phase === 'error') && (
          <motion.button className="gen-pill" onClick={onShowGeneration} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {generating ? <Loader2 size={18} className="spin" /> : job.phase === 'done' ? <Sparkles size={18} /> : <X size={18} />}
            <span>
              {generating
                ? job.cooldown
                  ? `AI cooling down… ${job.cooldown}s`
                  : `Creating “${job.fileName}” · ${job.cardsDone}/${job.cardsTarget || '…'} cards`
                : job.phase === 'done'
                  ? 'Your new deck is ready — tap to open'
                  : 'Card creation failed — tap for details'}
            </span>
            <ChevronRight size={18} />
          </motion.button>
        )}

        {/* primary action */}
        <motion.button className="create-hero" onClick={onCreate} whileTap={{ scale: 0.98 }}>
          <div className="create-hero-icon">
            <FileUp size={28} />
          </div>
          <div className="create-hero-text">
            <strong>Create from a PDF</strong>
            <span>Notes, chapters or papers → connected flashcards & quizzes</span>
          </div>
          <ChevronRight size={22} />
          <span className="create-hero-shine" />
        </motion.button>

        {install.canInstall && (
          <div className="install-card card-surface">
            <Download size={20} />
            <span>{install.isIos ? 'Install FlashMind: tap Share → “Add to Home Screen”.' : 'Install FlashMind for full-screen, offline study.'}</span>
            {!install.isIos && (
              <button className="btn btn-sm btn-primary" onClick={install.prompt}>
                Install
              </button>
            )}
            <button className="icon-btn plain" onClick={install.dismiss} aria-label="Dismiss">
              <X size={18} />
            </button>
          </div>
        )}

        {/* continue */}
        {continueDeck && (
          <>
            <div className="section-title">
              <h2>Continue learning</h2>
            </div>
            <ContinueCard deck={continueDeck} onOpen={() => onOpenDeck(continueDeck.id)} />
          </>
        )}

        {/* library */}
        <div className="section-title">
          <h2>Your decks</h2>
          {decks.length > 0 && <span className="muted" style={{ fontSize: 14 }}>{decks.length}</span>}
        </div>

        {decks.length === 0 ? (
          <div className="empty card-surface">
            <p>
              <strong>No decks yet.</strong> Upload a PDF to generate your first deck — or take the gestures for a spin with a
              sample made from networking lecture notes.
            </p>
            <button className="btn btn-soft btn-block" onClick={addSample}>
              <Play size={18} /> Try the sample deck
            </button>
          </div>
        ) : (
          <div className="deck-list">
            {sorted.map((d, i) => (
              <DeckRow key={d.id} deck={d} index={i} onOpen={() => onOpenDeck(d.id)} onMenu={() => setMenuDeck(d)} />
            ))}
          </div>
        )}

        {/* how it works */}
        <div className="section-title">
          <h2>How FlashMind works</h2>
        </div>
        <div className="how">
          <div className="how-item">
            <span className="how-ic" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
              {settings.nextTopicSwipe === 'down' ? <ArrowDown size={20} /> : <ArrowDown size={20} style={{ transform: 'rotate(180deg)' }} />}
            </span>
            <div>
              <strong>Swipe {settings.nextTopicSwipe}</strong>
              <span>Next topic, in the order of your PDF</span>
            </div>
          </div>
          <div className="how-item">
            <span className="how-ic" style={{ background: 'var(--accent-soft)', color: 'var(--accent-ink)' }}>
              <ArrowLeft size={20} />
            </span>
            <div>
              <strong>Swipe left</strong>
              <span>Go deeper into the current topic</span>
            </div>
          </div>
          <div className="how-item">
            <span className="how-ic" style={{ background: 'var(--mint-soft)', color: 'var(--mint)' }}>
              <Hand size={20} />
            </span>
            <div>
              <strong>Press & hold</strong>
              <span>Flip the card and answer its quiz</span>
            </div>
          </div>
        </div>
        {decks.length > 0 && !decks.some((d) => d.isSample) && (
          <button className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={addSample}>
            Add the sample deck
          </button>
        )}
      </div>

      <Sheet
        open={!!menuDeck}
        onClose={() => {
          setMenuDeck(null);
          setConfirmDelete(false);
        }}
        title={menuDeck ? `${menuDeck.emoji} ${menuDeck.title}` : ''}
        subtitle={menuDeck ? `${menuDeck.topics.length} topics · from ${menuDeck.sourceName}` : ''}
      >
        {menuDeck && (
          <DeckMenu
            deck={menuDeck}
            confirmDelete={confirmDelete}
            onAction={(a) => {
              const d = menuDeck;
              if (a === 'delete' && !confirmDelete) return setConfirmDelete(true);
              setMenuDeck(null);
              setConfirmDelete(false);
              if (a === 'open') onOpenDeck(d.id);
              if (a === 'quiz') onQuiz(d.id, 'mix');
              if (a === 'mistakes') onQuiz(d.id, 'mistakes');
              if (a === 'starred') onQuiz(d.id, 'starred');
              if (a === 'reset') actions.resetDeckProgress(d.id);
              if (a === 'delete') actions.deleteDeck(d.id);
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

function ContinueCard({ deck, onOpen }: { deck: Deck; onOpen: () => void }) {
  const progress = useStore((s) => s.progress[deck.id]);
  const st = deckStats(deck, progress);
  const pos = progress?.position ?? { topic: 0, depth: 0 };
  const topic = deck.topics[Math.min(pos.topic, deck.topics.length - 1)];
  return (
    <motion.button className="continue" onClick={onOpen} whileTap={{ scale: 0.98 }} style={{ background: topicGradient(topic?.hue ?? 0) }}>
      <div className="continue-top">
        <span className="continue-emoji">{deck.emoji}</span>
        <div className="continue-text">
          <strong>{deck.title}</strong>
          <span>
            Topic {Math.min(pos.topic + 1, deck.topics.length)} of {deck.topics.length} · {topic?.emoji} {topic?.title}
          </span>
        </div>
        <ProgressRing value={st.pct} size={52} stroke={5} color="#fff" track="rgba(255,255,255,.25)">
          <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{Math.round(st.pct * 100)}%</span>
        </ProgressRing>
      </div>
      <div className="continue-cta">
        <Play size={16} fill="currentColor" /> Continue
      </div>
    </motion.button>
  );
}

function DeckRow({ deck, index, onOpen, onMenu }: { deck: Deck; index: number; onOpen: () => void; onMenu: () => void }) {
  const progress = useStore((s) => s.progress[deck.id]);
  const st = deckStats(deck, progress);
  const acc = st.answered ? Math.round((st.correct / st.answered) * 100) : null;
  return (
    <motion.div
      className="deck-row card-surface"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
    >
      <button className="deck-row-main" onClick={onOpen} disabled={deck.topics.length === 0}>
        <span className="deck-tile" style={{ background: topicGradient(deck.topics[0]?.hue ?? index) }}>
          {deck.emoji}
        </span>
        <span className="deck-info">
          <strong>{deck.title}</strong>
          <span className="deck-meta">
            {deck.generating ? (
              <>
                <Loader2 size={13} className="spin" /> Generating · {st.total} cards so far
              </>
            ) : (
              <>
                {deck.topics.length} topics · {st.total} cards{acc !== null ? ` · ${acc}% quiz` : ''}
                {deck.isSample ? ' · sample' : ` · ${timeAgo(progress?.lastStudiedAt ?? deck.createdAt)}`}
              </>
            )}
          </span>
          <span className="deck-bar">
            <span style={{ width: `${st.pct * 100}%` }} />
          </span>
        </span>
      </button>
      <button className="icon-btn plain" onClick={onMenu} aria-label="Deck options">
        <MoreHorizontal size={20} />
      </button>
    </motion.div>
  );
}

type MenuAction = 'open' | 'quiz' | 'mistakes' | 'starred' | 'reset' | 'delete';

function DeckMenu({ deck, confirmDelete, onAction }: { deck: Deck; confirmDelete: boolean; onAction: (a: MenuAction) => void }) {
  const progress = useStore((s) => s.progress[deck.id]);
  const st = deckStats(deck, progress);
  const mistakes = st.answered - st.correct;
  return (
    <div className="menu-list">
      <button className="menu-item" onClick={() => onAction('open')} disabled={!deck.topics.length}>
        <Play size={20} /> {progress ? 'Continue studying' : 'Start studying'}
      </button>
      <button className="menu-item" onClick={() => onAction('quiz')} disabled={st.total < 1}>
        <Zap size={20} /> Quick quiz <span className="menu-sub">{Math.min(10, st.total)} questions</span>
      </button>
      <button className="menu-item" onClick={() => onAction('mistakes')} disabled={mistakes < 1}>
        <Target size={20} /> Review mistakes <span className="menu-sub">{mistakes}</span>
      </button>
      <button className="menu-item" onClick={() => onAction('starred')} disabled={st.starred < 1}>
        <Sparkles size={20} /> Starred cards <span className="menu-sub">{st.starred}</span>
      </button>
      <button className="menu-item" onClick={() => onAction('reset')} disabled={!progress}>
        <RotateCcw size={20} /> Reset progress
      </button>
      <button className={`menu-item danger ${confirmDelete ? 'confirm' : ''}`} onClick={() => onAction('delete')} disabled={deck.generating}>
        <Trash2 size={20} /> {confirmDelete ? 'Tap again to delete for good' : 'Delete deck'}
      </button>
    </div>
  );
}
