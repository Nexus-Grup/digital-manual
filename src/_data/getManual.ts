import { cacheLife } from 'next/cache';
import { LANGUAGES, labelOf } from '@/_lib/productConstants';
import { getPublicProduct } from '@/_data/publicProduct';

// Content blocks of a digitized manual (reservado: hoje o banco guarda só o PDF).
export type ManualBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'callout'; tone: 'warning' | 'tip'; title: string; text: string }
  | { type: 'table'; caption: string; headers: string[]; rows: string[][] }
  | { type: 'image'; imageUrl: string | null; alt: string; caption: string };

export type ManualSection = {
  /** used as the anchor (#id) */
  id: string;
  title: string;
  /** page of the original PDF where the section starts (links to the original) */
  page?: number;
  blocks: ManualBlock[];
};

export type ProductManual = {
  title: string;
  productName: string;
  version: string;
  language: string;
  /** ISO date */
  updatedAt: string;
  /** original PDF; null = not uploaded yet */
  pdfUrl: string | null;
  /** vazio enquanto o manual não for digitalizado: a página mostra o PDF */
  sections: ManualSection[];
};

export async function getManual(productId: string): Promise<ProductManual | null> {
  'use cache';
  cacheLife('minutes'); // use 'hours' in production

  try {
    const p = await getPublicProduct(productId);
    if (!p) return null;

    // vários manuais: mostra o manual do usuário (ou o primeiro)
    const m = p.manuals.find((x) => x.documentType === 'USER_MANUAL') ?? p.manuals[0];
    if (!m) return null;

    return {
      title: m.title,
      productName: p.name,
      version: m.version ?? '',
      language: m.language ? labelOf(LANGUAGES, m.language) : '',
      updatedAt: p.updatedAt, // o manual não tem data própria: usa a do produto
      pdfUrl: m.fileUrl,
      sections: [],
    };
  } catch (err) {
    console.error('getManual error:', err);
    return null;
  }
}