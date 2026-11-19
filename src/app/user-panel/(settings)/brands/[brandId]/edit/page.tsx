import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BrandForm } from '@/_components/userPanelComponents/BrandForm';
import { BrandUsers } from '@/_components/userPanelComponents/BrandUsers';
export const instant = false;

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ brandId: string }>;
}) {
  const { brandId } = await params;
  const id = Number(brandId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const brand = await prisma.brand.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      imgUrl: true,
      isActive: true,
      company: {
        select: {
          userCompanies: {
            where: { userId: user.id },
            select: { companyRole: true },
          },
        },
      },
      userBrands: {
        orderBy: { createdAt: 'asc' },
        select: {
          brandRole: true,
          userCompany: {
            select: {
              user: {
                select: { id: true, firstName: true, lastName: true, userName: true, email: true },
              },
            },
          },
        },
      },
    },
  });
  if (!brand) notFound();

  // ADMIN, OWNER ou MANAGER da empresa dona da marca editam (a API confere de novo)
  const canManage =
    user.systemRole === 'ADMIN' ||
    brand.company.userCompanies.some(
      (uc) => uc.companyRole === 'OWNER' || uc.companyRole === 'MANAGER',
    );
  if (!canManage) redirect('/user-panel/brands');

  const members = brand.userBrands.map((ub) => ({
    userId: ub.userCompany.user.id,
    firstName: ub.userCompany.user.firstName,
    lastName: ub.userCompany.user.lastName,
    userName: ub.userCompany.user.userName,
    email: ub.userCompany.user.email,
    brandRole: ub.brandRole,
  }));

  return (
    <BrandForm
      mode="edit"
      brand={{
        id: brand.id,
        name: brand.name,
        description: brand.description,
        logoUrl: brand.imgUrl,
        isActive: brand.isActive,
      }}
    >
      <BrandUsers brandId={brand.id} brandName={brand.name} members={members} />
    </BrandForm>
  );
}