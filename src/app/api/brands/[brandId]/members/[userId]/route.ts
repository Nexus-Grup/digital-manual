import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError, requireUser } from '@/lib/companyAccess';
import { findBrandMember, parseBody, parseId, requireBrandManager } from '@/lib/brandAccess';
import { brandRoleInput } from '@/lib/brandSchema';

type Ctx = { params: Promise<{ brandId: string; userId: string }> };

// PATCH /api/brands/[brandId]/members/[userId]  { brandRole }
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const p = await params;
    const brandId = parseId(p.brandId);
    const userId = parseId(p.userId);

    const { brand } = await requireBrandManager(brandId);
    const { brandRole } = parseBody(brandRoleInput, await req.json().catch(() => null));
    const member = await findBrandMember(brandId, brand.companyId, userId);

    await prisma.userBrand.update({ where: { id: member.id }, data: { brandRole } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}

// DELETE /api/brands/[brandId]/members/[userId]
// - Qualquer membro pode SAIR da própria marca (userId = ele mesmo).
// - Remover OUTRA pessoa continua exigindo gerente da marca.
// Só remove o acesso à marca: o usuário continua na empresa.
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const p = await params;
    const brandId = parseId(p.brandId);
    const userId = parseId(p.userId);

    const me = await requireUser();

    let companyId: number;
    if (me.id === userId) {
      const brand = await prisma.brand.findFirst({
        where: { id: brandId, isActive: true },
        select: { companyId: true },
      });
      if (!brand) throw new HttpError(404, 'Marca não encontrada');
      companyId = brand.companyId;
    } else {
      const { brand } = await requireBrandManager(brandId);
      companyId = brand.companyId;
    }

    const member = await findBrandMember(brandId, companyId, userId);

    await prisma.userBrand.delete({ where: { id: member.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}