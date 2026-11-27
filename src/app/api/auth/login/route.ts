import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
  remember: z.boolean().optional(),
});

// Hash falso: o tempo de resposta fica parecido quando o e-mail não existe
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 12);

const invalid = () =>
  NextResponse.json({ error: "E-mail ou senha inválidos" }, { status: 401 });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return invalid();

  const { email, password, remember } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  // Mesma mensagem para e-mail inexistente, senha errada ou usuário inativo
  if (!user || !valid || !user.isActive) return invalid();

  await createSession(user.id, remember ?? false);

  return NextResponse.json({
    ok: true,
    mustChangePassword: user.mustChangePassword,
  });
}
