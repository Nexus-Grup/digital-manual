/**
 * Converts a text-based PDF manual into the structured sections the manual page renders
 * (src/_data/getManual.ts). Free and local: only pdf.js (pdfjs-dist), no external services.
 *
 * Pipeline:
 *  1. extract text runs with position, size and font
 *  2. drop noise (decorative rules, running headers, figure callout numbers, superscripts)
 *  3. split two-page spreads into halves and detect text columns by vertical gutters
 *  4. rebuild lines per column and the reading order (sections that start mid-page included)
 *  5. classify lines (section, subheading, warning, numbered/bulleted item, table, paragraph)
 *  6. join lines into blocks
 *
 * Scanned PDFs (no text layer) are not handled: they need OCR (e.g. Tesseract.js) first.
 * Keep this file free of non-erasable TypeScript so it can also run with plain `node`.
 */
import type { ManualBlock, ManualSection } from '../../_data/getManual';

export type ParsedManual = {
  title: string;
  productName: string;
  pageCount: number;
  sections: ManualSection[];
};

type Item = { str: string; x: number; y: number; w: number; size: number };

type Line = {
  text: string;
  x: number;
  /** baseline of the first (top) row */
  y: number;
  /** baseline of the last row (differs from y for merged multi-row headings) */
  yEnd: number;
  size: number;
  items: Item[];
  page: number;
  half: number;
  col: number;
  colX: number;
  band: number;
  kind?: 'h2' | 'h3' | 'h4';
};

// ---------- small helpers ----------

const DECOR = /^[\s/|_.\-–—=*~]+$/;
const ONLY_NUMBERS = /^[\d\s]+$/;
const CALLOUT = /^(ADVERTÊNCIA|CUIDADO|ATENÇÃO|AVISO|PERIGO|IMPORTANTE)\b[:\s]*(.*)$/;
const NOTE = /^NOTA:\s*(.*)$/i;
const NUMBERED = /^(\d{1,2})[.)]\s+(.+)$/;
const BULLET = /^(?:[•●▪◦]|[a-z]\))\s*(.+)$/;
const SENTENCE_END = /[.!?:;]$/;
const STARTS_LOWER = /^[a-zà-ÿ(,]/;

const round = (n: number, step = 0.5) => Math.round(n / step) * step;

function sentenceCase(text: string): string {
  const letters = text.replace(/[^A-Za-zÀ-ÿ]/g, '');
  if (!letters || letters !== letters.toUpperCase()) return text;
  // codes with digits ("TRB0018/TRB0019", "M6") keep their spelling
  const lower = text
    .split(' ')
    .map((word) => (/\d/.test(word) ? word : word.toLowerCase()))
    .join(' ');
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** "1. Botão 2. Cartucho da bateria" (figure legends) → ["Botão", "Cartucho da bateria"]; null if not sequential. */
function splitInlineNumbering(text: string): string[] | null {
  const marks = [...text.matchAll(/(?:^|\s)(\d{1,2})\.\s+(?=[A-ZÀ-Ý])/g)];
  if (marks.length < 2) return null;
  const first = Number(marks[0][1]);
  if (marks.some((m, i) => Number(m[1]) !== first + i)) return null;
  return marks.map((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end = marks[i + 1]?.index ?? text.length;
    return text.slice(start, end).trim();
  });
}

function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'secao'
  );
}

function joinText(a: string, b: string): string {
  if (!a) return b;
  // hyphenated word split across lines: "ferra-" + "menta"
  if (/[a-zà-ÿ]-$/.test(a) && STARTS_LOWER.test(b)) return a.slice(0, -1) + b;
  return `${a} ${b}`;
}

/** Joins the runs of one row, adding spaces only where the PDF left a visual gap. */
function rowText(items: Item[]): string {
  let text = '';
  let prev: Item | null = null;
  for (const it of items) {
    if (prev) {
      const gap = it.x - (prev.x + prev.w);
      const needsSpace = gap > prev.size * 0.15 && !text.endsWith(' ') && !it.str.startsWith(' ');
      if (needsSpace) text += ' ';
    }
    text += it.str;
    prev = it;
  }
  return text.replace(/\s+/g, ' ').trim();
}

function dominantSize(items: Item[]): number {
  let best = items[0];
  for (const it of items) if (it.str.length > best.str.length) best = it;
  return best.size;
}

// ---------- 1–2. extraction + noise ----------

type PageText = { page: number; width: number; height: number; items: Item[] };

