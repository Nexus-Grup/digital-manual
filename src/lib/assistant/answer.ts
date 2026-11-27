import 'server-only';
import type { PublicProduct } from '@/_data/publicProduct';
import type { ProductAssembly } from '@/_data/getAssembly';
import { toSpecs } from '@/_lib/productSpecs';
import type { ManualChunk } from './manualChunks';
import { concepts, normalize, sameTerm, sentences, terms } from './text';

export type AssistantSource = { label: string; href: string; external?: boolean };
export type AssistantAnswer = { paragraphs: string[]; sources: AssistantSource[] };

type DocKind = 'spec' | 'highlight' | 'about' | 'step' | 'manual';

type Doc = {
  kind: DocKind;
  title: string;
  text: string;
  terms: string[];
  /** spec only: the words that ask for this value (label + synonyms) */
  keys?: string[];
  /** spec: "o torque" phrasing; step: letter */
  meta?: { label?: string; value?: string; letter?: string; page?: number };
  source?: AssistantSource;
};

// spec label (pt, from toSpecs or the sheet) -> extra words that ask for it
const SPEC_WORDS: Record<string, string> = {
  tensão: 'tensao voltagem volt volts',
  bateria: 'bateria ah carga capacidade autonomia',
  rotação: 'rotacao rpm velocidade giro',
  torque: 'torque forca aperto nm',
  peso: 'peso pesa pesado leve quilo kg',
  dimensões: 'dimensoes tamanho medidas altura largura comprimento',
  material: 'material feito fabricado',
  potência: 'potencia watts',
  ruído: 'ruido barulho db',
  corrente: 'corrente amperes',
  comprimento: 'comprimento tamanho',
  capacidade: 'capacidade litros',
};

// "o torque", "a tensão": article for the spec sentence
const FEMININE = new Set(['tensão', 'bateria', 'rotação', 'potência', 'corrente', 'capacidade']);

function article(label: string) {
  if (label === 'dimensões') return 'As dimensões são';
  const art = FEMININE.has(label) ? 'A' : 'O';
  return `${art} ${label} é`;
}

/** Builds every searchable piece of knowledge about the product. */
function buildDocs(product: PublicProduct, assembly: ProductAssembly | null, manual: ManualChunk[], pdfUrl: string | null): Doc[] {
  const base = `/produtos/${product.id}`;
  const docs: Doc[] = [];
  const add = (d: Omit<Doc, 'terms'>, extra = '') => docs.push({ ...d, terms: terms(`${d.title} ${d.text} ${extra}`) });

  // technical sheet
  const sheet = product.technical;
  const specs = toSpecs(sheet?.specs).map((s) => ({ label: s.label, value: s.value }));
  if (sheet?.material) specs.push({ label: 'material', value: sheet.material });
  if (sheet?.dimensions) specs.push({ label: 'dimensões', value: sheet.dimensions });
  if (sheet?.weightKg && !specs.some((s) => s.label === 'peso')) specs.push({ label: 'peso', value: `${sheet.weightKg} kg` });
  for (const s of specs) {
    add(
      {
        kind: 'spec', title: s.label, text: s.value, meta: s, keys: terms(`${s.label} ${SPEC_WORDS[s.label] ?? ''}`),
        source: { label: 'Ficha técnica', href: base },
      },
      SPEC_WORDS[s.label] ?? '',
    );
  }

  // highlights
  for (const c of product.information?.cards ?? []) {
    add({ kind: 'highlight', title: c.title, text: c.description ?? '', source: { label: 'Informações', href: `${base}/informacoes` } });
  }

  // description (split so the best sentences can be quoted)
  const about = product.information?.description ?? product.description ?? '';
  for (const s of sentences(about)) {
    add({ kind: 'about', title: product.name, text: s, source: { label: 'Informações', href: `${base}/informacoes` } });
  }

  // assembly steps
  for (const step of assembly?.steps ?? []) {
    add(
      {
        kind: 'step',
        title: step.name,
        text: step.description ?? '',
        meta: { letter: step.label },
        source: { label: `Montagem: passo ${step.label}`, href: `${base}/montagem?passo=${step.label}` },
      },
      `passo etapa montagem montar ${step.label}`,
    );
  }

  // manual (Portuguese pages of the PDF)
  for (const chunk of manual) {
    add({
      kind: 'manual',
      title: '',
      text: chunk.text,
      meta: { page: chunk.page },
      source: pdfUrl
        ? { label: `Manual, página ${chunk.page}`, href: `${pdfUrl}#page=${chunk.page}`, external: true }
        : { label: 'Manual', href: `${base}/manual` },
    });
  }
  return docs;
}

