import { cacheLife } from 'next/cache';

export type InformationFeatureIcon = 'light' | 'bolt' | 'gauge' | 'reverse';

// Mirrors Information / InformationStep (prisma/schema.prisma), so the mock can be swapped for the DB later.
export type InformationFeature = {
  id: number;
  icon: InformationFeatureIcon;
  text: string;
};

export type ProductInformation = {
  title: string;
  productName: string;
  description: string;
  /** null = placeholder until the real photo is added */
  imageUrl: string | null;
  imageAlt: string;
  features: InformationFeature[];
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function getInformation(productId: string): Promise<ProductInformation | null> {
  'use cache';
  cacheLife('minutes'); // use 'hours' in production

  try {
    const res = await fetch(`${BASE_URL}/api/products/${productId}/information`);
    if (!res.ok) {
      console.error('getInformation failed:', res.status, productId);
      return null;
    }
    const data: { information: ProductInformation | null } = await res.json();
    return data.information ?? null;
  } catch (err) {
    console.error('getInformation error:', err);
    return null;
  }
}
