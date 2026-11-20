import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  SettingsSidebar,
  type BrandCompany,
} from "@/_components/userPanelComponents/SettingsSidebar";

export const instant = false;

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isAdmin = user.systemRole === "ADMIN";

  const [companyRows, brandRows, brandCompanies] = await Promise.all([
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

    // Marcas: ADMIN vê todas; OWNER e MANAGER veem todas da empresa; MEMBER vê apenas as vinculadas em userBrands
    prisma.brand.findMany({
      where: {
        isActive: true,
        ...(isAdmin
          ? {}
          : {
              OR: [
                {
                  company: {
                    userCompanies: {
                      some: {
                        userId: user.id,
                        companyRole: { in: ["OWNER", "MANAGER"] },
                      },
                    },
                  },
                },
                { userBrands: { some: { userCompany: { userId: user.id } } } },
              ],
            }),
      },
      select: {
        id: true,
        name: true,
        companyId: true,
        company: {
          select: {
            userCompanies: {
              where: { userId: user.id },
              select: { companyRole: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),

    // Todas as empresas de que o usuário faz parte (lista do Brand Editor)
    isAdmin
      ? prisma.company
          .findMany({
            where: { isActive: true },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
          })
          .then((rows): BrandCompany[] =>
            rows.map((c) => ({ ...c, role: "ADMIN", canCreateBrand: true }))
          )
      : prisma.userCompany
          .findMany({
            where: { userId: user.id, company: { isActive: true } },
            select: {
              companyRole: true,
              company: { select: { id: true, name: true } },
            },
            orderBy: { company: { name: "asc" } },
          })
          .then((rows): BrandCompany[] =>
            rows.map((r) => ({
              id: r.company.id,
              name: r.company.name,
              role: r.companyRole,
              canCreateBrand: r.companyRole === "OWNER", // manager e member não criam marca
            }))
          ),
  ]);

  // Tudo que está na lista de empresas já é editável (ADMIN ou OWNER)
  const companies = companyRows.map((c) => ({
    id: c.id,
    name: c.name,
    canEdit: true,
  }));

  // ADMIN, OWNER e MANAGER podem editar as marcas
  const brands = brandRows.map((b) => ({
    id: b.id,
    name: b.name,
    companyId: b.companyId,
    canEdit:
      isAdmin ||
      b.company.userCompanies.some(
        (uc) => uc.companyRole === "OWNER" || uc.companyRole === "MANAGER"
      ),
  }));

  // Membro comum e Manager não veem a área de administração de empresas
  const showCompanies = isAdmin || companies.length > 0;

  // Quem é só MEMBER não vê o Brand Editor
  const showBrands =
    isAdmin ||
    brandCompanies.some((c) => c.role === "OWNER" || c.role === "MANAGER");

  return (
    <main className="container-global-page">
      <div className="container-stage">
        <SettingsSidebar
          companies={companies}
          brands={brands}
          brandCompanies={brandCompanies}
          showCompanies={showCompanies}
          showBrands={showBrands}
        />
        <div className="container-stage-section">
          {children}
        </div>
        
      </div>
    </main>
  );
}