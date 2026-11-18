// components/SideMenu/SideMenu.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Tags, Package, Building2, Users, LayoutDashboard, LogOut, Bell, Logs, type LucideIcon, } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/USideMenu.module.css";

type SystemRole = "USER" | "ADMIN"; // mesmos valores do seu enum SystemRole

interface MenuItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: SystemRole[]; // sem "roles" = todo usuário vê
}
const BASE = "/user-panel" 

const MENU_GROUPS: MenuItem[][] = [
  [
    { key: "overview", label: "Company Overview", href: `${BASE}/company-overview`, icon: Home },
    { key: "brand",    label: "Brand Editor",     href: `${BASE}/brands`,      icon: Tags },
    { key: "product",  label: "Product Editor",   href: `${BASE}/products`,    icon: Package },
    { key: "company",  label: "Company Editor",   href: `${BASE}/companies`,   icon: Building2 },
  ],
  [
    { key: "notifications", label: "Notifications",   href: `${BASE}/notifications`,   icon: Bell },
    { key: "manage",        label: "Manage Platform", href: `${BASE}/manage-platform`, icon: Users, roles: ["ADMIN"] },
    { key: "dashboard",     label: "Dashboard",       href: `${BASE}/dashboard`,       icon: LayoutDashboard },
    { key: "logs",          label: "Logs",            href: `${BASE}/logs`,            icon: Logs, roles: ["ADMIN"] },
  ],
];
export function USideMenu({ role }: { role: SystemRole }) {
  const pathname = usePathname();
  const router = useRouter();

  const groups = MENU_GROUPS
    .map((group) => group.filter((item) => !item.roles || item.roles.includes(role)))
    .filter((group) => group.length > 0);

  async function handleLogout() {
    // ajuste para o seu sistema de autenticação
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
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