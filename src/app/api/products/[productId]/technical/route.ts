import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { handleError, parseId, readBody } from '@/lib/companyAccess';
import { requireProductAccess } from '@/lib/productAccess';
import { parseWeightKg, technicalInput } from '@/lib/productSchemas';
import { getProgress } from '@/lib/productQueries';

type Ctx = { params: Promise<{ productId: string }> };

// PUT: etapa 3 (uma ficha técnica por produto)
export async function PUT(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');
    const d = await readBody(req, technicalInput);

    await prisma.$transaction([
      prisma.productTechnicalSheet.deleteMany({ where: { productId } }),
      prisma.productTechnicalSheet.create({
        data: {
          productId,
          title: d.title,
          description: d.description,
          material: d.material,
          dimensions: d.dimensions,
          weight: d.weight ? parseWeightKg(d.weight) : null,
          specifications: d.specs as unknown as Prisma.InputJsonValue,
        },
      }),
      prisma.product.update({ where: { id: productId }, data: { updatedAt: new Date() } }),
    ]);
    return NextResponse.json({ ok: true, progress: await getProgress(productId) });
  } catch (e) {
    return handleError(e);
  }
}