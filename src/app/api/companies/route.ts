import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { companyInput } from '@/lib/companySchemas';
import { handleError, readBody, requireUser } from '@/lib/companyAccess';

export async function GET() {
  try {
    const user = await requireUser();
    const companies = await prisma.company.findMany({
      where: {
        isActive: true,
        ...(user.systemRole === 'ADMIN' ? {} : { userCompanies: { some: { userId: user.id } } }),
      },
      select: { id: true, name: true, logoUrl: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ companies });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const data = await readBody(req, companyInput);
    // quem cria vira OWNER automaticamente
    const company = await prisma.company.create({
      data: { ...data, userCompanies: { create: { userId: user.id, companyRole: 'OWNER' } } },
      select: { id: true, name: true },
    });
    return NextResponse.json({ company }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}