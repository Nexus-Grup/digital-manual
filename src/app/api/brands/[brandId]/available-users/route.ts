import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/companyAccess';
import { parseId, requireBrandManager } from '@/lib/brandAccess';

type Ctx = { params: Promise<{ brandId: string }> };

// GET /api/brands/[brandId]/available-users?q=...
// Membros da empresa (OWNER ou MEMBER) que ainda não estão nesta marca.
export async function GET(req: Request, { params }: Ctx) {
  try {
    const brandId = parseId((await params).brandId);
    const { brand } = await requireBrandManager(brandId);

    const q = new URL(req.url).searchParams.get('q')?.trim() ?? '';
    if (q.length < 2) return NextResponse.json({ users: [] });

    // "john smith": cada palavra precisa bater em algum campo
    const terms = q.split(/\s+/).filter(Boolean).slice(0, 4);

    const rows = await prisma.userCompany.findMany({
      where: {
        companyId: brand.companyId,
        userBrands: { none: { brandId } },
        user: {
          isActive: true,
          AND: terms.map((term) => ({
            OR: [
              { firstName: { contains: term, mode: 'insensitive' as const } },
              { lastName: { contains: term, mode: 'insensitive' as const } },
              { userName: { contains: term, mode: 'insensitive' as const } },
              { email: { contains: term, mode: 'insensitive' as const } },
            ],
          })),
        },
      },
      select: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { user: { firstName: 'asc' } },
      take: 10,
    });

    return NextResponse.json({ users: rows.map((r) => r.user) });
  } catch (e) {
    return handleError(e);
  }
}