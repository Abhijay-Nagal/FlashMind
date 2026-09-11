import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, BookOpenCheck, CheckCircle2, FileText, Layers, Lock, RefreshCw, Sparkles, Upload, Wand2 } from 'lucide-react';
import { countWords, extractPdf, PdfError } from '../lib/pdf';
import { DENSITY, estimateCards, type Density } from '../lib/planner';
import { startGeneration, useGenJob, type PdfSource } from '../lib/generator';
import { serverStatus } from '../lib/llmClient';
import { useStore } from '../lib/store';
import { haptic, sfx } from '../lib/feedback';
import { Mascot } from '../components/mascot/Mascot';

interface Props {
  onStarted: () => void;
  onSettings: () => void;
}

type Parse =
  | { state: 'idle' }
  | { state: 'reading'; name: string; size: number; done: number; total: number }
  | { state: 'ready'; name: string; size: number; source: PdfSource }
  | { state: 'error'; name: string; message: string };

const DENSITY_LABEL: Record<Density, { label: string; hint: string }> = {
  light: { label: 'Light', hint: 'Key ideas only' },
  balanced: { label: 'Balanced', hint: 'Recommended' },
  deep: { label: 'Deep', hint: 'Every detail' },
};

export function CreateScreen({ onStarted, onSettings }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parse, setParse] = useState<Parse>({ state: 'idle' });
  const [density, setDensity] = useState<Density>('balanced');
  const [engine, setEngine] = useState<'checking' | 'server' | 'key' | 'missing'>('checking');
  const apiKey = useStore((s) => s.settings.apiKey);
  const job = useGenJob();
  const busy = !!job && (job.phase === 'planning' || job.phase === 'writing' || job.phase === 'reading');

  useEffect(() => {
    let alive = true;
    serverStatus().then((s) => {
      if (!alive) return;
      setEngine(s.serverKey ? 'server' : apiKey.trim() ? 'key' : 'missing');
    });
    return () => {
      alive = false;
    };
  }, [apiKey]);

  const pick = () => inputRef.current?.click();

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
      setParse({ state: 'error', name: file.name, message: 'Please choose a PDF file.' });
      return;
    }
    haptic(8);
    setParse({ state: 'reading', name: file.name, size: file.size, done: 0, total: 0 });
    try {
      const pdf = await extractPdf(file, (done, total) =>
        setParse((p) => (p.state === 'reading' && p.name === file.name ? { ...p, done, total } : p)),
      );
      const words = countWords(pdf.pages);
      if (words < 60) {
        throw new PdfError(
          'no_text',
          "This PDF has almost no selectable text — it looks like scanned images. Try a text-based PDF (exported from Word, Google Docs, slides…).",
        );
      }
      sfx.pop();
      setParse({ state: 'ready', name: file.name, size: file.size, source: { fileName: file.name, pages: pdf.pages, words, title: pdf.title } });
    } catch (e) {
      setParse({ state: 'error', name: file.name, message: e instanceof PdfError ? e.message : "We couldn't read this PDF. Try another file." });
    }
  };

  const generate = () => {
    if (parse.state !== 'ready' || busy) return;
    haptic([10, 40, 16]);
    void startGeneration(parse.source, density);
    onStarted();
    setParse({ state: 'idle' });
  };

  const est = parse.state === 'ready' ? estimateCards(parse.source.pages.length, parse.source.words, density) : 0;
  const topics = parse.state === 'ready' ? Math.max(2, Math.round(est / DENSITY[density].avgDepth)) : 0;

  return (
    <div className="scroll">
      <div className="page">
        <header className="create-head">
          <p className="eyebrow">New deck</p>
          <h1>
            Turn your PDF into <span className="grad-text">flashcards</span>
          </h1>
          <p className="muted">Cards are written only from your document — in its order, topic by topic.</p>
        </header>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />

        <AnimatePresence mode="wait">
          {parse.state === 'idle' || parse.state === 'error' ? (
            <motion.button
              key="drop"
              className={`dropzone ${parse.state === 'error' ? 'error' : ''}`}
              onClick={pick}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              whileTap={{ scale: 0.98 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                void onFile(e.dataTransfer.files?.[0]);
              }}
            >
              <div className="drop-art">
                <motion.div className="drop-sheet s1" animate={{ rotate: [-8, -12, -8] }} transition={{ duration: 3, repeat: Infinity }} />
                <motion.div className="drop-sheet s2" animate={{ rotate: [6, 10, 6] }} transition={{ duration: 3.4, repeat: Infinity }} />
                <motion.div className="drop-icon" animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Upload size={30} strokeWidth={2.4} />
                </motion.div>
              </div>
              <strong>{parse.state === 'error' ? 'Try another PDF' : 'Choose a PDF'}</strong>
              <span>Lecture notes, textbook chapters, papers · up to 60 MB</span>
              {parse.state === 'error' && (
                <span className="drop-error">
                  <AlertTriangle size={16} /> {parse.message}
                </span>
              )}
            </motion.button>
          ) : (
            <motion.div key="file" className="file-card card-surface" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="file-row">
                <div className="file-icon">
                  <FileText size={26} />
                </div>
                <div className="file-info">
                  <strong>{parse.name}</strong>
                  <span>
                    {(parse.size / 1024 / 1024).toFixed(parse.size > 1024 * 1024 ? 1 : 2)} MB
                    {parse.state === 'ready' && ` · ${parse.source.pages.length} pages · ${parse.source.words.toLocaleString()} words`}
                  </span>
                </div>
                {parse.state === 'ready' ? (
                  <button className="icon-btn plain" onClick={pick} aria-label="Choose a different PDF">
                    <RefreshCw size={19} />
                  </button>
                ) : null}
              </div>
              {parse.state === 'reading' ? (
                <div className="reading">
                  <div className="reading-bar">
                    <motion.span animate={{ width: `${parse.total ? (parse.done / parse.total) * 100 : 8}%` }} />
                  </div>
                  <span>
                    Reading on your device… {parse.done}/{parse.total || '?'} pages
                  </span>
                </div>
              ) : (
                <div className="file-ok">
                  <CheckCircle2 size={16} /> Text extracted — ready to generate
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {parse.state === 'ready' && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="section-title">
              <h2>How deep should we go?</h2>
            </div>
            <div className="segmented density">
              {(Object.keys(DENSITY_LABEL) as Density[]).map((d) => (
                <button key={d} className={density === d ? 'active' : ''} onClick={() => setDensity(d)}>
                  <span className="dl">{DENSITY_LABEL[d].label}</span>
                  <span className="dh">{DENSITY_LABEL[d].hint}</span>
                </button>
              ))}
            </div>

            <div className="estimate card-surface">
              <div className="est-item">
                <Layers size={20} />
                <strong>
                  <motion.span key={est} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    ~{est}
                  </motion.span>
                </strong>
                <span>cards</span>
              </div>
              <div className="est-item">
                <BookOpenCheck size={20} />
                <strong>~{topics}</strong>
                <span>topics</span>
              </div>
              <div className="est-item">
                <Sparkles size={20} />
                <strong>{est}</strong>
                <span>quizzes</span>
              </div>
            </div>
          </motion.section>
        )}

        <button className="btn btn-primary btn-block generate-btn" disabled={parse.state !== 'ready' || busy} onClick={generate}>
          <Wand2 size={20} />
          {busy ? 'Already creating a deck…' : 'Generate flashcards'}
        </button>

        <div className={`engine ${engine}`}>
          <span className="engine-dot" />
          {engine === 'checking' && 'Checking AI engine…'}
          {engine === 'server' && 'AI engine ready'}
          {engine === 'key' && 'AI engine ready · using your Groq key'}
          {engine === 'missing' && (
            <>
              AI key needed —{' '}
              <button className="link" onClick={onSettings}>
                add a free Groq key
              </button>
            </>
          )}
        </div>

        <div className="privacy">
          <Lock size={15} />
          <span>Your PDF is read on this device. Only its text is sent to the AI to write cards.</span>
        </div>

        {parse.state === 'idle' && (
          <div className="create-mascot">
            <Mascot mood="think" size={84} />
            <p>I'll read your PDF, map its topics in order, then write a chain of cards and a quiz for each one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
