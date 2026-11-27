import { NextResponse, after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendResetCode } from "@/lib/mailer";
import {
  CODE_TTL_MS,
  RESEND_COOLDOWN_MS,
  generateCode,
  hashCode,
} from "@/lib/reset-code";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Digite um e-mail válido" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user && user.isActive) {
    const last = await prisma.passwordResetCode.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const cooledDown = !last || Date.now() - last.createdAt.getTime() > RESEND_COOLDOWN_MS;

    if (cooledDown) {
      const code = generateCode();

      // Só o código mais recente vale
      await prisma.$transaction([
        prisma.passwordResetCode.deleteMany({ where: { userId: user.id } }),
        prisma.passwordResetCode.create({
          data: {
            userId: user.id,
            codeHash: hashCode(code),
            expiresAt: new Date(Date.now() + CODE_TTL_MS),
          },
        }),
      ]);

      // Envia depois da resposta: o tempo não revela se o e-mail existe
      after(async () => {
        try {
          await sendResetCode(user.email, code);
        } catch (err) {
          console.error("Não foi possível enviar o código de redefinição", err);
        }
      });
    }
  }

  // Sempre a mesma resposta, exista ou não a conta
  return NextResponse.json({ ok: true });
}
