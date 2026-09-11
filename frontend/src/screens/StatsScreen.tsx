import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Zap } from 'lucide-react';
import { Mascot } from '../components/mascot/Mascot';
import { dayKey, levelFromXp, liveStreak, useStore } from '../lib/store';

interface Props {
  onSettings: () => void;
}

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function StatsScreen({ onSettings }: Props) {
  const stats = useStore((s) => s.stats);
  const decks = useStore((s) => s.decks);
  const goal = useStore((s) => s.settings.dailyGoal);
  const lvl = levelFromXp(stats.xp);
  const streak = liveStreak(stats);
  const acc = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = dayKey(d);
    return { label: i === 6 ? 'Today' : DAY[d.getDay()], n: stats.history?.[key] ?? 0 };
  });
  const max = Math.max(goal, ...week.map((w) => w.n));

  const badges = [
    { icon: '👣', name: 'First steps', desc: 'Explore your first card', got: stats.cardsSeen >= 1 },
    { icon: '📄', name: 'Deck builder', desc: 'Create a deck from a PDF', got: stats.decksCreated >= 1 },
    { icon: '🎯', name: 'Sharp mind', desc: '10 correct answers', got: stats.correct >= 10 },
    { icon: '🔥', name: 'On fire', desc: '3-day streak', got: stats.bestStreak >= 3 },
    { icon: '⚡', name: 'Combo master', desc: '5 right in a row', got: stats.bestCombo >= 5 },
    { icon: '🏁', name: 'Finisher', desc: 'Complete a deck', got: stats.decksCompleted >= 1 },
    { icon: '🤿', name: 'Deep diver', desc: 'Explore 100 cards', got: stats.cardsSeen >= 100 },
    { icon: '🎓', name: 'Scholar', desc: 'Reach level 5', got: lvl.level >= 5 },
  ];
  const earned = badges.filter((b) => b.got).length;

  return (
    <div className="scroll">
      <div className="page">
        <header className="stats-head">
          <div>
            <p className="eyebrow">Your progress</p>
            <h1>Keep the streak alive</h1>
          </div>
          <button className="icon-btn" onClick={onSettings} aria-label="Settings">
            <SettingsIcon size={20} />
          </button>
        </header>

        <section className="level-card">
          <Mascot mood={streak >= 3 ? 'laugh' : 'happy'} size={92} />
          <div className="level-info">
            <span className="lvl-badge big">
              <Zap size={14} fill="currentColor" /> Level {lvl.level}
            </span>
            <strong>{stats.xp.toLocaleString()} XP</strong>
            <div className="xp-bar light">
              <motion.span initial={{ width: 0 }} animate={{ width: `${(lvl.into / lvl.span) * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
            </div>
            <span className="level-next">{lvl.span - lvl.into} XP to level {lvl.level + 1}</span>
          </div>
        </section>

        <div className="tiles">
          <div className="tile card-surface">
            <span className="tile-ic">🔥</span>
            <strong>{streak}</strong>
            <span>day streak · best {stats.bestStreak}</span>
          </div>
          <div className="tile card-surface">
            <span className="tile-ic">🃏</span>
            <strong>{stats.cardsSeen}</strong>
            <span>cards explored</span>
          </div>
          <div className="tile card-surface">
            <span className="tile-ic">🎯</span>
            <strong>{stats.answered ? `${acc}%` : '–'}</strong>
            <span>quiz accuracy · {stats.answered} answered</span>
          </div>
          <div className="tile card-surface">
            <span className="tile-ic">📚</span>
            <strong>{decks.length}</strong>
            <span>decks · {stats.decksCompleted} completed</span>
          </div>
        </div>

        <div className="section-title">
          <h2>This week</h2>
          <span className="muted" style={{ fontSize: 14 }}>
            goal {goal}/day
          </span>
        </div>
        <div className="week card-surface">
          {week.map((w, i) => (
            <div key={i} className="week-col">
              <div className="week-bar-wrap">
                <span className="week-goal" style={{ bottom: `${(goal / max) * 100}%` }} />
                <motion.span
                  className={`week-bar ${w.n >= goal ? 'hit' : ''}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${(w.n / max) * 100}%` }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 120, damping: 18 }}
                />
              </div>
              <span className="week-n">{w.n || ''}</span>
              <span className={`week-label ${i === 6 ? 'today' : ''}`}>{w.label}</span>
            </div>
          ))}
        </div>

        <div className="section-title">
          <h2>Achievements</h2>
          <span className="muted" style={{ fontSize: 14 }}>
            {earned}/{badges.length}
          </span>
        </div>
        <div className="badges">
          {badges.map((b, i) => (
            <motion.div
              key={b.name}
              className={`badge card-surface ${b.got ? 'got' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className="badge-ic">{b.icon}</span>
              <strong>{b.name}</strong>
              <span>{b.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
