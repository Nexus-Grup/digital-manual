import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { newMemberInput } from '@/lib/companySchemas';
import { handleError, parseId, readBody, requireOwner } from '@/lib/companyAccess';

export async function POST(req: Request, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    const companyId = parseId((await params).companyId);
    await requireOwner(companyId);
    const data = await readBody(req, newMemberInput);

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          userName: data.username,
          email: data.email,
          passwordHash,
          mustChangePassword: true, // senha temporária
        },
        select: { id: true },
      });
      await tx.userCompany.create({
        data: { userId: created.id, companyId, companyRole: data.companyRole },
      });
      return created;
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    return handleError(e); // e-mail/username repetido cai no P2002 -> 409
  }
}