async function extractPages(data: Uint8Array): Promise<PageText[]> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const task = pdfjs.getDocument({ data, verbosity: 0 });
  const doc = await task.promise;
  const pages: PageText[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const { width, height } = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const items: Item[] = [];
    for (const raw of content.items) {
      if (!('str' in raw)) continue;
      const str = raw.str;
      if (!str.trim() || DECOR.test(str)) continue;
      const t = raw.transform as number[];
      const size = round(Math.hypot(t[2], t[3]), 0.1);
      const y = t[5];
      if (size < 5.5) continue; // superscripts / footnote marks
      if (y > height - 32) continue; // running header band
      items.push({ str, x: t[4], y, w: raw.width, size });
    }
    pages.push({ page: p, width, height, items });
  }
  await task.destroy();
  return pages;
}

/** Most common text size, weighted by characters. */
function bodySize(pages: PageText[]): number {
  const weight = new Map<number, number>();
  for (const pg of pages)
    for (const it of pg.items) {
      const s = round(it.size);
      weight.set(s, (weight.get(s) ?? 0) + it.str.length);
    }
  let best = 0;
  let bestW = -1;
  for (const [s, w] of weight) if (w > bestW) [best, bestW] = [s, w];
  return best;
}

// ---------- 3. columns ----------

/** Column start positions inside [x0, x1], found as runs of x with (almost) no body text. */
function detectColumns(items: Item[], x0: number, x1: number, body: number): number[] {
  const BIN = 2;
  const n = Math.ceil((x1 - x0) / BIN) + 1;
  const cover = new Array<number>(n).fill(0);
  for (const it of items) {
    if (it.size > body * 1.4) continue; // headings may span columns
    if (it.w > (x1 - x0) * 0.55) continue; // full-width boxes too
    const from = Math.max(0, Math.floor((it.x - x0) / BIN));
    const to = Math.min(n - 1, Math.floor((it.x + it.w - x0) / BIN));
    for (let i = from; i <= to; i++) cover[i] += 1;
  }
  // boxes and notes may span two columns, so a gutter is a deep valley in the coverage, not a zero
  const filled = cover.filter((c) => c > 0).sort((a, b) => a - b);
  const p90 = filled[Math.floor(filled.length * 0.9)] ?? 0;
  const threshold = Math.max(1, Math.round(p90 * 0.35));

  const starts: number[] = [];
  let inText = false;
  let gapRun = 99;
  for (let i = 0; i < n; i++) {
    const empty = cover[i] <= threshold;
    if (empty) {
      gapRun += 1;
      if (gapRun >= 4) inText = false;
    } else {
      if (!inText && gapRun >= 4) starts.push(x0 + i * BIN);
      inText = true;
      gapRun = 0;
    }
  }
  // a real column is at least ~70pt wide; narrower "columns" are figure labels or indents
  const wide = starts.filter((s, i) => i === 0 || s - starts[i - 1] >= 70);
  // a text column is filled by its lines; a column of short values ("13 mm", "40 Nm") is part
  // of a table and stays with the column on its left
  const columns = wide.filter((s, i) => {
    if (i === 0) return true;
    const end = wide[i + 1] ?? x1;
    // width of whole rows (a row can come in several runs: "Nível (LpA)" ":" "70,5 dB(A)")
    const rows = new Map<number, { from: number; to: number; first: string }>();
    for (const it of items) {
      if (it.x < s - 2 || it.x >= end || it.size > body * 1.4) continue;
      const key = Math.round(it.y);
      const row = rows.get(key);
      if (row) {
        if (it.x < row.from) row.first = it.str;
        row.from = Math.min(row.from, it.x);
        row.to = Math.max(row.to, it.x + it.w);
      } else rows.set(key, { from: it.x, to: it.x + it.w, first: it.str });
    }
    // narrow columns of numbered entries are a legend ("4. Interruptor", "5. Alavanca"): keep them
    const all = [...rows.values()];
    const numbered = all.filter((r) => /^\s*(\d{1,2}[.)]|[•●▪◦])/.test(r.first)).length;
    if (all.length > 0 && numbered / all.length >= 0.5) return true;
    const widths = all.map((r) => r.to - r.from).sort((a, b) => a - b);
    const median = widths[Math.floor(widths.length / 2)] ?? 0;
    return median >= (end - s) * 0.4;
  });
  return columns.length > 0 ? columns : [x0];
}

// ---------- 4. lines + reading order ----------

