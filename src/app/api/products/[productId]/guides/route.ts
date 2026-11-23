import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { handleError, parseId, readBody } from '@/lib/companyAccess';
import { assertOwnMedia, requireProductAccess } from '@/lib/productAccess';
import { guidesInput } from '@/lib/productSchemas';
import { getProgress } from '@/lib/productQueries';

type Ctx = { params: Promise<{ productId: string }> };

// PUT: etapa 5. Informações (com cards) + guias de montagem (com passos).
export async function PUT(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');
    const { information, assemblies } = await readBody(req, guidesInput);
    assertOwnMedia(productId, assemblies.flatMap((a) => [a.imageUrl, ...a.steps.map((s) => s.imageUrl)]));

    // apagar a informação/guia apaga também os cards/passos (onDelete: Cascade)
    const ops: Prisma.PrismaPromise<unknown>[] = [
      prisma.information.deleteMany({ where: { productId } }),
      prisma.assembly.deleteMany({ where: { productId } }),
      prisma.product.update({ where: { id: productId }, data: { updatedAt: new Date() } }),
    ];

    if (information) {
      ops.push(
        prisma.information.create({
          data: {
            productId,
            type: 'FEATURE',
            title: information.title,
            description: information.description,
            steps: {
              create: information.cards.map((c, i) => ({
                title: c.title, icon: c.icon, description: c.description, displayOrder: i,
              })),
            },
          },
        }),
      );
    }

    for (const a of assemblies) {
      ops.push(
        prisma.assembly.create({
          data: {
            productId,
            type: a.type,
            title: a.title,
            description: a.description,
            imageUrl: a.imageUrl,
            steps: {
              create: a.steps.map((s, i) => ({
                stepNumber: i + 1, title: s.title, description: s.description, imageUrl: s.imageUrl,
              })),
            },
          },
        }),
      );
    }

    await prisma.$transaction(ops);
    return NextResponse.json({ ok: true, progress: await getProgress(productId) });
  } catch (e) {
    return handleError(e);
  }
}