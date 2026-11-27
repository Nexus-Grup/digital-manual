import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError, readBody, requireUser } from '@/lib/companyAccess';

// Mesmas regras do cadastro de usuário (api/users)
const profileInput = z.object({
  firstName: z.string().trim().min(1, 'O nome é obrigatório').max(80),
  lastName: z.string().trim().min(1, 'O sobrenome é obrigatório').max(80),
  userName: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'O nome de usuário precisa ter pelo menos 3 caracteres')
    .max(40)
    .regex(/^[a-z0-9._-]+$/, 'O nome de usuário só pode ter letras, números, pontos, hifens e sublinhados'),
  email: z.string().trim().toLowerCase().email('Digite um e-mail válido').max(254),
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
        throw new HttpError(409, 'Nome de usuário ou e-mail já cadastrado');
      }
      throw e;
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}