import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError, readBody, requireUser } from '@/lib/companyAccess';

const passwordInput = z.object({
  currentPassword: z.string().min(1, 'Digite sua senha atual'),
  // bcrypt só considera os primeiros 72 bytes, por isso o limite
  newPassword: z.string().min(8, 'Use pelo menos 8 caracteres').max(72, 'Use no máximo 72 caracteres'),
});

// POST /api/profile/password  { currentPassword, newPassword }
export async function POST(req: Request) {
  try {
    const me = await requireUser();
    const { currentPassword, newPassword } = await readBody(req, passwordInput);

    const row = await prisma.user.findUnique({
      where: { id: me.id },
      select: { passwordHash: true },
    });
    if (!row) throw new HttpError(404, 'Usuário não encontrado');

    // 400 (e não 401) para a tela não tratar "senha errada" como sessão expirada
    const valid = await bcrypt.compare(currentPassword, row.passwordHash);
    if (!valid) throw new HttpError(400, 'A senha atual está incorreta');

    if (currentPassword === newPassword) {
      throw new HttpError(400, 'A nova senha precisa ser diferente da atual');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: me.id },
        data: { passwordHash: await bcrypt.hash(newPassword, 12), mustChangePassword: false },
      }),
      // Qualquer código de "esqueci a senha" pendente deixa de valer
      prisma.passwordResetCode.deleteMany({ where: { userId: me.id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}