import { Fragment } from 'react';
import { FileText } from 'lucide-react';
import { Sheet } from '../common/Sheet';
import { keywords } from '../../lib/source';
import type { Card } from '../../types/deck';

interface Props {
  open: boolean;
  onClose: () => void;
  card: Card;
  fileName: string;
}

/** Shows the exact passage of the uploaded PDF a card was written from. */
export function SourceSheet({ open, onClose, card, fileName }: Props) {
  const terms = new Set(keywords(`${card.title} ${card.body}`));
  const parts = (card.source ?? '').split(/(\s+)/);

  return (
    <Sheet open={open} onClose={onClose} title="From your PDF" subtitle={`${fileName}${card.page ? ` · page ${card.page}` : ''}`}>
      <figure className="source">
        <span className="source-mark" aria-hidden="true">
          “
        </span>
        <blockquote>
          {parts.map((w, i) => {
            const key = w.toLowerCase().replace(/[^a-z0-9-]/g, '');
            return terms.has(key) ? <mark key={i}>{w}</mark> : <Fragment key={i}>{w}</Fragment>;
          })}
        </blockquote>
        <figcaption>
          <FileText size={14} /> Page {card.page ?? '?'} of your document
        </figcaption>
      </figure>
      <p className="source-note">
        The card <strong>“{card.title}”</strong> was written from this passage. Highlighted words appear in both.
      </p>
    </Sheet>
  );
}
