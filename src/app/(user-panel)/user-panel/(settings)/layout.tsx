import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { SettingsSidebar } from "@/_components/userPanelComponents/SettingsSidebar";
export const instant = false;
export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isAdmin = user.systemRole === "ADMIN";

  const [companyRows, brandRows] = await Promise.all([
    // ADMIN vê todas as empresas; os demais só as que são OWNER
    isAdmin
      ? prisma.company.findMany({
          where: { isActive: true },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : prisma.userCompany
          .findMany({
            where: {
              userId: user.id,
              companyRole: "OWNER",
              company: { isActive: true },
            },
            select: { company: { select: { id: true, name: true } } },
            orderBy: { company: { name: "asc" } },
          })
          .then((rows) => rows.map((r) => r.company)),
    // Marcas ligadas ao usuário (UserBrand -> UserCompany -> User)
    prisma.brand.findMany({
      where: {
        isActive: true,
        userBrands: { some: { userCompany: { userId: user.id } } },
      },
      select: {
        id: true,
        name: true,
        userBrands: {
          where: { userCompany: { userId: user.id } },
          select: { brandRole: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  // Tudo que está na lista de empresas já é editável (ADMIN ou OWNER)
  const companies = companyRows.map((c) => ({
    id: c.id,
    name: c.name,
    canEdit: true,
  }));

  const brands = brandRows.map((b) => ({
    id: b.id,
    name: b.name,
    canEdit: b.userBrands.some((ub) => ub.brandRole === "EDITOR"),
  }));

  // Membro comum não vê a área de empresas
  const showCompanies = isAdmin || companies.length > 0;

  return (
    <main className="container-global-page">
      <div className="container-stage">
        <SettingsSidebar
          companies={companies}
          brands={brands}
          showCompanies={showCompanies}
        />
        {children}
      </div>
    </main>
  );
}