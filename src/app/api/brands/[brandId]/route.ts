import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/companyAccess';
import { parseBody, parseId, requireBrandManager } from '@/lib/brandAccess';
import { brandInput, brandStatusInput } from '@/lib/brandSchema';
import { deleteCompanyLogo } from '@/lib/supabase-admin';

type Ctx = { params: Promise<{ brandId: string }> };

// PATCH /api/brands/[brandId]
//  - { isActive }                      -> ativa / desativa a marca
//  - { name, description, logoUrl }    -> edita os dados
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const brandId = parseId((await params).brandId);
    const { brand } = await requireBrandManager(brandId);
    const body = await req.json().catch(() => null);

    // Corpo só com { isActive }: não pode mexer nos outros campos
    if (
      body &&
      typeof body === 'object' &&
      Object.keys(body).length === 1 &&
      'isActive' in body
    ) {
      const { isActive } = parseBody(brandStatusInput, body);
      await prisma.brand.update({ where: { id: brandId }, data: { isActive } });
      return NextResponse.json({ ok: true });
    }

    const data = parseBody(brandInput, body);

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        name: data.name,
        description: data.description,
        imgUrl: data.logoUrl,
      },
    });

    // Logo trocado ou removido: apaga o arquivo antigo do Storage
    if (brand.imgUrl && brand.imgUrl !== data.logoUrl) {
      await deleteCompanyLogo(brand.imgUrl).catch(() => undefined);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}