function buildLines(pages: PageText[], body: number): Line[] {
  const all: Line[] = [];

  for (const pg of pages) {
    const spread = pg.width > pg.height * 1.2;
    const halves = spread
      ? [
          [0, pg.width / 2],
          [pg.width / 2, pg.width],
        ]
      : [[0, pg.width]];

    halves.forEach(([x0, x1], half) => {
      const items = pg.items.filter((it) => it.x >= x0 - 2 && it.x < x1);
      if (items.length === 0) return;

      // Horizontal strips between section headings: each strip can have its own column layout
      // (e.g. a full-width specifications table above a two-column "Symbols / Noise" area).
      const cuts: number[] = [];
      const headYs = items.filter((it) => it.size >= body * 2.4).map((it) => it.y).sort((a, b) => b - a);
      for (const y of headYs) if (cuts.length === 0 || cuts[cuts.length - 1] - y > 40) cuts.push(y);
      const stripOf = (y: number) => cuts.filter((c) => c >= y - 2).length;

      const stripCols = new Map<number, number[]>();
      for (const s of new Set(items.map((it) => stripOf(it.y)))) {
        const cols = detectColumns(items.filter((it) => stripOf(it.y) === s), x0, x1, body);
        stripCols.set(s, cols);
      }
      // column = x of its left edge; small tolerance so "1." markers left of indented text stay in it
      const colXOf = (it: Item) => {
        const cols = stripCols.get(stripOf(it.y)) ?? [x0];
        let c = cols[0];
        for (const s of cols) if (s <= it.x + 14) c = s;
        return Math.round(c);
      };

      // rows: same column, same baseline
      const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
      const rows: { col: number; y: number; size: number; items: Item[] }[] = [];
      for (const it of sorted) {
        const col = colXOf(it);
        // same column, same baseline and similar size (a big heading never merges with body text)
        const row = rows.find(
          (r) =>
            r.col === col &&
            Math.abs(r.y - it.y) <= Math.max(2, Math.min(r.size, it.size) * 0.3) &&
            Math.abs(r.size - it.size) <= Math.max(1, Math.min(r.size, it.size) * 0.3),
        );
        if (row) row.items.push(it);
        else rows.push({ col, y: it.y, size: it.size, items: [it] });
      }

      const lines: Line[] = rows.map((r) => {
        r.items.sort((a, b) => a.x - b.x);
        return {
          text: rowText(r.items),
          x: r.items[0].x,
          y: r.y,
          yEnd: r.y,
          size: dominantSize(r.items),
          items: r.items,
          page: pg.page,
          half,
          col: r.col,
          colX: Math.min(r.col, r.items[0].x),
          band: 0,
        };
      });

      // classify heading sizes
      const isAllCaps = (t: string) => {
        const letters = t.replace(/[^A-Za-zÀ-ÿ]/g, '');
        return letters.length >= 4 && letters === letters.toUpperCase();
      };
      for (const l of lines) {
        if (l.size >= body * 2.4) l.kind = 'h2';
        else if (l.size >= body * 1.6) l.kind = 'h3';
        // short ALL CAPS label slightly larger than the body ("CARTUCHO DA BATERIA E CARREGADOR")
        else if (l.size >= body * 1.1 && l.text.length <= 60 && isAllCaps(l.text) && !CALLOUT.test(l.text))
          l.kind = 'h4';
        else if (
          l.size >= body * 1.2 &&
          l.text.length <= 45 &&
          !STARTS_LOWER.test(l.text) &&
          !/[.,;:)]$/.test(l.text) &&
          !NUMBERED.test(l.text) &&
          !BULLET.test(l.text) &&
          !ONLY_NUMBERS.test(l.text) &&
          !CALLOUT.test(l.text)
        )
          l.kind = 'h4';
      }

      // merge multi-row headings ("DESCRIÇÃO" + "FUNCIONAL")
      lines.sort((a, b) => a.col - b.col || b.y - a.y);
      const merged: Line[] = [];
      for (const l of lines) {
        const prev = merged[merged.length - 1];
        if (
          prev &&
          l.kind &&
          (l.kind === 'h2' || l.kind === 'h3') &&
          prev.kind === l.kind &&
          prev.col === l.col &&
          prev.yEnd - l.y <= l.size * 1.6
        ) {
          prev.text = `${prev.text} ${l.text}`;
          prev.yEnd = l.y;
          continue;
        }
        merged.push(l);
      }

      // bands: a section heading splits its own column and the columns to its right
      const heads = merged.filter((l) => l.kind === 'h2');
      for (const l of merged) {
        l.band = heads.filter((h) => h.col <= l.col + 15 && h.y >= l.y - 0.5).length;
      }
      merged.sort((a, b) => a.band - b.band || a.col - b.col || b.y - a.y);
      all.push(...merged);
    });
  }
  return all;
}

