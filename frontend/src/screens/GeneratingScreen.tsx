import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Coffee, Loader2, Play, Settings as SettingsIcon, X } from 'lucide-react';
import { cancelGeneration, dismissJob, useGenJob, type GenJob } from '../lib/generator';
import { Mascot } from '../components/mascot/Mascot';
import { topicGradient } from '../lib/palette';
import { celebrate } from '../lib/confetti';
import { haptic, sfx } from '../lib/feedback';
import { useBackHandler } from '../lib/backHandler';
import { toast } from '../lib/toast';

interface Props {
  open: boolean;
  onMinimize: () => void;
  onStudy: (deckId: string) => void;
  onSettings: () => void;
  onSample: () => void;
}

const TIPS = [
  'Swipe left on any card to go deeper into the same topic.',
  'Press and hold a card to flip it and answer its quiz.',
  'Topics follow the order of your PDF, so you study it like the author intended.',
  'Every card shows the PDF page it came from — handy for revision.',
  'Answer quizzes in a row to build a combo and earn bonus XP.',
  'Tap the map icon while studying to jump to any topic.',
];

function useProgress(job: GenJob | null) {
  // Smooth, honest progress: real card counts plus a slow creep while waiting.
  const [elapsed, setElapsed] = useState(0);
  const done = job?.cardsDone ?? 0;
  const [prevDone, setPrevDone] = useState(done);
  if (done !== prevDone) {
    setPrevDone(done);
    setElapsed(0);
  }
  const writing = job?.phase === 'writing';
  useEffect(() => {
    if (!writing) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [writing]);
  const creep = Math.min(elapsed * 0.35, 1);
  if (!job) return 0;
  if (job.phase === 'done') return 100;
  if (job.phase === 'planning' || job.phase === 'reading') return 6;
  const target = Math.max(job.cardsTarget, 1);
  const real = Math.min(job.cardsDone / target, 1);
  const perSection = 1 / Math.max(job.sectionsTotal, 1);
  const next = Math.min(real + perSection * 0.85, 0.97);
  return Math.round(8 + (real + (next - real) * (1 - Math.exp(-creep * 2.2)) * (job.cardsDone < target ? 1 : 0)) * 90);
}

export function GeneratingScreen({ open, onMinimize, onStudy, onSettings, onSample }: Props) {
  const job = useGenJob();
  const [tip, setTip] = useState(0);
  const pct = useProgress(job);
  const celebrated = useRef<string | null>(null);

  useBackHandler(open, onMinimize);

  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setTip((i) => (i + 1) % TIPS.length), 4500);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    if (open && job?.phase === 'done' && celebrated.current !== job.id) {
      celebrated.current = job.id;
      celebrate();
      sfx.win();
      haptic([20, 60, 30]);
    }
  }, [open, job?.phase, job?.id]);

  // cancelled: close the overlay, keep whatever was already written
  const onMinimizeRef = useRef(onMinimize);
  useEffect(() => {
    onMinimizeRef.current = onMinimize;
  });
  useEffect(() => {
    if (job?.phase !== 'cancelled') return;
    toast(job.deckId ? `Stopped — kept the ${job.cardsDone} cards already made` : 'Card creation cancelled', '✋');
    dismissJob();
    onMinimizeRef.current();
  }, [job?.phase, job?.deckId, job?.cardsDone]);

  const prevCount = useRef(0);
  useEffect(() => {
    if (!job) return;
    if (job.preview.length > prevCount.current && open) {
      sfx.pop();
      haptic(8);
    }
    prevCount.current = job.preview.length;
  }, [job, open]);

  if (!job) return null;
  const writing = job.phase === 'writing' || job.phase === 'planning' || job.phase === 'reading';
  const mood = job.phase === 'done' ? 'laugh' : job.phase === 'error' ? 'sad' : job.cooldown ? 'sleep' : 'think';
  const steps = [
    { label: `Read ${job.pageCount} pages`, done: true, active: false },
    { label: 'Map the topics in order', done: job.phase !== 'planning', active: job.phase === 'planning' },
    {
      label:
        job.phase === 'done'
          ? `Wrote ${job.cardsDone} cards`
          : `Write cards${job.cardsTarget ? ` · ${job.cardsDone}/${Math.max(job.cardsTarget, job.cardsDone)}` : ''}`,
      done: job.phase === 'done',
      active: job.phase === 'writing',
    },
    { label: 'Link related cards & quizzes', done: job.phase === 'done', active: false },
  ];

  const startNow = () => job.deckId && onStudy(job.deckId);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="gen"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        >
          <div className="gen-top">
            <button className="icon-btn" onClick={onMinimize} aria-label="Minimise">
              <ChevronDown size={22} />
            </button>
            <div className="gen-file">
              <span className="eyebrow">{job.phase === 'done' ? 'Deck ready' : job.phase === 'error' ? 'Something went wrong' : 'Creating your deck'}</span>
              <strong>{job.fileName}</strong>
            </div>
            {writing ? (
              <button className="btn btn-sm btn-ghost" onClick={cancelGeneration}>
                Cancel
              </button>
            ) : (
              <button
                className="icon-btn"
                onClick={() => {
                  dismissJob();
                  onMinimize();
                }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="gen-stage">
            <div className="forge">
              <AnimatePresence>
                {job.preview.length === 0 &&
                  writing &&
                  [0, 2, 1].map((i) => (
                      <motion.div
                        key={`ghost-${i}`}
                        className={`forge-card ghost g${i}`}
                        initial={{ opacity: 0, y: 40, rotate: 0 }}
                        animate={{ opacity: 1, y: i === 1 ? [0, -8, 0] : 0, rotate: (i - 1) * 11, x: (i - 1) * 38 }}
                        exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
                        transition={{
                          default: { delay: i * 0.08, type: 'spring', stiffness: 200, damping: 18 },
                          y: i === 1 ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : undefined,
                        }}
                      >
                        {i === 1 && (
                          <>
                            <span className="sk sk-1" />
                            <span className="sk sk-2" />
                            <span className="sk sk-3" />
                            <span className="sk sk-4" />
                            <motion.span
                              className="forge-pen"
                              animate={{ x: [0, 90, 20, 110, 0], y: [0, 0, 26, 26, 0], rotate: [0, 8, -4, 8, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                              ✍️
                            </motion.span>
                          </>
                        )}
                      </motion.div>
                  ))}
              </AnimatePresence>
              {job.preview.slice(-6).map((t, i, arr) => {
                const fromTop = arr.length - 1 - i;
                return (
                  <motion.div
                    key={`${t.title}-${job.preview.length - arr.length + i}`}
                    className="forge-card"
                    style={{ background: topicGradient(t.hue), zIndex: i }}
                    initial={{ y: -260, rotate: -25, opacity: 0, scale: 0.8 }}
                    animate={{
                      y: fromTop * -7,
                      x: fromTop * (i % 2 ? 7 : -7),
                      rotate: fromTop === 0 ? 0 : (i % 2 ? 1 : -1) * (4 + fromTop * 2),
                      opacity: fromTop > 3 ? 0 : 1,
                      scale: 1 - fromTop * 0.035,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  >
                    <span className="forge-emoji">{t.emoji}</span>
                    <span className="forge-num">Topic {job.preview.length - arr.length + i + 1}</span>
                    <strong>{t.title}</strong>
                    <span className="forge-count">{t.cards} cards</span>
                  </motion.div>
                );
              })}
              <div className="forge-mascot">
                <Mascot mood={mood} size={92} />
              </div>
            </div>

            {job.phase !== 'error' && (
              <div className="gen-progress">
                <div className="gen-bar">
                  <motion.span animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 60, damping: 20 }} />
                </div>
                <span className="gen-pct">{pct}%</span>
              </div>
            )}

            {job.phase === 'error' ? (
              <div className="gen-error">
                <p>{job.error?.message}</p>
                <div className="gen-actions">
                  {(job.error?.kind === 'no_api_key' || job.error?.kind === 'no_server') && (
                    <button className="btn btn-primary btn-block" onClick={onSettings}>
                      <SettingsIcon size={18} /> Open AI settings
                    </button>
                  )}
                  {job.deckId && (
                    <button className="btn btn-soft btn-block" onClick={startNow}>
                      <Play size={18} /> Study the cards that were made
                    </button>
                  )}
                  <button className="btn btn-soft btn-block" onClick={onSample}>
                    Try the sample deck instead
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ul className="steps">
                  {steps.map((s) => (
                    <li key={s.label} className={s.done ? 'done' : s.active ? 'active' : ''}>
                      <span className="step-ic">
                        {s.done ? <Check size={14} strokeWidth={3} /> : s.active ? <Loader2 size={14} className="spin" /> : null}
                      </span>
                      {s.label}
                    </li>
                  ))}
                </ul>

                <AnimatePresence mode="wait">
                  {job.cooldown > 0 ? (
                    <motion.p key="cool" className="gen-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Coffee size={16} /> The free AI tier needs a short breather — resuming in {job.cooldown}s
                    </motion.p>
                  ) : job.phase === 'done' ? (
                    <motion.p key="done" className="gen-note ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      🎉 {job.cardsDone} cards across {job.preview.length} topics — each with its own quiz.
                    </motion.p>
                  ) : (
                    <motion.p key={tip} className="gen-note" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                      💡 {TIPS[tip]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {job.phase !== 'error' && (
            <div className="gen-bottom">
              {job.phase === 'done' ? (
                <button className="btn btn-primary btn-block" onClick={startNow}>
                  <Play size={18} fill="currentColor" /> Start learning
                </button>
              ) : job.deckId && job.cardsDone > 0 ? (
                <button className="btn btn-accent btn-block" onClick={startNow}>
                  <Play size={18} fill="currentColor" /> Start now · {job.cardsDone} cards ready
                </button>
              ) : (
                <button className="btn btn-soft btn-block" onClick={onMinimize}>
                  Keep browsing — I'll keep working
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
