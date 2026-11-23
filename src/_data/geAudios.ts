import 'server-only';
import { prisma } from '@/lib/prisma';
import { parseProductId, productVisibility } from './publicProduct';

export type PublicAudio = { url: string; productName: string };

/** Audio do produto: prefere POWER_ON, depois IN_USE. Devolve null se nao houver. */
export async function getAudios(productId: string): Promise<PublicAudio | null> {
  const id = parseProductId(productId);
  if (!id) return null;

  const audio = await prisma.productAudio.findFirst({
    where: { productId: id, product: productVisibility },
    orderBy: [{ audioType: 'asc' }, { id: 'asc' }],
    select: { audioUrl: true, product: { select: { name: true } } },
  });

  return audio ? { url: audio.audioUrl, productName: audio.product.name } : null;
}