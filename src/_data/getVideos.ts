import { cacheLife } from 'next/cache';
import type { VideoItem } from '@/_components/productComponents/VideoShell';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function getVideos(productId: string): Promise<VideoItem[]> {
  'use cache';
  cacheLife('minutes'); // em produção, use 'hours'

  try {
    const res = await fetch(`${BASE_URL}/api/products/${productId}/videos`);
    if (!res.ok) {
      console.error('getVideos falhou:', res.status, productId);
      return [];
    }
    const data = await res.json();
    return data.videos ?? [];
  } catch (err) {
    console.error('getVideos erro:', err);
    return [];
  }
}