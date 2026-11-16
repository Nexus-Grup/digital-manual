import { cacheLife } from 'next/cache';

export type AudioInfo = { url: string; productName: string };

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function getAudios(productId: string): Promise<AudioInfo | null> {
  'use cache';
  cacheLife('minutes'); // em produção, use 'hours'

  try {
    const res = await fetch(`${BASE_URL}/api/products/${productId}/audios`);
    if (!res.ok) {
      console.error('getAudios falhou:', res.status, productId);
      return null;
    }
    const data: { audio: AudioInfo | null } = await res.json();
    return data.audio ?? null;
  } catch (err) {
    console.error('getAudios erro:', err);
    return null; // sem áudio: a aba Som não aparece no PC
  }
}