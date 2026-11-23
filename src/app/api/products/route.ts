import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError, readBody, requireUser } from '@/lib/companyAccess';
import { requireBrandEditor } from '@/lib/productAccess';
import { createProductInput } from '@/lib/productSchemas';
import { getProgress, listProducts } from '@/lib/productQueries';

// GET /api/products?brandId=&category=&subcategory=&q=&tab=&page=&pageSize=
export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const sp = new URL(req.url).searchParams;
    const brandId = Number(sp.get('brandId'));
    const tab = sp.get('tab');
    const result = await listProducts(user, {
      brandId: Number.isInteger(brandId) && brandId > 0 ? brandId : undefined,
      category: sp.get('category') ?? undefined,
      subcategory: sp.get('subcategory') ?? undefined,
      q: sp.get('q') ?? undefined,
      tab: tab === 'complete' || tab === 'incomplete' || tab === 'draft' ? tab : 'all',
      page: Number(sp.get('page')) || 1,
      pageSize: Number(sp.get('pageSize')) || 12,
    });
    return NextResponse.json(result);
  } catch (e) {
    return handleError(e);
  }
}

// POST /api/products  -> etapa 1: cria o produto como rascunho
export async function POST(req: Request) {
  try {
    const data = await readBody(req, createProductInput);
    await requireBrandEditor(data.brandId);

    if (await prisma.product.findUnique({ where: { code: data.code }, select: { id: true } })) {
      throw new HttpError(409, 'This SKU / part number is already in use');
    }

    const product = await prisma.product.create({
      data: { ...data, status: 'DRAFT' },
      select: { id: true },
    });
    return NextResponse.json({ product, progress: await getProgress(product.id) }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}