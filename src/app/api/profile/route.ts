import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError, readBody, requireUser } from '@/lib/companyAccess';

// Mesmas regras do cadastro de usuário (api/users)
const profileInput = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  userName: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must have at least 3 characters')
    .max(40)
    .regex(/^[a-z0-9._-]+$/, 'Username can only have letters, numbers, dots, dashes and underscores'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address').max(254),
});

// PATCH /api/profile  { firstName, lastName, userName, email }
// O id vem da sessão, nunca do corpo: o usuário só edita a si mesmo.
export async function PATCH(req: Request) {
  try {
    const me = await requireUser();
    const data = await readBody(req, profileInput);

    try {
      await prisma.user.update({ where: { id: me.id }, data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new HttpError(409, 'Username or email already exists');
      }
      throw e;
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}