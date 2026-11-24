import 'server-only';
import { cacheLife } from 'next/cache';
import { normalize } from './text';

export type ManualChunk = {
  /** page of the PDF (1-based), used to link to the original */
  page: number;
  text: string;
};

const CHUNK_CHARS = 420;

// language markers (normalized): multilingual manuals keep one language per block of pages
const MARKERS: Record<string, string[]> = {
  pt: ['de', 'que', 'nao', 'para', 'com', 'uma', 'os', 'as', 'da', 'do', 'em', 'ao', 'pode', 'ferramenta', 'eletrica', 'acumulador', 'voce', 'deve'],
  es: ['el', 'la', 'los', 'las', 'y', 'con', 'una', 'herramienta', 'puede', 'del', 'usted', 'debe'],
  en: ['the', 'and', 'to', 'of', 'with', 'tool', 'power', 'battery', 'can', 'for', 'you', 'must'],
  fr: ['le', 'les', 'et', 'des', 'pour', 'avec', 'outil', 'electroportatif', 'peut', 'du', 'vous', 'doit'],
};

function languageScores(text: string) {
  const words = normalize(text).split(' ');
  return Object.fromEntries(
    Object.entries(MARKERS).map(([lang, list]) => [lang, words.filter((w) => list.includes(w)).length]),
  ) as Record<string, number>;
}

/** Portuguese text: enough markers and clearly ahead of Spanish (the closest language). */
function isPortuguese(text: string) {
  const s = languageScores(text);
  return s.pt >= 4 && s.pt > s.es * 2 && s.pt > s.en && s.pt > s.fr;
}

/** A page clearly in Portuguese: many markers and well ahead of every other language. */
function isPortuguesePage(text: string) {
  const s = languageScores(text);
  return s.pt >= 25 && s.pt >= 3 * Math.max(s.es, s.en, s.fr, 1);
}

/** Groups the page lines into chunks of about CHUNK_CHARS, breaking at sentence ends. */
function chunkPage(page: number, lines: string[]): ManualChunk[] {
  const chunks: ManualChunk[] = [];
  let buf = '';
  const flush = () => {
    const text = buf
      .replace(/[\uE000-\uF8FF]/g, ' ') // private-use glyphs the PDF uses as bullets
      .replace(/\s+/g, ' ')
      .replace(/([a-zà-ú])- ([a-zà-ú])/gi, '$1$2') // words hyphenated at line breaks
      .trim();
    if (text.length > 40 && isPortuguese(text)) chunks.push({ page, text });
    buf = '';
  };
  for (const line of lines) {
    buf += (buf ? ' ' : '') + line;
    if (buf.length >= CHUNK_CHARS && /[.!?:]\s*$/.test(line)) flush();
  }
  flush();
  return chunks;
}

/**
 * Portuguese text of a PDF manual split into searchable chunks (one language is kept even in
 * multilingual manuals). Cached: the PDF is downloaded and read once every few hours.
 */
export async function getManualChunks(pdfUrl: string): Promise<ManualChunk[]> {
  'use cache';
  cacheLife('hours');

  try {
    const res = await fetch(pdfUrl);
    if (!res.ok) return [];
    const data = new Uint8Array(await res.arrayBuffer());

    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const task = pdfjs.getDocument({ data, verbosity: 0 });
    try {
      const doc = await task.promise;
      const pages: string[][] = [];
      for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const content = await page.getTextContent();
        const lines: string[] = [];
        let line = '';
        for (const item of content.items) {
          if (!('str' in item)) continue;
          line += item.str;
          if (item.hasEOL) {
            if (line.trim()) lines.push(line.trim());
            line = '';
          }
        }
        if (line.trim()) lines.push(line.trim());
        pages.push(lines);
      }

      // running headers/footers repeat on many pages (only the page number changes): drop them
      const shape = (l: string) => l.replace(/\d+/g, '#').replace(/\s+/g, ' ');
      const seen = new Map<string, number>();
      for (const lines of pages) for (const l of new Set(lines.map(shape))) seen.set(l, (seen.get(l) ?? 0) + 1);
      const repeated = (l: string) => (seen.get(shape(l)) ?? 0) >= 4;

      const chunks: ManualChunk[] = [];
      pages.forEach((lines, i) => {
        // only the pages written in Portuguese (multilingual manuals repeat the text per language)
        if (!isPortuguesePage(lines.join(' '))) return;
        chunks.push(...chunkPage(i + 1, lines.filter((l) => !repeated(l))));
      });
      return chunks;
    } finally {
      await task.destroy(); // frees the parsed document
    }
  } catch (err) {
    console.error('manual text extraction failed', err);
    return [];
  }
}
