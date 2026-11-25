import 'server-only';
import { prisma } from '@/lib/prisma';
import { parseProductId, productVisibility } from './publicProduct';

export type PublicVideo = { url: string; title: string };

/** Videos do produto (so de produtos visiveis ao publico). */
export async function getVideos(productId: string): Promise<PublicVideo[]> {
  const id = parseProductId(productId);
  if (!id) return [];

  return prisma.productVideo.findMany({
    where: { productId: id, product: productVisibility },
    orderBy: { id: 'asc' },
    select: { url: true, title: true },
  });
}