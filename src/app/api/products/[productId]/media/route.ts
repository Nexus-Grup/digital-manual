import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { handleError, parseId, readBody } from '@/lib/companyAccess';
import { assertOwnMedia, requireProductAccess } from '@/lib/productAccess';
import { mediaInput } from '@/lib/productSchemas';
import { getProgress } from '@/lib/productQueries';

type Ctx = { params: Promise<{ productId: string }> };

// PUT: etapa 2. Troca todo o conteúdo de mídia pelo que veio na tela.
export async function PUT(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');
    const d = await readBody(req, mediaInput);
    assertOwnMedia(productId, [d.imgUrl, ...d.gallery, ...d.audios.map((a) => a.audioUrl)]);

    const ops: Prisma.PrismaPromise<unknown>[] = [
      prisma.product.update({ where: { id: productId }, data: { imgUrl: d.imgUrl, updatedAt: new Date() } }),
      prisma.productGallery.deleteMany({ where: { productId } }),
      prisma.productVideo.deleteMany({ where: { productId } }),
      prisma.productAudio.deleteMany({ where: { productId } }),
    ];
    if (d.gallery.length) {
      ops.push(
        prisma.productGallery.create({
          data: {
            productId, title: 'Product Gallery', mediaType: 'IMAGE',
            images: { create: d.gallery.map((imageUrl, i) => ({ imageUrl, displayOrder: i })) },
          },
        }),
      );
    }
    if (d.model3dUrl) {
      ops.push(
        prisma.productGallery.create({
          data: { productId, title: '3D Model', mediaType: 'MODEL_3D', mediaUrl: d.model3dUrl },
        }),
      );
    }
    if (d.videos.length) ops.push(prisma.productVideo.createMany({ data: d.videos.map((v) => ({ ...v, productId })) }));
    if (d.audios.length) ops.push(prisma.productAudio.createMany({ data: d.audios.map((a) => ({ ...a, productId })) }));

    await prisma.$transaction(ops);
    return NextResponse.json({ ok: true, progress: await getProgress(productId) });
  } catch (e) {
    return handleError(e);
  }
}