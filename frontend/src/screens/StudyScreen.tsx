import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowUp, ChevronLeft, Layers, Loader2, Map as MapIcon, RotateCcw, Star, Undo2 } from 'lucide-react';
import { SwipeCard, type Dir } from '../components/study/SwipeCard';
import { CardBack, CardFront } from '../components/study/CardFaces';
import { TopicMap } from '../components/study/TopicMap';
import { GestureTutorial } from '../components/study/GestureTutorial';
import { DeckComplete } from '../components/study/DeckComplete';
import { Reaction, type ReactionState } from '../components/study/Reaction';
import { SourceSheet } from '../components/study/SourceSheet';
import { actions, getState, useStore } from '../lib/store';
import { haptic, sfx } from '../lib/feedback';
import { burst } from '../lib/confetti';
import { toast } from '../lib/toast';
import { topicGradient } from '../lib/palette';
import { useBackHandler } from '../lib/backHandler';

interface Props {
  deckId: string;
  onExit: () => void;
  onQuiz: (mode: 'mix' | 'mistakes') => void;
}

type Move = 'deeper' | 'shallower' | 'next' | 'prev';

const PRAISE = ['Nice one!', 'Brilliant!', 'Nailed it!', 'You got it!', 'Big brain move!', 'Spot on!'];
const COMFORT = ["Close! You'll get it next time.", 'Tricky one — worth a re-read.', 'Almost! Check the explanation.', 'No worries, that one stings.'];

