import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Zap, BookOpen, BrainCircuit, Loader2 } from 'lucide-react';
import { generateFlashcards, generateSummary, generateQA } from '../../services/api';
import type { Flashcard } from '../../types/flashcard';

interface Props {
  onFlashcardsGenerated: (cards: Flashcard[]) => void;
}

export function UploadView({ onFlashcardsGenerated }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<string | null>(null); // 'flashcards' | 'summary' | 'qa'
  const [summary, setSummary] = useState<string | null>(null);
  const [qaList, setQaList] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setSummary(null);
      setQaList(null);
      setError(null);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!file) return;
    setLoading('flashcards');
    setError(null);
    try {
      const data = await generateFlashcards(file);
      onFlashcardsGenerated(data.flashcards);
    } catch (err: any) {
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateSummary = async () => {
    if (!file) return;
    setLoading('summary');
    setError(null);
    try {
      const data = await generateSummary(file);
      setSummary(data.summary);
      setQaList(null);
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateQA = async () => {
    if (!file) return;
    setLoading('qa');
    setError(null);
    try {
      const data = await generateQA(file);
      setQaList(data.quiz);
      setSummary(null);
    } catch (err: any) {
      setError(err.message || 'Failed to generate Q/A');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="upload-view">
      <h2 className="upload-title">Create Materials</h2>
      <p className="upload-subtitle">Upload a PDF to generate study resources using AI.</p>
      
      <div 
        className="upload-dropzone" 
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf" 
          style={{ display: 'none' }} 
        />
        {file ? (
          <>
            <FileText size={48} className="upload-icon-active" />
            <h3 className="upload-file-name">{file.name}</h3>
            <p className="upload-file-size">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </>
        ) : (
          <>
            <Upload size={48} className="upload-icon-inactive" />
            <h3 className="upload-file-name">Select a PDF</h3>
            <p className="upload-file-size">Click to browse your files</p>
          </>
        )}
      </div>

      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      <div className="upload-actions">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mcq-option-btn upload-action-btn ${loading === 'flashcards' ? 'active-flashcards' : ''}`}
          onClick={handleGenerateFlashcards}
          disabled={!file || loading !== null}
        >
          {loading === 'flashcards' ? <Loader2 className="spinner" size={24} /> : <Zap size={24} color="var(--color-primary)" />}
          <span>Flashcards</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mcq-option-btn upload-action-btn ${loading === 'summary' ? 'active-summary' : ''}`}
          onClick={handleGenerateSummary}
          disabled={!file || loading !== null}
        >
          {loading === 'summary' ? <Loader2 className="spinner" size={24} /> : <BookOpen size={24} color="var(--color-accent)" />}
          <span>Summary</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mcq-option-btn upload-action-btn ${loading === 'qa' ? 'active-qa' : ''}`}
          onClick={handleGenerateQA}
          disabled={!file || loading !== null}
        >
          {loading === 'qa' ? <Loader2 className="spinner" size={24} /> : <BrainCircuit size={24} color="var(--color-success)" />}
          <span>Quiz</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {summary && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="upload-result-container"
          >
            <h3 className="upload-result-title text-accent"><BookOpen size={24} /> Summary</h3>
            <div className="upload-result-content" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>') }} />
          </motion.div>
        )}

        {qaList && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="upload-result-container"
          >
            <h3 className="upload-result-title text-success"><BrainCircuit size={24} /> Q/A Quiz</h3>
            <div className="qa-list">
              {qaList.map((q: any, i: number) => (
                <motion.div 
                  key={q.id || i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="qa-item"
                >
                  <p className="qa-question">{i + 1}. {q.question}</p>
                  <div className="qa-options">
                    {q.options.map((opt: any) => (
                      <div key={opt.id} className={`qa-option ${opt.id === q.correctAnswerId ? 'correct' : ''}`}>
                        <span className="qa-option-label">{opt.id.toUpperCase()}</span> {opt.text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
