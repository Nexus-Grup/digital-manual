import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError, parseId, readBody } from '@/lib/companyAccess';
import { requireProductAccess } from '@/lib/productAccess';
import { updateBasicInput } from '@/lib/productSchemas';
import { getProductFull, getProgress } from '@/lib/productQueries';
import type { ProductSubcategory } from '@prisma/client';

type Ctx = { params: Promise<{ productId: string }> };

// GET: produto completo (tela de edição e modal "Product Details")
export async function GET(_req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    const { canEdit } = await requireProductAccess(productId, 'view');
    return NextResponse.json({ product: await getProductFull(productId, canEdit) });
  } catch (e) {
    return handleError(e);
  }
}

// PATCH: etapa 1 (dados básicos). A marca não muda depois de criado.
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');
    const data = await readBody(req, updateBasicInput);

    const clash = await prisma.product.findUnique({ where: { code: data.code }, select: { id: true } });
    if (clash && clash.id !== productId) throw new HttpError(409, 'This SKU / part number is already in use');

    await prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
        // o schema entrega string | null; o Prisma exige o enum
        subcategory: data.subcategory as ProductSubcategory | null,
      },
    });
    return NextResponse.json({ ok: true, progress: await getProgress(productId) });
  } catch (e) {
    return handleError(e);
  }
}