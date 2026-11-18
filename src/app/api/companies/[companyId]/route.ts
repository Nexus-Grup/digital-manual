import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { companyInput } from '@/lib/companySchemas';
import { HttpError, handleError, parseId, readBody, requireMember, requireOwner } from '@/lib/companyAccess';

type Ctx = { params: Promise<{ companyId: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const companyId = parseId((await params).companyId);
    await requireMember(companyId);
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true, name: true, description: true, website: true, logoUrl: true, isActive: true,
        userCompanies: {
          select: {
            companyRole: true,
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });
    if (!company) throw new HttpError(404, 'Company not found');
    return NextResponse.json({ company });
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const companyId = parseId((await params).companyId);
    await requireOwner(companyId);
    const data = await readBody(req, companyInput);
    const company = await prisma.company.update({
      where: { id: companyId },
      data,
      select: { id: true, name: true },
    });
    return NextResponse.json({ company });
  } catch (e) {
    return handleError(e);
  }
}