const K1 = 1.2;
const B = 0.75;
const KIND_WEIGHT: Record<DocKind, number> = { spec: 1.4, step: 1.25, highlight: 1.15, about: 1, manual: 0.9 };

type Concept = string[];

const matches = (t: string, concept: Concept) => concept.some((c) => sameTerm(t, c));

/** BM25 over query concepts (a word + its synonyms), with prefix-tolerant matching. */
function rank(docs: Doc[], query: Concept[], boost: Partial<Record<DocKind, number>> = {}) {
  const N = docs.length || 1;
  const avg = docs.reduce((n, d) => n + d.terms.length, 0) / N || 1;
  const idf = query.map((c) => {
    const n = docs.filter((d) => d.terms.some((t) => matches(t, c))).length;
    return Math.log(1 + (N - n + 0.5) / (n + 0.5));
  });

  const results = docs
    .map((doc) => {
      let score = 0;
      query.forEach((c, i) => {
        let tf = doc.terms.filter((t) => matches(t, c)).length;
        if (!tf) return;
        if (doc.kind === 'spec') tf = 1; // a sheet value lists its synonyms on purpose
        score += idf[i] * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * doc.terms.length) / avg)));
      });
      return { doc, score: score * KIND_WEIGHT[doc.kind] * (boost[doc.kind] ?? 1) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  return { results, idf };
}

/** Best sentences of a long text for the query, rare words weighing more (keeps the order). */
function bestSentences(text: string, query: Concept[], idf: number[], max = 2): string {
  const list = sentences(text);
  if (list.length <= max) return text.trim();
  const scored = list.map((s, i) => {
    const words = terms(s);
    const n = query.reduce((sum, c, k) => sum + (words.some((t) => matches(t, c)) ? idf[k] : 0), 0);
    return { s, i, n };
  });
  const top = [...scored].sort((a, b) => b.n - a.n).slice(0, max).filter((x) => x.n > 0).sort((a, b) => a.i - b.i);
  return (top.length ? top : scored.slice(0, 1)).map((x) => x.s).join(' ');
}

const ensureDot = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

function uniqueSources(list: (AssistantSource | undefined)[]) {
  const seen = new Set<string>();
  return list.filter((s): s is AssistantSource => !!s && !seen.has(s.href) && !!seen.add(s.href));
}

