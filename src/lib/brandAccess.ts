import type { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { HttpError, requireUser } from '@/lib/companyAccess';

/** Valida o corpo com zod e devolve a primeira mensagem de erro como HttpError 400. */
export function parseBody<S extends z.ZodTypeAny>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new HttpError(400, result.error.issues[0]?.message ?? 'Invalid data');
  }
  return result.data;
}

/** Converte o parâmetro da rota em id numérico (404 se for inválido). */
export function parseId(value: string) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, 'Not found');
  return id;
}

/**
 * Quem pode criar e editar marcas de uma empresa:
 * OWNER ou MANAGER da empresa, ou ADMIN da plataforma.
 */
export async function assertCanManageBrands(userId: number, companyId: number) {
  const membership = await prisma.userCompany.findUnique({
    where: { userId_companyId: { userId, companyId } },
    select: { companyRole: true },
  });
  if (membership?.companyRole === 'OWNER' || membership?.companyRole === 'MANAGER') return;

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { systemRole: true },
  });
  if (me?.systemRole === 'ADMIN') return;

  throw new HttpError(403, 'You do not have permission to manage brands in this company');
}

/**
 * Para rotas de uma marca existente: exige login e que o usuário seja
 * OWNER ou MANAGER da empresa dona da marca (ou ADMIN).
 * Devolve o usuário e a marca.
 */
export async function requireBrandManager(brandId: number) {
  const user = await requireUser();

  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    select: { id: true, name: true, companyId: true, imgUrl: true, isActive: true },
  });
  if (!brand) throw new HttpError(404, 'Brand not found');

  await assertCanManageBrands(user.id, brand.companyId);
  return { user, brand };
}

/** Vínculo de um usuário com a marca (404 se não existir). */
export async function findBrandMember(brandId: number, companyId: number, userId: number) {
  const member = await prisma.userBrand.findFirst({
    where: { brandId, userCompany: { userId, companyId } },
    select: { id: true },
  });
  if (!member) throw new HttpError(404, 'User is not in this brand');
  return member;
}