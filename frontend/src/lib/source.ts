/**
 * Finds the passage of the PDF a card was written from, so learners (and
 * teachers) can verify every card against the original document.
 */

const STOP = new Set(
  'the and for are but not you all any can had her was one our out has have been from this that with they will into more than then them these those which what when where while also such each other their there about over only very just like most some many much used uses using make made called between because through during without within upon onto per its it’s is of in on to by as at or an be a'.split(
    ' ',
  ),
);

export function keywords(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9][a-z0-9-]{2,}/g) ?? []).filter((w) => !STOP.has(w));
}

function sentences(text: string): string[] {
  // no regex look-behind: older iOS Safari can't parse it
  const parts = text.replace(/\s+/g, ' ').split(/([.!?])\s+/);
  const out: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const s = (parts[i] + (parts[i + 1] ?? '')).trim();
    if (s.length > 12) out.push(s);
  }
  return out;
}

export interface SourceHit {
  page: number;
  text: string;
}

/**
 * @param pages   all page texts of the PDF (index 0 = page 1)
 * @param hint    page the model cited (may be wrong or missing)
 * @param range   pages of the section the card came from (1-based, inclusive)
 */
export function findSource(pages: string[], hint: number | null, range: [number, number], title: string, body: string): SourceHit | null {
  const target = new Set(keywords(`${title} ${title} ${body}`));
  if (!target.size) return null;

  const candidates = new Set<number>();
  if (hint && hint >= range[0] && hint <= range[1]) {
    for (const p of [hint, hint - 1, hint + 1]) if (p >= range[0] && p <= range[1]) candidates.add(p);
  } else {
    for (let p = range[0]; p <= range[1]; p++) candidates.add(p);
  }

  let best: { page: number; idx: number; score: number; list: string[] } | null = null;
  for (const p of candidates) {
    const list = sentences(pages[p - 1] ?? '');
    list.forEach((s, idx) => {
      const ws = new Set(keywords(s));
      let hits = 0;
      for (const w of ws) if (target.has(w)) hits++;
      const score = hits / Math.sqrt(Math.max(ws.size, 4)) + (p === hint ? 0.15 : 0);
      if (!best || score > best.score) best = { page: p, idx, score, list };
    });
  }
  const b = best as { page: number; idx: number; score: number; list: string[] } | null;
  if (!b || b.score < 0.5) return null;

  let text = b.list[b.idx];
  if (text.length < 170 && b.list[b.idx + 1]) text += ' ' + b.list[b.idx + 1];
  if (text.length < 120 && b.idx > 0) text = b.list[b.idx - 1] + ' ' + text;
  if (text.length > 420) text = text.slice(0, 417).replace(/\s+\S*$/, '') + '…';
  return { page: b.page, text };
}
