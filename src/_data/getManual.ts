import { cacheLife } from 'next/cache';

// Content blocks of a digitized manual (the PDF the company uploads is converted into these).
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

// Mirrors Manual (prisma/schema.prisma) plus the digitized sections.
export type ProductManual = {
  title: string;
  productName: string;
  version: string;
  language: string;
  /** ISO date */
  updatedAt: string;
  /** original PDF; null = not uploaded yet */
  pdfUrl: string | null;
  sections: ManualSection[];
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function getManual(productId: string): Promise<ProductManual | null> {
  'use cache';
  cacheLife('minutes'); // use 'hours' in production

  try {
    const res = await fetch(`${BASE_URL}/api/products/${productId}/manual`);
    if (!res.ok) {
      console.error('getManual failed:', res.status, productId);
      return null;
    }
    const data: { manual: ProductManual | null } = await res.json();
    return data.manual ?? null;
  } catch (err) {
    console.error('getManual error:', err);
    return null;
  }
}
