"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Building2,
  Tag,
  Package,
  type LucideIcon,
} from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/ManagePlatformSidebar.module.css";

const BASE = "/painel";
const MANAGE = `${BASE}/gerenciar-plataforma`;

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** active only on this exact path (the overview is the parent of the other sections) */
  exact?: boolean;
};

// Only pages that exist: companies, brands and products are managed in their own panel pages
// (the admin sees all of them there). "Relatórios" comes back when its page exists.
const NAV_ITEMS: NavItem[] = [
  { label: "Visão geral", href: MANAGE, icon: LayoutDashboard, exact: true },
  { label: "Usuários", href: `${MANAGE}/usuarios`, icon: User },
  { label: "Empresas", href: `${BASE}/empresas`, icon: Building2 },
  { label: "Marcas", href: `${BASE}/marcas`, icon: Tag },
  { label: "Produtos", href: `${BASE}/produtos`, icon: Package },
];

export function ManagePlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* the area title (a link inside a header, not a header inside a link) */}
      <header className={styles.header}>
        <Link href={MANAGE} className={styles.headerLink}>Gerenciar plataforma</Link>
      </header>

      <nav className={styles.nav} aria-label="Gerenciar plataforma">
        {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
          const isActive = pathname === href || (!exact && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              className={`${styles.item} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={16} strokeWidth={2} aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
