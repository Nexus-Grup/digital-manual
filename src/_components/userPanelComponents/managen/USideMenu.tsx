// components/SideMenu/SideMenu.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Tags, Package, Building2, Users, LayoutDashboard, LogOut, Bell, Logs, Headset, type LucideIcon, } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/USideMenu.module.css";

type SystemRole = "USER" | "ADMIN"; // mesmos valores do seu enum SystemRole
type CompanyRole = "OWNER" | "MANAGER" | "MEMBER"; // mesmos valores do seu enum CompanyRole

interface MenuItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: SystemRole[]; // papel no sistema que pode ver
  companyRoles?: CompanyRole[]; // papel em ALGUMA empresa que pode ver
  // sem "roles" e sem "companyRoles" = todo usuário vê
  // com os dois = vê quem atender a um OU ao outro
}
const BASE = "/painel" 

const MENU_GROUPS: MenuItem[][] = [
  [
    { key: "overview", label: "Visão geral da empresa", href: `${BASE}/visao-geral`, icon: Home },
    // same order as the setup flow: the company first, then its brands, then each brand's products
    {
      key: "company", label: "Empresas", href: `${BASE}/empresas`, icon: Building2,
      roles: ["ADMIN"], companyRoles: ["OWNER"], // só admin do sistema e owner de empresa
    },
    {
      key: "brand", label: "Marcas", href: `${BASE}/marcas`, icon: Tags,
      roles: ["ADMIN"], companyRoles: ["OWNER", "MANAGER"], // membro não vê
    },
    { key: "product",  label: "Produtos",   href: `${BASE}/produtos`,    icon: Package },
  ],
  [
    { key: "notifications", label: "Notificações",   href: `${BASE}/notificacoes`,   icon: Bell },
    { key: "support", label: "Suporte",   href: `${BASE}/suporte`,   icon: Headset },
    { key: "manage",        label: "Gerenciar plataforma", href: `${BASE}/gerenciar-plataforma`, icon: Users, roles: ["ADMIN"] },
    { key: "dashboard",     label: "Indicadores",  href: `${BASE}/indicadores`,       icon: LayoutDashboard },
    { key: "logs",          label: "Registros",            href: `${BASE}/registros`,            icon: Logs, roles: ["ADMIN"] },
  ],
];
export function USideMenu({
  role,
  companyRoles = [],
}: {
  role: SystemRole;
  /** papéis do usuário nas empresas dele (ex.: ["OWNER", "MEMBER"]) */
  companyRoles?: CompanyRole[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const canSee = (item: MenuItem) => {
    if (!item.roles && !item.companyRoles) return true;
    const bySystem = item.roles?.includes(role) ?? false;
    const byCompany = item.companyRoles?.some((r) => companyRoles.includes(r)) ?? false;
    return bySystem || byCompany;
  };

  const groups = MENU_GROUPS
    .map((group) => group.filter(canSee))
    .filter((group) => group.length > 0);

  async function handleLogout() {
    // ajuste para o seu sistema de autenticação
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/entrar");
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.groups}>
        {groups.map((group, i) => (
          <div key={i} className={styles.group}>
            {group.map(({ key, label, href, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={key}
                  href={href}
                  className={`${styles.item} ${isActive ? styles.active : ""}`}
                >
                  <Icon size={18} className={styles.icon} />
                  <span className={styles.label}>{label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.item}>
          <LogOut size={18} className={styles.icon} />
          <span className={styles.label}>Sair</span>
        </button>
      </div>
    </nav>
  );
}