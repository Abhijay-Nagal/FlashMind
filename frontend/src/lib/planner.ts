/**
 * Decides how many cards a PDF deserves and splits it into sections that are
 * each sent to the LLM separately.
 *
 * Rule of thumb from the brief: ~30 cards for a 100-page PDF, growing with the
 * square root of length so short papers still get a useful deck and huge books
 * don't explode. Page count and word count are blended so a dense 20-page paper
 * and a 20-slide deck are treated differently.
 */

export type Density = 'light' | 'balanced' | 'deep';

export const DENSITY: Record<Density, { mult: number; minDepth: number; maxDepth: number; avgDepth: number; min: number }> = {
  light: { mult: 0.6, minDepth: 2, maxDepth: 3, avgDepth: 2.5, min: 6 },
  balanced: { mult: 1, minDepth: 2, maxDepth: 4, avgDepth: 3, min: 9 },
  deep: { mult: 1.6, minDepth: 3, maxDepth: 5, avgDepth: 4, min: 12 },
};

const MAX_CARDS = 60;
const TOPICS_PER_SECTION = 4;
/** characters of source text sent per section (~2.3k tokens) */
export const SECTION_CHAR_BUDGET = 9000;

export interface Section {
  index: number;
  pageStart: number;
  pageEnd: number;
  text: string;
  topicCount: number;
}

export interface Plan {
  targetCards: number;
  topicCount: number;
  minDepth: number;
  maxDepth: number;
  sections: Section[];
}

export function estimateCards(pageCount: number, words: number, density: Density) {
  const cfg = DENSITY[density];
  const effectivePages = (pageCount + words / 450) / 2;
  // 3·√pages → 30 cards for 100 pages, ~12 for a 15-page paper, ~52 for a 300-page book
  const raw = Math.round(3 * Math.sqrt(effectivePages) * cfg.mult);
  // very short documents can't support many distinct cards
  const ceiling = Math.max(cfg.min, Math.floor(words / 45));
  return Math.max(cfg.min, Math.min(MAX_CARDS, ceiling, raw));
}

export function planDeck(pages: string[], words: number, density: Density): Plan {
  const cfg = DENSITY[density];
  const targetCards = estimateCards(pages.length, words, density);
  const topicCount = Math.max(2, Math.round(targetCards / cfg.avgDepth));
  const totalChars = pages.reduce((n, p) => n + p.length, 0);

  // enough sections to cover everything without condensing the text too much
  let sectionCount = Math.max(Math.ceil(topicCount / TOPICS_PER_SECTION), Math.min(Math.ceil(totalChars / 36000), 12));
  sectionCount = Math.min(sectionCount, topicCount);
  // a short text gets at most one section per 1.5k chars so each has substance
  sectionCount = Math.max(1, Math.min(sectionCount, Math.floor(totalChars / 1500) || 1, pages.length));

  // contiguous page groups with ~equal character counts
  const groups: number[][] = [];
  const target = totalChars / sectionCount;
  let current: number[] = [];
  let acc = 0;
  for (let i = 0; i < pages.length; i++) {
    current.push(i);
    acc += pages[i].length;
    const groupsStillNeeded = sectionCount - groups.length - 1;
    const pagesLeft = pages.length - i - 1;
    if (groupsStillNeeded > 0 && (acc >= target || pagesLeft === groupsStillNeeded)) {
      groups.push(current);
      current = [];
      acc = 0;
    }
  }
  if (current.length) groups.push(current);

  // distribute topics proportionally to text size (each section ≥ 1)
  const sizes = groups.map((g) => g.reduce((n, i) => n + pages[i].length, 0));
  const counts = distribute(topicCount, sizes);

  const sections: Section[] = groups.map((g, index) => ({
    index,
    pageStart: g[0] + 1,
    pageEnd: g[g.length - 1] + 1,
    topicCount: counts[index],
    text: buildSectionText(g.map((i) => ({ n: i + 1, text: pages[i] })), SECTION_CHAR_BUDGET),
  }));

  return { targetCards, topicCount, minDepth: cfg.minDepth, maxDepth: cfg.maxDepth, sections: sections.filter((s) => s.text.trim().length > 40) };
}

function distribute(total: number, weights: number[]): number[] {
  const n = weights.length;
  if (total <= n) return weights.map(() => 1);
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const out = weights.map((w) => Math.max(1, Math.floor((w / sum) * total)));
  let diff = total - out.reduce((a, b) => a + b, 0);
  const order = weights.map((w, i) => [w, i]).sort((a, b) => b[0] - a[0]).map(([, i]) => i);
  for (let k = 0; diff !== 0 && k < 1000; k++) {
    const i = order[k % n];
    if (diff > 0) {
      out[i]++;
      diff--;
    } else if (out[i] > 1) {
      out[i]--;
      diff++;
    }
  }
  return out.map((c) => Math.min(c, 6));
}

const HEADING = /^((\d+(\.\d+)*|[IVX]+\.|chapter|section|unit|lecture|module)\b.{2,80}|[A-Z][^.!?]{2,70})$/i;

function isHeading(line: string) {
  if (line.length > 90 || line.length < 4) return false;
  if (/[.,;:]$/.test(line)) return false;
  return HEADING.test(line) && line.split(' ').length <= 12;
}

/**
 * Joins pages with [Page N] markers. If the text is over budget every page is
 * condensed proportionally, keeping its headings plus its opening lines, so the
 * LLM still sees every part of the section.
 */
export function buildSectionText(pages: { n: number; text: string }[], budget: number): string {
  const full = pages.map((p) => `[Page ${p.n}]\n${p.text}`).join('\n');
  if (full.length <= budget) return full;

  const overhead = pages.length * 12;
  const available = Math.max(budget - overhead, pages.length * 60);
  const total = pages.reduce((n, p) => n + p.text.length, 0) || 1;

  return pages
    .map((p) => {
      const share = Math.max(60, Math.floor((p.text.length / total) * available));
      return `[Page ${p.n}]\n${condense(p.text, share)}`;
    })
    .join('\n')
    .slice(0, budget + 200);
}

function condense(text: string, budget: number): string {
  if (text.length <= budget) return text;
  const lines = text.split('\n');
  const keep = new Array(lines.length).fill(false);
  let used = 0;
  lines.forEach((l, i) => {
    if (isHeading(l) && used + l.length < budget * 0.35) {
      keep[i] = true;
      used += l.length + 1;
    }
  });
  for (let i = 0; i < lines.length && used < budget; i++) {
    if (keep[i]) continue;
    const l = lines[i];
    if (used + l.length > budget) {
      const rest = budget - used;
      if (rest > 40) {
        lines[i] = l.slice(0, rest);
        keep[i] = true;
      }
      break;
    }
    keep[i] = true;
    used += l.length + 1;
  }
  return lines.filter((_, i) => keep[i]).join('\n');
}