// ---------- 5–6. blocks ----------

type Row = { label: string; value: string };

/** Finds label/value runs (e.g. the specifications table) and returns them keyed by first line index. */
function findTables(lines: Line[], body: number): Map<number, { end: number; rows: Row[] }> {
  const tables = new Map<number, { end: number; rows: Row[] }>();
  const sameRun = (a: Line, b: Line) => a.page === b.page && a.half === b.half && a.band === b.band && a.col === b.col;

  // label at the column start + value further right ("Torque máx." ... "40 Nm")
  const split = (l: Line): { left: string; right: string } | null => {
    if (l.x > l.colX + 12) return null;
    for (let i = 1; i < l.items.length; i++) {
      const prev = l.items[i - 1];
      const gap = l.items[i].x - (prev.x + prev.w);
      if (l.items[i].x >= l.colX + 80 && gap > 8) {
        return { left: rowText(l.items.slice(0, i)), right: rowText(l.items.slice(i)) };
      }
    }
    return null;
  };
  const isValueOnly = (l: Line) => !l.kind && l.x >= l.colX + 80 && l.text.length < 60 && l.size <= body * 1.3;
  const isLabelOnly = (l: Line) =>
    !l.kind && l.x <= l.colX + 12 && l.text.length < 40 && !SENTENCE_END.test(l.text) && !NUMBERED.test(l.text) && !BULLET.test(l.text);
  const isTabular = (l: Line) => !l.kind && (split(l) !== null || isValueOnly(l));

  let i = 0;
  while (i < lines.length) {
    if (!isTabular(lines[i]) && !isLabelOnly(lines[i])) {
      i += 1;
      continue;
    }
    let j = i;
    let tabular = 0;
    while (j < lines.length && (j === i || sameRun(lines[j - 1], lines[j])) && (isTabular(lines[j]) || isLabelOnly(lines[j]))) {
      if (isTabular(lines[j])) tabular += 1;
      j += 1;
    }
    if (tabular >= 3) {
      const labels: { y: number; row: Row }[] = [];
      const values: Line[] = [];
      for (let k = i; k < j; k++) {
        const l = lines[k];
        const parts = split(l);
        if (parts && l.x <= l.colX + 12) labels.push({ y: l.y, row: { label: parts.left, value: parts.right } });
        else if (isValueOnly(l)) values.push(l);
        else labels.push({ y: l.y, row: { label: l.text, value: '' } });
      }
      for (const v of values) {
        let best = labels[0];
        for (const lb of labels) if (Math.abs(lb.y - v.y) < Math.abs(best.y - v.y)) best = lb;
        if (best) best.row.value = best.row.value ? `${best.row.value}; ${v.text}` : v.text;
      }
      if (labels.length > 0) tables.set(i, { end: j, rows: labels.map((l) => l.row) });
      i = j;
    } else {
      i += 1;
    }
  }
  return tables;
}

