import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, parseId, readBody } from '@/lib/companyAccess';
import { requireProductAccess } from '@/lib/productAccess';
import { statusInput } from '@/lib/productSchemas';

type Ctx = { params: Promise<{ productId: string }> };

// PATCH { status: 'DRAFT' | 'PUBLISHED' }  (botão "Publish Product")
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');
    const { status } = await readBody(req, statusInput);
    await prisma.product.update({ where: { id: productId }, data: { status } });
    return NextResponse.json({ ok: true, status });
  } catch (e) {
    return handleError(e);
  }
}