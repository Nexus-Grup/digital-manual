import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BrandForm } from '@/_components/userPanelComponents/brands/BrandForm';
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nova marca" };

export const instant = false;

export default async function NewBrandPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/entrar');

  // ADMIN vê todas as empresas; os demais, só onde são OWNER ou MANAGER
  // (a API confere de novo ao salvar)
  const companies =
    user.systemRole === 'ADMIN'
      ? await prisma.company.findMany({
          where: { isActive: true },
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        })
      : (
          await prisma.userCompany.findMany({
            where: {
              userId: user.id,
              companyRole: { in: ['OWNER', 'MANAGER'] },
              company: { isActive: true },
            },
            select: { company: { select: { id: true, name: true } } },
            orderBy: { company: { name: 'asc' } },
          })
        ).map((r) => r.company);

  if (companies.length === 0) {
    return <p>Você precisa ser proprietário ou gerente de uma empresa para criar uma marca.</p>;
  }

  return <BrandForm mode="create" companies={companies} defaultCompanyId={companies[0].id} />;
}