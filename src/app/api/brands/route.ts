import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError, requireUser } from '@/lib/companyAccess';
import { assertCanManageBrands, parseBody } from '@/lib/brandAccess';
import { createBrandInput } from '@/lib/brandSchema';

// POST /api/brands  -> cria uma marca em uma empresa da qual o usuário é OWNER
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const data = parseBody(createBrandInput, await req.json().catch(() => null));

    // O companyId vem do navegador: confere no banco se o usuário é OWNER,
    // MANAGER (ou ADMIN) dessa empresa
    await assertCanManageBrands(user.id, data.companyId);

    const company = await prisma.company.findFirst({
      where: { id: data.companyId, isActive: true },
      select: { id: true },
    });
    if (!company) throw new HttpError(404, 'Empresa não encontrada');

    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        description: data.description,
        imgUrl: data.logoUrl,
        companyId: data.companyId,
      },
      select: { id: true },
    });

    return NextResponse.json({ brand }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}