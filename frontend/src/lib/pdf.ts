/**
 * PDF → text, entirely in the browser (pdf.js). Nothing is uploaded except the
 * extracted text of each section when cards are generated.
 * pdf.js is loaded lazily so it doesn't slow down app start-up.
 */

export interface ExtractedPdf {
  pages: string[];
  title?: string;
}

export class PdfError extends Error {
  kind: 'password' | 'invalid' | 'no_text' | 'too_big';
  constructor(kind: PdfError['kind'], message: string) {
    super(message);
    this.kind = kind;
  }
}

export const MAX_PDF_BYTES = 60 * 1024 * 1024;

export async function extractPdf(
  file: File,
  onProgress: (done: number, total: number) => void,
  signal?: AbortSignal,
): Promise<ExtractedPdf> {
  if (file.size > MAX_PDF_BYTES) throw new PdfError('too_big', 'That PDF is larger than 60 MB. Try a smaller file.');

  let pdfjs: typeof import('pdfjs-dist/legacy/build/pdf.mjs');
  let worker: { default: string };
  try {
    [pdfjs, worker] = await Promise.all([
      import('pdfjs-dist/legacy/build/pdf.mjs'),
      import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
    ]);
  } catch {
    // a new version was deployed and the old chunk is gone: reload once to pick it up
    if (navigator.onLine && !sessionStorage.getItem('fm.reloadedForChunk')) {
      sessionStorage.setItem('fm.reloadedForChunk', '1');
      location.reload();
    }
    throw new PdfError('invalid', 'Could not load the PDF reader. Check your connection and try again.');
  }
  sessionStorage.removeItem('fm.reloadedForChunk');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const data = new Uint8Array(await file.arrayBuffer());
  const task = pdfjs.getDocument({ data });
  let doc: Awaited<typeof task.promise>;
  try {
    doc = await task.promise;
  } catch (e) {
    const name = (e as { name?: string })?.name;
    if (name === 'PasswordException') throw new PdfError('password', 'This PDF is password-protected. Please unlock it first.');
    throw new PdfError('invalid', "We couldn't open this file. Is it a valid PDF?");
  }

  const pages: string[] = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      let text = '';
      for (const item of content.items) {
        if (!('str' in item)) continue;
        const s = item.str;
        if (s && text && !/\s$/.test(text) && !/^\s/.test(s)) text += ' ';
        text += s;
        if (item.hasEOL) text += '\n';
      }
      pages.push(text);
      page.cleanup();
      onProgress(i, doc.numPages);
    }
    let title: string | undefined;
    try {
      const meta = await doc.getMetadata();
      const t = (meta.info as Record<string, unknown> | undefined)?.Title;
      if (typeof t === 'string' && t.trim().length > 3) title = t.trim();
    } catch {
      /* no metadata */
    }
    return { pages: stripBackMatter(cleanPages(pages)), title };
  } finally {
    void task.destroy();
  }
}

/** Removes running headers/footers, page numbers and broken hyphenation. */
export function cleanPages(pages: string[]): string[] {
  const lineCounts = new Map<string, number>();
  const split = pages.map((p) =>
    p
      .replace(/\u00AD/g, '')
      .replace(/(\w)-\n(\w)/g, '$1$2')
      .split('\n')
      .map((l) => l.replace(/[ \t]+/g, ' ').trim())
      .filter(Boolean),
  );
  if (pages.length >= 4) {
    for (const lines of split) {
      for (const l of new Set(lines)) {
        const key = l.replace(/\d+/g, '#');
        if (key.length < 80) lineCounts.set(key, (lineCounts.get(key) ?? 0) + 1);
      }
    }
  }
  const threshold = Math.max(3, pages.length * 0.5);
  return split.map((lines) =>
    lines
      .filter((l) => !/^(page\s*)?\d{1,4}(\s*(of|\/)\s*\d{1,4})?$/i.test(l))
      .filter((l) => (lineCounts.get(l.replace(/\d+/g, '#')) ?? 0) < threshold)
      .join('\n'),
  );
}

export function countWords(pages: string[]) {
  let n = 0;
  for (const p of pages) n += p.split(/\s+/).filter(Boolean).length;
  return n;
}

const REF_HEADING = /^\s*(\d+(\.\d+)*\.?\s*)?(references|bibliography|works cited|literature cited|reference list)\s*$/i;
const CITATION = new RegExp(
  [
    String.raw`\(\d{4}[a-z]?\)`, // (2016)
    String.raw`\b(19|20)\d{2}[a-z]?\.?\s*$`, // line ends with a year
    String.raw`,\s*(19|20)\d{2}[a-z]?[.,]`, // ", 2016."
    String.raw`\b(pp\.|vol\.|pages \d+|arxiv|doi|proceedings|journal|conference|preprint|in advances in)\b`,
    String.raw`\bet al\.`,
    String.raw`^\s*\[[A-Za-z0-9+\-.,\s]{1,14}\]`, // [12] / [ADG+16]
  ].join('|'),
  'i',
);

function citationDensity(text: string) {
  const lines = text.split('\n').filter((l) => l.trim().length > 12);
  if (lines.length < 4) return 0;
  return lines.filter((l) => CITATION.test(l)).length / lines.length;
}

/**
 * Blanks out reference lists so no cards are written about citations.
 * Pages are kept (as empty strings) so page numbers still match the PDF.
 */
export function stripBackMatter(pages: string[]): string[] {
  const out = pages.slice();
  // only look for the heading in the second half of the document
  for (let i = Math.floor(pages.length / 2); i < pages.length; i++) {
    const lines = out[i].split('\n');
    const at = lines.findIndex((l) => REF_HEADING.test(l));
    if (at < 0) continue;
    out[i] = lines.slice(0, at).join('\n');
    for (let j = i + 1; j < pages.length && citationDensity(out[j]) > 0.25; j++) out[j] = '';
    break;
  }
  return out;
}
