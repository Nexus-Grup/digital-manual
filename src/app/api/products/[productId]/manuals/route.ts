import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { handleError, parseId, readBody } from '@/lib/companyAccess';
import { assertOwnMedia, requireProductAccess } from '@/lib/productAccess';
import { manualsInput } from '@/lib/productSchemas';
import { getProgress } from '@/lib/productQueries';

type Ctx = { params: Promise<{ productId: string }> };

// PUT: etapa 4. Troca a lista de manuais pela que veio na tela.
export async function PUT(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');
    const { manuals } = await readBody(req, manualsInput);
    assertOwnMedia(productId, manuals.map((m) => m.fileUrl));

    const ops: Prisma.PrismaPromise<unknown>[] = [
      prisma.manual.deleteMany({ where: { productId } }),
      prisma.product.update({ where: { id: productId }, data: { updatedAt: new Date() } }),
    ];
    if (manuals.length) ops.push(prisma.manual.createMany({ data: manuals.map((m) => ({ ...m, productId })) }));

    await prisma.$transaction(ops);
    return NextResponse.json({ ok: true, progress: await getProgress(productId) });
  } catch (e) {
    return handleError(e);
  }
}