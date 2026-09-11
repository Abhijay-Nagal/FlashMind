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

  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
  ]);
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
    return { pages: cleanPages(pages), title };
  } finally {
    void task.destroy();
  }
}

/** Removes running headers/footers, page numbers and broken hyphenation. */
export function cleanPages(pages: string[]): string[] {
  const lineCounts = new Map<string, number>();
  const split = pages.map((p) =>
    p
      .replace(/­/g, '')
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
