import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { roleInput } from '@/lib/companySchemas';
import { assertNotLastOwner, handleError, parseId, readBody, requireOwner } from '@/lib/companyAccess';

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

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const p = await params;
    const companyId = parseId(p.companyId);
    const userId = parseId(p.userId);
    await requireOwner(companyId);
    await assertNotLastOwner(companyId, userId);

    // só remove o vínculo; a conta do usuário continua (UserBrand cai em cascata)
    await prisma.userCompany.delete({ where: { userId_companyId: { userId, companyId } } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}