/** Answers a question using only the product's own content. */
export function answerQuestion(
  question: string,
  product: PublicProduct,
  assembly: ProductAssembly | null,
  manual: ManualChunk[],
  pdfUrl: string | null,
): AssistantAnswer {
  const q = normalize(question);
  const base = `/produtos/${product.id}`;
  const steps = assembly?.steps ?? [];

  // small talk
  if (/^(oi|ola|bom dia|boa tarde|boa noite|e ai|opa)\b/.test(q) && q.split(' ').length <= 4) {
    return { paragraphs: [`Oi! Eu sou o Lucca. Pode perguntar sobre a ${product.name}: ficha técnica, montagem, uso ou cuidados.`], sources: [] };
  }
  if (/^(obrigad|valeu|brigad)/.test(q)) {
    return { paragraphs: ['De nada! Se surgir outra dúvida, é só perguntar.'], sources: [] };
  }

  // "how many steps" / "how do I assemble it" -> overview of the steps
  if (steps.length && /(quantos passos|quantas etapas|passo a passo|como (eu )?(monto|montar|faco a montagem)|etapas da montagem)/.test(q)) {
    return {
      paragraphs: [
        `A montagem tem ${steps.length} ${steps.length === 1 ? 'passo' : 'passos'}:`,
        ...steps.map((s) => `${s.label}. ${s.name}`),
      ],
      sources: [{ label: 'Abrir a montagem', href: `${base}/montagem` }],
    };
  }

  // "passo B" -> that step
  const stepMatch = q.match(/\b(?:passo|etapa)\s+([a-z0-9])\b/);
  if (stepMatch) {
    const step = steps.find((s) => s.label.toLowerCase() === stepMatch[1]);
    if (step) {
      return {
        paragraphs: [`Passo ${step.label}: ${step.name}.`, ...(step.description ? [ensureDot(step.description)] : [])],
        sources: [{ label: `Ver o passo ${step.label}`, href: `${base}/montagem?passo=${step.label}` }],
      };
    }
  }

  const originals = terms(question);
  const query = concepts(originals);
  if (!query.length) {
    return { paragraphs: ['Pode escrever sua dúvida com um pouco mais de detalhe? Por exemplo: “qual é o torque?” ou “como encaixo a bateria?”.'], sources: [] };
  }

  // "how do I…" / "can I…" questions ask for a procedure: steps and the manual, not sheet values
  const procedural = /\b(como|posso|devo|pode|consigo|da pra|para que serve|o que fazer)\b/.test(q);
  const docs = buildDocs(product, assembly, manual, pdfUrl);
  const { results, idf } = rank(docs, query, procedural ? { spec: 0.35, step: 1.3, manual: 1.15 } : {});
  const best = results[0];

  // sheet values asked for by name ("qual a tensão e o torque?"): answer all of them directly
  const requested = procedural
    ? []
    : docs.filter((d) => d.kind === 'spec' && d.keys!.some((k) => originals.some((o) => sameTerm(k, o)))).slice(0, 4);
  if (requested.length) {
    return {
      paragraphs: requested.map((d) => `${article(d.meta!.label!)} ${d.meta!.value}.`),
      sources: [{ label: 'Ficha técnica', href: base }],
    };
  }

  if (!best || best.score < 1.2) {
    return {
      paragraphs: [
        'Não encontrei isso nas informações deste produto.',
        'Tente perguntar de outro jeito, ou consulte o manual completo.',
      ],
      sources: [{ label: 'Abrir o manual', href: `${base}/manual` }],
    };
  }

  if (best.doc.kind === 'spec') {
    return { paragraphs: [`${article(best.doc.meta!.label!)} ${best.doc.meta!.value}.`], sources: uniqueSources([best.doc.source]) };
  }

  const paragraphs: string[] = [];
  const doc = best.doc;
  if (doc.kind === 'step') {
    paragraphs.push(`Isso está no passo ${doc.meta!.letter} da montagem: ${doc.title}.`);
    if (doc.text) paragraphs.push(ensureDot(doc.text));
  } else if (doc.kind === 'highlight') {
    paragraphs.push(`${doc.title}: ${ensureDot(doc.text || doc.title)}`);
  } else if (doc.kind === 'about') {
    paragraphs.push(ensureDot(doc.text));
  } else {
    paragraphs.push(`Segundo o manual (página ${doc.meta!.page}):`);
    paragraphs.push(`“${bestSentences(doc.text, query, idf)}”`);
  }

  // a second, different source when it is also a strong match (e.g. a step + the manual page)
  const second = results.find((r) => r.doc !== doc && r.doc.kind !== doc.kind && r.score >= best.score * 0.7);
  if (second && second.doc.kind === 'manual') {
    paragraphs.push(`O manual também fala disso (página ${second.doc.meta!.page}): “${bestSentences(second.doc.text, query, idf, 1)}”`);
  } else if (second && second.doc.kind === 'step') {
    paragraphs.push(`Na montagem, veja o passo ${second.doc.meta!.letter}: ${second.doc.title}.`);
  }

  return { paragraphs, sources: uniqueSources([doc.source, second?.doc.source]) };
}

/** Starter questions built from what this product actually has. */
export function suggestions(product: PublicProduct, assembly: ProductAssembly | null): string[] {
  const out: string[] = [];
  const labels = toSpecs(product.technical?.specs).map((s) => s.label);
  if (labels.includes('torque')) out.push('Qual é o torque?');
  else if (labels[0]) out.push(`Qual é ${FEMININE.has(labels[0]) ? 'a' : 'o'} ${labels[0]}?`);
  if (product.technical?.weightKg || labels.includes('peso')) out.push('Quanto pesa?');
  const step = assembly?.steps[0];
  if (step) out.push(`Como fazer o passo ${step.label}?`);
  if (assembly?.steps.length) out.push('Quantos passos tem a montagem?');
  if (product.manuals.length) out.push('Como limpar a ferramenta?');
  return out.slice(0, 4);
}
