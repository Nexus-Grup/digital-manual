import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError } from '@/lib/companyAccess';
import { parseBody, parseId, requireBrandManager } from '@/lib/brandAccess';
import { addBrandMemberInput } from '@/lib/brandSchema';

type Ctx = { params: Promise<{ brandId: string }> };

// POST /api/brands/[brandId]/members  { userId, brandRole }
// Adiciona à marca alguém que já é membro (OWNER ou MEMBER) da empresa.
export async function POST(req: Request, { params }: Ctx) {
  try {
    const brandId = parseId((await params).brandId);
    const { brand } = await requireBrandManager(brandId);
    const data = parseBody(addBrandMemberInput, await req.json().catch(() => null));

    const membership = await prisma.userCompany.findUnique({
      where: { userId_companyId: { userId: data.userId, companyId: brand.companyId } },
      select: { id: true, user: { select: { isActive: true } } },
    });
    if (!membership || !membership.user.isActive) {
      throw new HttpError(400, 'Este usuário não é membro da empresa');
    }

    try {
      await prisma.userBrand.create({
        data: {
          userCompanyId: membership.id,
          brandId,
          brandRole: data.brandRole,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new HttpError(409, 'Este usuário já está na marca');
      }
      throw e;
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}