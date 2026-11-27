import 'server-only';
import { prisma } from '@/lib/prisma';
import { HttpError } from '@/lib/companyAccess';
import type { ProfileBrand, ProfileCompany } from '@/_components/userPanelComponents/profile/ProfileMemberships';
import type { ProfileUser } from '@/_components/userPanelComponents/profile/ProfileView';

// Mesmas regras do layout de settings:
// - só OWNER edita a empresa
// - OWNER e MANAGER enxergam e editam todas as marcas da empresa
// - MEMBER só vê as marcas em que foi vinculado (UserBrand), sem editar
const ONLY_OWNER_MSG = 'Você é o único proprietário desta empresa. Adicione outro proprietário antes de sair.';

/** Tudo que a página /painel/perfil precisa, já com as regras aplicadas. */
export async function getProfileData(userId: number) {
  const found = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, lastName: true, userName: true, email: true, createdAt: true },
  });
  if (!found) throw new HttpError(404, 'Usuário não encontrado');

  const user: ProfileUser = {
    id: found.id,
    firstName: found.firstName,
    lastName: found.lastName,
    userName: found.userName,
    email: found.email,
    memberSince: found.createdAt.toISOString(),
  };

  const memberships = await prisma.userCompany.findMany({
    where: { userId, company: { isActive: true } },
    orderBy: { company: { name: 'asc' } },
    select: {
      companyId: true,
      companyRole: true,
      company: { select: { name: true } },
      userBrands: {
        where: { brand: { isActive: true } },
        select: {
          brandRole: true,
          brand: { select: { id: true, name: true, company: { select: { name: true } } } },
        },
      },
    },
  });

  // Quantos owners ativos cada empresa tem (para travar o "Leave" do último)
  const ownerCounts = await prisma.userCompany.groupBy({
    by: ['companyId'],
    where: {
      companyId: { in: memberships.map((m) => m.companyId) },
      companyRole: 'OWNER',
      user: { isActive: true },
    },
    _count: { _all: true },
  });
  const owners = new Map(ownerCounts.map((o) => [o.companyId, o._count._all]));

  const companies: ProfileCompany[] = memberships.map((m) => ({
    companyId: m.companyId,
    name: m.company.name,
    role: m.companyRole,
    canEdit: m.companyRole === 'OWNER',
    leaveBlockedReason:
      m.companyRole === 'OWNER' && (owners.get(m.companyId) ?? 0) <= 1 ? ONLY_OWNER_MSG : null,
  }));

  // Marcas atribuídas diretamente (UserBrand)
  const brandMap = new Map<number, ProfileBrand>();
  for (const m of memberships) {
    for (const ub of m.userBrands) {
      brandMap.set(ub.brand.id, {
        brandId: ub.brand.id,
        name: ub.brand.name,
        companyName: ub.brand.company.name,
        role: ub.brandRole,
        canEdit: false,
        leaveBlockedReason: null,
      });
    }
  }

  // + todas as marcas das empresas onde é OWNER ou MANAGER (acesso implícito)
  const implicit = new Map<number, 'OWNER' | 'MANAGER'>();
  for (const m of memberships) {
    if (m.companyRole === 'OWNER' || m.companyRole === 'MANAGER') implicit.set(m.companyId, m.companyRole);
  }

  if (implicit.size > 0) {
    const implicitBrands = await prisma.brand.findMany({
      where: { companyId: { in: [...implicit.keys()] }, isActive: true },
      select: { id: true, name: true, companyId: true, company: { select: { name: true } } },
    });
    for (const b of implicitBrands) {
      const role = implicit.get(b.companyId)!;
      // O acesso pela empresa vale mais que um papel de marca que ele também tenha
      brandMap.set(b.id, {
        brandId: b.id,
        name: b.name,
        companyName: b.company.name,
        role,
        canEdit: true,
        leaveBlockedReason: `You have access to every brand as ${
          role === 'OWNER' ? 'an owner' : 'a manager'
        } of this company.`,
      });
    }
  }

  const brands = [...brandMap.values()].sort(
    (a, b) => a.name.localeCompare(b.name) || a.companyName.localeCompare(b.companyName),
  );

  return { user, companies, brands };
}