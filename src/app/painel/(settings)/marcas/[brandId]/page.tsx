import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const instant = false;

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brandId: string }>;
}) {
  const brandId = Number((await params).brandId);
  if (!Number.isInteger(brandId) || brandId <= 0) notFound();

  const user = await getCurrentUser();
  if (!user) redirect('/entrar');
  if (user.systemRole === 'ADMIN') redirect(`/painel/marcas/${brandId}/editar`);

  // Busca a brand e verifica o vínculo do usuário na empresa (OWNER/MANAGER) e na própria brand (EDITOR/VIEWER)
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    select: {
      name: true,
      description: true,
      imgUrl: true,
      company: {
        select: {
          userCompanies: {
            where: { userId: user.id },
            select: {
              companyRole: true,
              userBrands: {
                where: { brandId },
                select: { brandRole: true },
              },
            },
          },
        },
      },
    },
  });

  const userCompany = brand?.company.userCompanies[0];
  if (!brand || !userCompany) notFound();

  // OWNER e MANAGER da empresa sempre podem editar qualquer brand
  if (userCompany.companyRole === 'OWNER' || userCompany.companyRole === 'MANAGER') {
    redirect(`/painel/marcas/${brandId}/editar`);
  }

  // Se for MEMBER na empresa, precisa estar vinculado especificamente à brand
  const brandMembership = userCompany.userBrands[0];
  if (!brandMembership) notFound();

  // Se for EDITOR na brand, também vai para a tela de edição
  if (brandMembership.brandRole === 'EDITOR') {
    redirect(`/painel/marcas/${brandId}/editar`);
  }

  // Caso contrário (VIEWER), exibe apenas a visualização
  return (
    <section style={{ margin: '0 auto', width: 'min(600px, 100%)' }}>
      {brand.imgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={brand.imgUrl} alt="" style={{ maxHeight: 56, marginBottom: 12 }} />
      )}
      <h1>{brand.name}</h1>
      {brand.description && <p>{brand.description}</p>}
    </section>
  );
}
