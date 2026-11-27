import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { roleInput } from '@/lib/companySchemas';
import {
  HttpError,
  assertNotLastOwner,
  handleError,
  parseId,
  readBody,
  requireOwner,
  requireUser,
} from '@/lib/companyAccess';

type Ctx = { params: Promise<{ companyId: string; userId: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const p = await params;
    const companyId = parseId(p.companyId);
    const userId = parseId(p.userId);
    await requireOwner(companyId);
    const { companyRole } = await readBody(req, roleInput);

    // if (companyRole === 'MEMBER') await assertNotLastOwner(companyId, userId);
    if (companyRole !== 'OWNER') await assertNotLastOwner(companyId, userId);

    await prisma.userCompany.update({
      where: { userId_companyId: { userId, companyId } },
      data: { companyRole },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}

// DELETE /api/companies/[companyId]/members/[userId]
// - Qualquer membro pode SAIR da própria empresa (userId = ele mesmo).
// - Remover OUTRA pessoa continua exigindo OWNER.
// Nos dois casos o último OWNER não pode sair.
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const p = await params;
    const companyId = parseId(p.companyId);
    const userId = parseId(p.userId);

    const me = await requireUser();
    if (me.id !== userId) await requireOwner(companyId);

    const membership = await prisma.userCompany.findUnique({
      where: { userId_companyId: { userId, companyId } },
      select: { id: true },
    });
    if (!membership) throw new HttpError(404, 'Este usuário não é membro da empresa');

    await assertNotLastOwner(companyId, userId);

    // só remove o vínculo; a conta do usuário continua (UserBrand cai em cascata)
    await prisma.userCompany.delete({ where: { userId_companyId: { userId, companyId } } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}