export function StudyScreen({ deckId, onExit, onQuiz }: Props) {
  const deck = useStore((s) => s.decks.find((d) => d.id === deckId));
  const progress = useStore((s) => s.progress[deckId]);
  const nextSwipe = useStore((s) => s.settings.nextTopicSwipe);
  const tutorialDone = useStore((s) => s.flags.gestureTutorial);

  const [pos, setPos] = useState(() => {
    const p = getState().progress[deckId]?.position ?? { topic: 0, depth: 0 };
    const d = getState().decks.find((x) => x.id === deckId);
    const topic = Math.min(p.topic, Math.max(0, (d?.topics.length ?? 1) - 1));
    const depth = Math.min(p.depth, Math.max(0, (d?.topics[topic]?.cards.length ?? 1) - 1));
    return { topic, depth };
  });
  const [flipped, setFlipped] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const [dragDir, setDragDir] = useState<Dir | null>(null);
  const [holdPulse, setHoldPulse] = useState(0);
  const [reaction, setReaction] = useState<ReactionState | null>(null);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([pos.topic]));

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const busy = useRef(false);

  useBackHandler(true, onExit);

  const topics = deck?.topics ?? [];
  const topic = topics[pos.topic];
  const card = topic?.cards[pos.depth];
  const generating = !!deck?.generating;

  const nextDir: Dir = nextSwipe === 'down' ? 'down' : 'up';
  const prevDir: Dir = nextSwipe === 'down' ? 'up' : 'down';

  const can = useMemo(
    () => ({
      deeper: !!topic && pos.depth < topic.cards.length - 1,
      shallower: pos.depth > 0,
      next: pos.topic < topics.length - 1 || (!generating && topics.length > 0),
      prev: pos.topic > 0,
    }),
    [topic, pos, topics.length, generating],
  );

  const dirToMove = useCallback(
    (d: Dir): Move => (d === 'left' ? 'deeper' : d === 'right' ? 'shallower' : d === nextDir ? 'next' : 'prev'),
    [nextDir],
  );

  // record progress whenever a card is shown, and celebrate small wins
  useEffect(() => {
    if (!deck || !card || !topic) return;
    const streakBefore = getState().stats.lastActiveDay;
    const gained = actions.markSeen(deck.id, card.id);
    actions.setPosition(deck.id, pos.topic, pos.depth);
    if (!gained) return;
    const s = getState();
    if (streakBefore !== s.stats.lastActiveDay && s.stats.streak > 1) {
      toast(`${s.stats.streak}-day streak! Keep it going`, '🔥');
    } else if (s.stats.today.cards === s.settings.dailyGoal) {
      toast(`Daily goal reached — ${s.settings.dailyGoal} cards!`, '🎯');
      sfx.win();
    } else if (topic.cards.length > 1 && topic.cards.every((c) => s.progress[deck.id]?.cards[c.id]?.seen)) {
      toast(`“${topic.title}” fully explored`, '🧠', 1800);
    }
  }, [deck, card, topic, pos.topic, pos.depth]);

  const commit = useCallback(
    (m: Move) => {
      if (m === 'next' && pos.topic >= topics.length - 1) {
        setComplete(true);
        if (deck) actions.markCompleted(deck.id);
        return;
      }
      setFlipped(false);
      setPos((p) => {
        let np = p;
        if (m === 'deeper') np = { topic: p.topic, depth: p.depth + 1 };
        if (m === 'shallower') np = { topic: p.topic, depth: p.depth - 1 };
        if (m === 'next') np = { topic: p.topic + 1, depth: 0 };
        if (m === 'prev') np = { topic: p.topic - 1, depth: 0 };
        return np;
      });
      if (m === 'next' || m === 'prev') {
        setVisited((v) => new Set(v).add(m === 'next' ? pos.topic + 1 : pos.topic - 1));
      }
    },
    [pos.topic, topics.length, deck],
  );

  const blockedFeedback = useCallback(
    (m: Move) => {
      sfx.bump();
      haptic([6, 30, 6]);
      if (m === 'deeper') toast(`That's everything on this topic — swipe ${nextDir} for the next one`, '🧭');
      else if (m === 'next' && generating) toast('Flashy is still writing the next topics…', '✍️');
      else if (m === 'prev') toast("You're at the first topic", '🏁');
      else if (m === 'shallower') toast(`This is the core card — swipe left to go deeper`, '💡');
    },
    [nextDir, generating],
  );

  const fly = useCallback(
    async (d: Dir) => {
      if (busy.current) return;
      const m = dirToMove(d);
      if (!can[m]) {
        blockedFeedback(m);
        void animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
        void animate(y, 0, { type: 'spring', stiffness: 500, damping: 30 });
        return;
      }
      busy.current = true;
      sfx.swipe();
      haptic(8);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const opts = { duration: 0.24, ease: [0.4, 0, 0.9, 0.6] as [number, number, number, number] };
      if (d === 'left' || d === 'right') await animate(x, d === 'left' ? -w * 1.15 : w * 1.15, opts);
      else await animate(y, d === 'up' ? -h : h, opts);
      flushSync(() => {
        setDragDir(null);
        commit(m);
      });
      x.set(0);
      y.set(0);
      busy.current = false;
    },
    [can, commit, dirToMove, blockedFeedback, x, y],
  );

  const onRelease = useCallback(
    (d: Dir | null, attempted: Dir | null) => {
      if (d) return void fly(d);
      if (attempted) blockedFeedback(dirToMove(attempted));
      setDragDir(null);
      void animate(x, 0, { type: 'spring', stiffness: 520, damping: 32 });
      void animate(y, 0, { type: 'spring', stiffness: 520, damping: 32 });
    },
    [fly, blockedFeedback, dirToMove, x, y],
  );

  const flip = useCallback(() => {
    setFlipped((f) => !f);
    sfx.flip();
    haptic(18);
  }, []);

  const onTap = useCallback(() => {
    if (flipped) return;
    setHoldPulse((n) => n + 1);
    toast('Press and hold the card to flip it', '👆', 1800);
  }, [flipped]);

  const onAnswer = (i: number) => {
    if (!deck || !card) return;
    const correct = i === card.quiz.answer;
    const xp = actions.answer(deck.id, card.id, i, correct);
    const combo = getState().stats.combo;
    if (correct) {
      sfx.correct();
      haptic([12, 40, 18]);
      burst(0.5, 0.45, combo >= 3 ? 90 : 50);
      setReaction({
        id: Date.now(),
        mood: combo >= 3 ? 'laugh' : 'happy',
        text: combo >= 3 ? `${combo} in a row! 🔥` : PRAISE[Math.floor(Math.random() * PRAISE.length)],
        xp,
      });
    } else {
      sfx.wrong();
      haptic([30, 50, 30]);
      setReaction({ id: Date.now(), mood: 'sad', text: COMFORT[Math.floor(Math.random() * COMFORT.length)], xp: 0 });
    }
  };

  // keyboard support (desktop / accessibility)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mapOpen || sourceOpen || complete || !tutorialDone) return;
      if ((e.target as HTMLElement)?.closest('input, textarea')) return;
      if (e.key === 'ArrowLeft') void fly('left');
      else if (e.key === 'ArrowRight') void fly('right');
      else if (e.key === 'ArrowDown') void fly(nextDir);
      else if (e.key === 'ArrowUp') void fly(prevDir);
      else if (e.key === ' ' || e.key === 'Enter') {
        if ((e.target as HTMLElement)?.closest('button')) return;
        e.preventDefault();
        flip();
      } else return;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fly, flip, nextDir, prevDir, mapOpen, sourceOpen, complete, tutorialDone]);

  // live drag hint
  const hintOpacity = useTransform([x, y], ([vx, vy]: number[]) => Math.min(1, Math.max(Math.abs(vx), Math.abs(vy)) / 90));
  const dragMove = dragDir ? dirToMove(dragDir) : null;
  const peek = (() => {
    if (!topic) return null;
    const m = dragMove ?? (can.deeper ? 'deeper' : 'next');
    if (m === 'deeper' && can.deeper) return { t: topic, c: topic.cards[pos.depth + 1], label: 'Go deeper' };
    if (m === 'shallower' && can.shallower) return { t: topic, c: topic.cards[pos.depth - 1], label: 'Back a level' };
    if (m === 'next' && pos.topic < topics.length - 1) return { t: topics[pos.topic + 1], c: topics[pos.topic + 1].cards[0], label: 'Next topic' };
    if (m === 'prev' && can.prev) return { t: topics[pos.topic - 1], c: topics[pos.topic - 1].cards[0], label: 'Previous topic' };
    return null;
  })();
  const hint = (() => {
    if (!dragMove) return null;
    if (!can[dragMove]) {
      if (dragMove === 'deeper') return { icon: <Layers size={15} />, text: 'End of this topic' };
      if (dragMove === 'next' && generating) return { icon: <Loader2 size={15} className="spin" />, text: 'More topics coming…' };
      return { icon: <RotateCcw size={15} />, text: dragMove === 'prev' ? 'First topic' : 'Core card' };
    }
    if (dragMove === 'next' && pos.topic >= topics.length - 1) return { icon: <span>🏁</span>, text: 'Finish deck' };
    return {
      icon: dragMove === 'deeper' ? <ArrowLeft size={15} /> : dragMove === 'shallower' ? <Undo2 size={15} /> : nextDir === 'down' ? (dragMove === 'next' ? <ArrowDown size={15} /> : <ArrowUp size={15} />) : dragMove === 'next' ? <ArrowUp size={15} /> : <ArrowDown size={15} />,
      text: `${peek?.label ?? ''}${peek ? ` · ${peek.c.title}` : ''}`,
    };
  })();

  if (!deck || !topic || !card) {
    return (
      <div className="study-empty">
        <p>This deck is empty.</p>
        <button className="btn btn-primary" onClick={onExit}>
          Back home
        </button>
      </div>
    );
  }

  const starred = !!progress?.cards[card.id]?.starred;
  const cp = progress?.cards[card.id];
  const manySegments = topics.length > 28;

  return (
    <div className="study">
      {/* top bar */}
      <header className="study-top">
        <button className="icon-btn" onClick={onExit} aria-label="Back to home">
          <ChevronLeft size={22} />
        </button>
        <div className="study-title">
          <strong>
            {deck.emoji} {deck.title}
          </strong>
          <span>
            Topic {pos.topic + 1} of {topics.length}
            {generating && ' · writing more…'}
          </span>
        </div>
        <button
          className={`icon-btn ${starred ? 'starred' : ''}`}
          onClick={() => {
            actions.toggleStar(deck.id, card.id);
            haptic(10);
            if (!starred) toast('Starred for later review', '⭐', 1500);
          }}
          aria-label={starred ? 'Unstar card' : 'Star card'}
          aria-pressed={starred}
        >
          <Star size={20} fill={starred ? 'currentColor' : 'none'} />
        </button>
        <button className="icon-btn" onClick={() => setMapOpen(true)} aria-label="Deck map">
          <MapIcon size={20} />
        </button>
      </header>

      <div className={`topic-rail ${manySegments ? 'continuous' : ''}`} aria-hidden="true">
        {manySegments ? (
          <span className="rail-fill" style={{ width: `${((pos.topic + 1) / topics.length) * 100}%` }} />
        ) : (
          topics.map((t, i) => (
            <span
              key={t.id}
              className={`rail-seg ${i === pos.topic ? 'current' : visited.has(i) || progress?.cards[t.cards[0].id]?.seen ? 'done' : ''}`}
              style={i === pos.topic ? { background: topicGradient(t.hue, 90) } : undefined}
            />
          ))
        )}
      </div>

      {/* stage */}
      <div className="stage">
        <motion.div className="drag-hint" style={{ opacity: hintOpacity }}>
          {hint && (
            <>
              {hint.icon}
              <span>{hint.text}</span>
            </>
          )}
        </motion.div>

        <div className="card-slot">
          {peek && (
            <div className="peek" aria-hidden="true">
              <div className="face front peek-face" style={{ background: topicGradient(peek.t.hue, 150) }}>
                <div className="face-top">
                  <span className="topic-chip">
                    {peek.t.emoji} <span className="topic-chip-text">{peek.t.title}</span>
                  </span>
                </div>
                <div className="face-content">
                  <h2 className="face-title">{peek.c.title}</h2>
                </div>
              </div>
            </div>
          )}
          <SwipeCard
            key={card.id}
            x={x}
            y={y}
            flipped={flipped}
            allowed={(d) => {
              const m = dirToMove(d);
              return can[m];
            }}
            onDir={setDragDir}
            onRelease={onRelease}
            onHold={flip}
            onTap={onTap}
            front={
              <CardFront
                card={card}
                topic={topic}
                depth={pos.depth}
                hasDeeper={can.deeper}
                nextLabel={pos.topic < topics.length - 1 ? `swipe ${nextDir} · next topic` : generating ? 'more topics coming' : `swipe ${nextDir} to finish`}
                holdPulse={holdPulse}
                onSource={() => setSourceOpen(true)}
              />
            }
            back={<CardBack card={card} topic={topic} storedPick={cp?.picked} onAnswer={onAnswer} />}
          />
        </div>
      </div>

      {/* controls */}
      <nav className="controls" aria-label="Card navigation">
        <button
          className="ctl"
          onClick={() => void fly(can.shallower ? 'right' : prevDir)}
          disabled={!can.shallower && !can.prev}
          aria-label={can.shallower ? 'Back a level' : 'Previous topic'}
        >
          <Undo2 size={20} />
          <span>Back</span>
        </button>
        <button className="ctl" onClick={() => void fly('left')} disabled={!can.deeper} aria-label="Go deeper">
          <Layers size={20} />
          <span>Deeper</span>
          {can.deeper && <em className="ctl-badge">{topic.cards.length - pos.depth - 1}</em>}
        </button>
        <button className={`ctl ctl-main ${flipped ? 'on' : ''}`} onClick={flip} aria-label={flipped ? 'Show card' : 'Show quiz'}>
          <RotateCcw size={20} />
          <span>{flipped ? 'Card' : 'Quiz'}</span>
          {cp?.picked !== undefined && <em className={`ctl-dot ${cp.correct ? 'ok' : 'no'}`} />}
        </button>
        <button className="ctl" onClick={() => void fly(nextDir)} disabled={!can.next} aria-label="Next topic">
          {nextDir === 'down' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
          <span>Next</span>
        </button>
      </nav>

      <Reaction state={reaction} onDone={() => setReaction(null)} />

      <SourceSheet open={sourceOpen} onClose={() => setSourceOpen(false)} card={card} fileName={deck.sourceName} />

      <TopicMap
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        deck={deck}
        progress={progress}
        current={pos}
        onJump={(t, d) => {
          setMapOpen(false);
          setFlipped(false);
          setPos({ topic: t, depth: d });
          setVisited((v) => new Set(v).add(t));
        }}
      />

      <AnimatePresence>
        {!tutorialDone && <GestureTutorial nextDir={nextDir} onDone={() => actions.setFlag({ gestureTutorial: true })} />}
      </AnimatePresence>

      <AnimatePresence>
        {complete && (
          <DeckComplete
            deck={deck}
            progress={progress}
            onClose={onExit}
            onRestart={() => {
              setComplete(false);
              setFlipped(false);
              setPos({ topic: 0, depth: 0 });
            }}
            onQuiz={onQuiz}
            onDismiss={() => setComplete(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
