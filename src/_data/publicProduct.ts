import 'server-only';
import { ProductStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * true  = a pagina publica (QR) so mostra produtos PUBLISHED (botao "Publish Product")
 * false = mostra tambem rascunhos (util so para testar)
 */
const ONLY_PUBLISHED = true;

export const productVisibility = ONLY_PUBLISHED ? { status: ProductStatus.PUBLISHED } : {};

export function parseProductId(raw: string) {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/**
 * Tudo o que a pagina publica mostra de um produto, no mesmo formato em que o wizard salva.
 * Devolve null se nao existir ou nao estiver publicado.
 * Retorna so dados simples (sem Decimal/Date), seguros para passar a componentes 'use client'.
 */
export async function getPublicProduct(productId: string) {
  const id = parseProductId(productId);
  if (!id) return null;

  const p = await prisma.product.findFirst({
    where: { id, ...productVisibility },
    select: {
      id: true,
      name: true,
      model: true,
      code: true,
      description: true,
      imgUrl: true,
      category: true,
      subcategory: true,
      brand: { select: { name: true, imgUrl: true } },
      informations: {
        where: { isActive: true },
        orderBy: { id: 'asc' },
        take: 1,
        select: {
          title: true,
          description: true,
          steps: {
            orderBy: { displayOrder: 'asc' },
            select: { id: true, title: true, description: true, icon: true },
          },
        },
      },
      assemblies: {
        where: { isActive: true },
        orderBy: { id: 'asc' },
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          imageUrl: true,
          steps: {
            orderBy: { stepNumber: 'asc' },
            select: { id: true, stepNumber: true, title: true, description: true, imageUrl: true },
          },
        },
      },
      videos: { orderBy: { id: 'asc' }, select: { id: true, title: true, description: true, url: true } },
      audios: { orderBy: { id: 'asc' }, select: { id: true, audioUrl: true, audioType: true } },
      technicalSheets: {
        orderBy: { id: 'asc' },
        take: 1,
        select: { title: true, description: true, material: true, dimensions: true, weight: true, specifications: true },
      },
      manuals: {
        where: { isActive: true },
        orderBy: { id: 'asc' },
        select: { id: true, title: true, fileUrl: true, documentType: true, language: true, version: true },
      },
      galleries: {
        where: { isActive: true },
        orderBy: { id: 'asc' },
        select: {
          mediaType: true,
          mediaUrl: true,
          images: { orderBy: { displayOrder: 'asc' }, select: { imageUrl: true } },
        },
      },
    },
  });

  if (!p) return null;

  const info = p.informations[0] ?? null;
  const sheet = p.technicalSheets[0] ?? null;

  return {
    id: p.id,
    name: p.name,
    model: p.model,
    code: p.code,
    description: p.description,
    imgUrl: p.imgUrl,
    category: p.category,
    subcategory: p.subcategory,
    brand: p.brand,
    // titulo + descricao + cards (os cards sao os InformationStep)
    information: info ? { title: info.title, description: info.description, cards: info.steps } : null,
    assemblies: p.assemblies,
    videos: p.videos,
    audios: p.audios,
    // imagens da galeria (todas as galerias IMAGE) e modelo 3D
    gallery: p.galleries.filter((g) => g.mediaType === 'IMAGE').flatMap((g) => g.images.map((i) => i.imageUrl)),
    model3dUrl: p.galleries.find((g) => g.mediaType === 'MODEL_3D')?.mediaUrl ?? null,
    technical: sheet
      ? {
          title: sheet.title,
          description: sheet.description,
          material: sheet.material,
          dimensions: sheet.dimensions,
          weightKg: sheet.weight ? sheet.weight.toNumber() : null, // Decimal -> number
          specs: sheet.specifications, // JSON salvo pelo wizard (d.specs)
        }
      : null,
    manuals: p.manuals,
  };
}

export type PublicProduct = NonNullable<Awaited<ReturnType<typeof getPublicProduct>>>;