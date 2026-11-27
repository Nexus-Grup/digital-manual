import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError, parseId, readBody } from '@/lib/companyAccess';
import { getProgress } from '@/lib/productQueries';
import { missingSteps } from '@/_lib/productConstants';
import { requireProductAccess } from '@/lib/productAccess';
import { statusInput } from '@/lib/productSchemas';

type Ctx = { params: Promise<{ productId: string }> };

// PATCH { status: 'DRAFT' | 'PUBLISHED' }  (botão "Publicar produto"; publicar exige 100%)
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');
    const { status } = await readBody(req, statusInput);
    // only complete products go public: the customer must find the whole manual (Nielsen 5)
    if (status === 'PUBLISHED') {
      const progress = await getProgress(productId);
      const missing = missingSteps(progress.steps);
      if (progress.completion < 100 && missing.length > 0) {
        throw new HttpError(400, `Complete o cadastro antes de publicar. Falta preencher: ${missing.join(', ')}.`);
      }
    }
    await prisma.product.update({ where: { id: productId }, data: { status } });
    return NextResponse.json({ ok: true, status });
  } catch (e) {
    return handleError(e);
  }
}