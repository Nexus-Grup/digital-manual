import { cacheLife } from 'next/cache';

// Mirrors Assembly / AssemblyStep (prisma/schema.prisma), so the mock can be swapped for the DB later.
export type AssemblyStepItem = {
  id: number;
  /** letter printed on the drawing (A, B...) */
  label: string;
  title: string;
  /** null = placeholder until the real drawing is added */
  imageUrl: string | null;
  alt: string;
};

export type ProductAssembly = {
  title: string;
  productName: string;
  subtitle: string;
  description: string;
  steps: AssemblyStepItem[];
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function getAssembly(productId: string): Promise<ProductAssembly | null> {
  'use cache';
  cacheLife('minutes'); // use 'hours' in production

  try {
    const res = await fetch(`${BASE_URL}/api/products/${productId}/assembly`);
    if (!res.ok) {
      console.error('getAssembly failed:', res.status, productId);
      return null;
    }
    const data: { assembly: ProductAssembly | null } = await res.json();
    return data.assembly ?? null;
  } catch (err) {
    console.error('getAssembly error:', err);
    return null;
  }
}
