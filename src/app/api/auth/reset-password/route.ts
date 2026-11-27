import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { MAX_ATTEMPTS, hashCode } from "@/lib/reset-code";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().regex(/^\d{6}$/),
  password: z.string().min(8),
});

const invalid = () =>
  NextResponse.json({ error: "Código inválido ou expirado" }, { status: 400 });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return invalid();

  const { email, code, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return invalid();

  const record = await prisma.passwordResetCode.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date() || record.attempts >= MAX_ATTEMPTS) {
    return invalid();
  }

  const matches = timingSafeEqual(
    Buffer.from(hashCode(code)),
    Buffer.from(record.codeHash)
  );

  if (!matches) {
    await prisma.passwordResetCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return invalid();
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(password, 12),
        mustChangePassword: false,
      },
    }),
    // Código usado (e qualquer outro pendente) é descartado
    prisma.passwordResetCode.deleteMany({ where: { userId: user.id } }),
  ]);

  return NextResponse.json({ ok: true });
}