function buildSections(lines: Line[], body: number): ManualSection[] {
  const sections: ManualSection[] = [];
  let section: ManualSection | null = null;
  let open: { kind: 'paragraph' | 'item' | 'callout'; text: string; title?: string; tone?: 'warning' | 'tip' } | null = null;
  let list: { type: 'steps' | 'list'; items: string[] } | null = null;
  let prev: Line | null = null;
  let lastHeading = '';

  const ensureSection = (page: number) => {
    if (!section) {
      section = { id: '', title: 'Introdução', page, blocks: [] };
      sections.push(section);
    }
    return section;
  };
  const flushOpen = (page: number) => {
    if (!open) return;
    const s = ensureSection(page);
    if (open.kind === 'paragraph') s.blocks.push({ type: 'paragraph', text: open.text });
    else if (open.kind === 'callout')
      s.blocks.push({ type: 'callout', tone: open.tone ?? 'warning', title: open.title ?? 'Atenção', text: open.text });
    else if (list) list.items.push(open.text);
    open = null;
  };
  const flushList = (page: number) => {
    flushOpen(page);
    if (list && list.items.length > 0) ensureSection(page).blocks.push({ type: list.type, items: list.items });
    list = null;
  };
  const continues = (l: Line) => {
    if (!prev || !open) return false;
    const sameRun = prev.page === l.page && prev.half === l.half && prev.band === l.band && prev.col === l.col;
    if (sameRun) {
      const gap = prev.yEnd - l.y;
      // a box title ("ADVERTÊNCIA") sits a bit above its text: its first line always belongs to it
      if (open.kind === 'callout' && !open.text) return gap <= prev.size * 4;
      return gap <= Math.max(prev.size, l.size) * 1.75 && Math.abs(prev.size - l.size) <= body * 0.25;
    }
    // text flowing into the next column/page
    return !SENTENCE_END.test(open.text) && STARTS_LOWER.test(l.text);
  };

  const tables = findTables(lines, body);

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const text = l.text;
    if (!text || ONLY_NUMBERS.test(text)) continue; // figure callout numbers

    const table = tables.get(i);
    if (table) {
      flushList(l.page);
      ensureSection(l.page).blocks.push({
        type: 'table',
        caption: lastHeading || section?.title || 'Especificações',
        headers: ['Item', 'Valor'],
        rows: table.rows.map((r) => [r.label, r.value]),
      });
      i = table.end - 1;
      prev = lines[i];
      continue;
    }

    if (l.kind === 'h2') {
      flushList(l.page);
      section = { id: '', title: sentenceCase(text), page: l.page, blocks: [] };
      sections.push(section);
      lastHeading = section.title;
      prev = l;
      continue;
    }

    if (l.kind === 'h3' || l.kind === 'h4') {
      flushList(l.page);
      const heading = sentenceCase(text);
      ensureSection(l.page).blocks.push({ type: 'heading', text: heading });
      lastHeading = heading;
      prev = l;
      continue;
    }

    const callout = CALLOUT.exec(text);
    const note = NOTE.exec(text);
    if (callout || note) {
      flushList(l.page);
      open = callout
        ? { kind: 'callout', tone: 'warning', title: sentenceCase(callout[1]), text: callout[2] }
        : { kind: 'callout', tone: 'tip', title: 'Nota', text: note?.[1] ?? '' };
      prev = l;
      continue;
    }

    const numbered = NUMBERED.exec(text);
    const bullet = BULLET.exec(text);
    if (numbered || bullet) {
      const type = numbered ? 'steps' : 'list';
      // a callout box can hold its own items; otherwise items form a list
      if (open?.kind === 'callout' && continues(l)) {
        open.text = joinText(open.text, text);
        prev = l;
        continue;
      }
      flushOpen(l.page);
      if (!list || list.type !== type || (numbered && numbered[1] === '1')) {
        flushList(l.page);
        list = { type, items: [] };
      }
      const inline = numbered ? splitInlineNumbering(text) : null;
      if (inline && list) {
        list.items.push(...inline.slice(0, -1));
        open = { kind: 'item', text: inline[inline.length - 1] };
        prev = l;
        continue;
      }
      open = { kind: 'item', text: (numbered ? numbered[2] : bullet?.[1]) ?? text };
      prev = l;
      continue;
    }

    if (open && continues(l)) {
      open.text = joinText(open.text, text);
    } else {
      // a paragraph after a list closes the list
      if (open?.kind !== 'item' || !continues(l)) flushList(l.page);
      open = { kind: 'paragraph', text };
    }
    prev = l;
  }
  flushList(prev?.page ?? 1);

  // ids + sections that only hold a figure
  const used = new Map<string, number>();
  for (const s of sections) {
    const base = slugify(s.title);
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    s.id = n === 0 ? base : `${base}-${n + 1}`;
    if (s.blocks.length === 0) {
      s.blocks.push({
        type: 'paragraph',
        text: `Esta seção é uma ilustração. Veja a página ${s.page} do PDF original.`,
      } satisfies ManualBlock);
    }
  }
  return sections;
}

// ---------- cover ----------

function readCover(page: PageText | undefined, body: number): { title: string; productName: string } {
  if (!page) return { title: 'Manual', productName: '' };
  const rows = [...page.items].sort((a, b) => b.size - a.size || b.y - a.y);
  const title = sentenceCase(rows[0]?.str.trim() ?? 'Manual');
  const product = page.items
    .filter((it) => it !== rows[0] && it.size >= body * 1.5)
    .sort((a, b) => b.y - a.y)
    .map((it) => it.str.replace(/\/\//g, ' ').trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { title, productName: product };
}

// ---------- entry point ----------

export async function parseManualPdf(data: Uint8Array): Promise<ParsedManual> {
  const pages = await extractPages(data);
  const body = bodySize(pages);

  // a sparse first page is a cover: use it for the title, not as content
  const hasCover = (pages[0]?.items.length ?? 0) < 15;
  const cover = readCover(hasCover ? pages[0] : undefined, body);
  const contentPages = hasCover ? pages.slice(1) : pages;

  const lines = buildLines(contentPages, body);
  const sections = buildSections(lines, body);
  return { ...cover, pageCount: pages.length, sections };
}
