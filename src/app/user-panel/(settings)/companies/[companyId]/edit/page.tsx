import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canManageCompany } from "@/lib/companyAccess";
import { CompanyForm } from "@/_components/userPanelComponents/CompanyForm";
import { CompanyUsers } from "@/_components/userPanelComponents/CompanyUsers";
import styles from "@/_styles/cssUserPanelPage/EditCompanies.module.css"

export const instant = false; // mesmo padrão do seu layout

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const companyId = Number((await params).companyId);
  if (!Number.isInteger(companyId) || companyId <= 0) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // 1) Permissão primeiro (query leve). Não-owner vê 404.
  if (!(await canManageCompany(user, companyId))) notFound();

  // 2) Só então os dados completos
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      name: true,
      description: true,
      website: true,
      logoUrl: true,
      isActive: true,
      userCompanies: {
        select: {
          companyRole: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              userName: true,
              email: true,
            },
          },
        },
        orderBy: { user: { firstName: "asc" } },
      },
    },
  });
  if (!company) notFound();

  const members = company.userCompanies.map((m) => ({
    userId: m.user.id,
    firstName: m.user.firstName,
    lastName: m.user.lastName,
    userName: m.user.userName,
    email: m.user.email,
    companyRole: m.companyRole,
  }));

  return (

      <CompanyForm
        mode="edit"
        company={{
          id: company.id,
          name: company.name,
          description: company.description,
          website: company.website,
          logoUrl: company.logoUrl,
          isActive: company.isActive,
        }}
      >
        <CompanyUsers
          companyId={company.id}
          companyName={company.name}
          currentUserId={user.id}
          members={members}
        />
      </CompanyForm>      


  );
}