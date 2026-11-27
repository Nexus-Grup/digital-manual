import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function parseId(raw: string) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'ID inválido');
  return n;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, 'Faça login para continuar');
  return user;
}

/** Usuário logado precisa fazer parte da empresa (ADMIN do sistema passa como OWNER). */
export async function requireMember(companyId: number) {
  const user = await requireUser();

  // ADMIN primeiro: mesmo sendo membro com outro role, tem acesso de OWNER
  if (user.systemRole === 'ADMIN') return { user, role: 'OWNER' as const };

  const m = await prisma.userCompany.findUnique({
    where: { userId_companyId: { userId: user.id, companyId } },
    select: { companyRole: true },
  });
  if (!m) throw new HttpError(404, 'Empresa não encontrada');
  return { user, role: m.companyRole };
}

export async function requireOwner(companyId: number) {
  const access = await requireMember(companyId);
  if (access.role !== 'OWNER') throw new HttpError(403, 'Só proprietários podem fazer isso');
  return access.user;
}

/**
 * Para pages (Server Components): ADMIN ou OWNER da empresa.
 * Não lança erro, devolve boolean (use com notFound() na page).
 */
export async function canManageCompany(
  user: { id: number; systemRole: string },
  companyId: number
) {
  if (user.systemRole === 'ADMIN') return true;
  const m = await prisma.userCompany.findUnique({
    where: { userId_companyId: { userId: user.id, companyId } },
    select: { companyRole: true },
  });
  return m?.companyRole === 'OWNER';
}

/**
 * Quem enxerga a área de empresas (sidebar, criar, editar):
 * ADMIN do sistema ou OWNER de ao menos uma empresa ativa.
 * Membro comum (EDITOR/VIEWER de marca) não entra.
 */
export async function canAccessCompanyArea(user: { id: number; systemRole: string }) {
  if (user.systemRole === 'ADMIN') return true;
  const owned = await prisma.userCompany.findFirst({
    where: { userId: user.id, companyRole: 'OWNER', company: { isActive: true } },
    select: { companyId: true },
  });
  return !!owned;
}

/** Para a rota de API que cria empresa. */
export async function requireCompanyCreator() {
  const user = await requireUser();
  if (!(await canAccessCompanyArea(user))) throw new HttpError(403, 'Ação não permitida');
  return user;
}

/** Não deixa a empresa ficar sem nenhum OWNER. */
export async function assertNotLastOwner(companyId: number, userId: number) {
  const target = await prisma.userCompany.findUnique({
    where: { userId_companyId: { userId, companyId } },
    select: { companyRole: true },
  });
  if (!target) throw new HttpError(404, 'Membro não encontrado');
  if (target.companyRole === 'OWNER') {
    const owners = await prisma.userCompany.count({
      where: { companyId, companyRole: 'OWNER' },
    });
    if (owners <= 1) throw new HttpError(409, 'A empresa precisa de pelo menos um proprietário');
  }
}

export async function readBody<S extends z.ZodType>(req: Request, schema: S): Promise<z.output<S>> {
  const raw = await req.json().catch(() => null);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new HttpError(400, parsed.error.issues[0]?.message ?? 'Dados inválidos');
  }
  return parsed.data;
}

export function handleError(err: unknown) {
  if (err instanceof HttpError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: unknown }).code) : '';
  if (code === 'P2002') {
    return NextResponse.json({ error: 'Nome de usuário ou e-mail já em uso' }, { status: 409 });
  }
  if (code === 'P2025') {
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }
  console.error(err);
  return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
}