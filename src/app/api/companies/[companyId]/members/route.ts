import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addMemberInput } from '@/lib/companySchemas';
import { HttpError, handleError, parseId, readBody, requireOwner } from '@/lib/companyAccess';

export async function POST(req: Request, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    const companyId = parseId((await params).companyId);
    await requireOwner(companyId);
    const { userId, companyRole } = await readBody(req, addMemberInput);

    const user = await prisma.user.findFirst({ where: { id: userId, isActive: true }, select: { id: true } });
    if (!user) throw new HttpError(404, 'User not found');

    const already = await prisma.userCompany.findUnique({
      where: { userId_companyId: { userId, companyId } },
      select: { id: true },
    });
    if (already) throw new HttpError(409, 'User is already in this company');

    await prisma.userCompany.create({ data: { userId, companyId, companyRole } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}