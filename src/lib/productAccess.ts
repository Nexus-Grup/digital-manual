import { prisma } from '@/lib/prisma';
import { HttpError, requireUser } from '@/lib/companyAccess';
import { isProductMediaUrl } from '@/lib/productMedia';

type U = { id: number; systemRole: string };

/**
 * Regras de produto:
 *  - ADMIN: tudo.
 *  - OWNER / MANAGER da empresa: vê e edita todas as marcas dela.
 *  - MEMBER da empresa: precisa estar vinculado à marca. EDITOR cria/edita, VIEWER só visualiza.
 */
export async function brandAccess(user: U, brandId: number) {
  const none = { canView: false, canEdit: false };
  if (user.systemRole === 'ADMIN') return { canView: true, canEdit: true };

  const brand = await prisma.brand.findUnique({ where: { id: brandId }, select: { companyId: true } });
  if (!brand) return none;

  const m = await prisma.userCompany.findUnique({
    where: { userId_companyId: { userId: user.id, companyId: brand.companyId } },
    select: { companyRole: true, userBrands: { where: { brandId }, select: { brandRole: true } } },
  });
  if (!m) return none;
  if (m.companyRole === 'OWNER' || m.companyRole === 'MANAGER') return { canView: true, canEdit: true };

  const role = m.userBrands[0]?.brandRole;
  return { canView: !!role, canEdit: role === 'EDITOR' };
}

/** Para criar produto: precisa poder editar a marca escolhida. */
export async function requireBrandEditor(brandId: number) {
  const user = await requireUser();
  const a = await brandAccess(user, brandId);
  if (!a.canView) throw new HttpError(404, 'Marca não encontrada');
  if (!a.canEdit) throw new HttpError(403, 'Você não tem permissão para criar produtos nesta marca');
  return user;
}

/** Para rotas de um produto existente. */
export async function requireProductAccess(productId: number, mode: 'view' | 'edit') {
  const user = await requireUser();
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, brandId: true, code: true },
  });
  if (!product) throw new HttpError(404, 'Produto não encontrado');

  const a = await brandAccess(user, product.brandId);
  if (!a.canView) throw new HttpError(404, 'Produto não encontrado'); // não revela que existe
  if (mode === 'edit' && !a.canEdit) throw new HttpError(403, 'Você não tem permissão para editar este produto');
  return { user, product, canEdit: a.canEdit };
}

/** Cada arquivo precisa ser deste produto (não vale reaproveitar URL de outro). */
export function assertOwnMedia(productId: number, urls: (string | null | undefined)[]) {
  for (const u of urls) {
    if (u && !isProductMediaUrl(u, productId)) throw new HttpError(400, 'Arquivo inválido');
  }
}
