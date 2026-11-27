import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const instant = false;

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const companyId = Number((await params).companyId);
  if (!Number.isInteger(companyId) || companyId <= 0) notFound();

  const user = await getCurrentUser();
  if (!user) redirect('/entrar');
  if (user.systemRole === 'ADMIN') redirect(`/painel/empresas/${companyId}/editar`);

  const membership = await prisma.userCompany.findUnique({
    where: { userId_companyId: { userId: user.id, companyId } },
    select: {
      companyRole: true,
      company: { select: { name: true, description: true, website: true, logoUrl: true } },
    },
  });
  if (!membership) notFound();
  if (membership.companyRole === 'OWNER') redirect(`/painel/empresas/${companyId}/editar`);

  const { company } = membership;
  return (
    <section style={{ margin: '0 auto', width: 'min(600px, 100%)' }}>
      {company.logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={company.logoUrl} alt="" style={{ maxHeight: 56, marginBottom: 12 }} />
      )}
      <h1>{company.name}</h1>
      {company.description && <p>{company.description}</p>}
      {company.website && (
        <p>
          <a href={company.website} target="_blank" rel="noopener noreferrer">
            {company.website}
          </a>
        </p>
      )}
    </section>
  );
}