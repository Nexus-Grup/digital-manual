import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, parseId, requireOwner } from '@/lib/companyAccess';

export async function GET(req: Request, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    const companyId = parseId((await params).companyId);
    await requireOwner(companyId);

    const q = new URL(req.url).searchParams.get('q')?.trim() ?? '';
    if (q.length < 2) return NextResponse.json({ users: [] });

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        userCompanies: { none: { companyId } }, // só quem ainda não está na empresa
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { userName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { firstName: 'asc' },
      take: 8,
    });
    return NextResponse.json({ users });
  } catch (e) {
    return handleError(e);
  }
}