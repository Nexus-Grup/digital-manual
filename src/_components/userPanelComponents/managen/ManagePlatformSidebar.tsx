"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Building2,
  Tag,
  Package,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/ManagePlatformSidebar.module.css";

const BASE = "/painel";
const MANAGE = `${BASE}/gerenciar-plataforma`;

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Usuários", href: `${MANAGE}/usuarios`, icon: User },
  { label: "Empresas", href: `${MANAGE}/empresas`, icon: Building2 },
  { label: "Marcas", href: `${MANAGE}/marcas`, icon: Tag },
  { label: "Produtos", href: `${MANAGE}/produtos`, icon: Package },
  { label: "Relatórios", href: `${MANAGE}/reports`, icon: FileBarChart },
];

export function ManagePlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href={MANAGE}><header className={styles.header}>Gerenciar plataforma</header></Link>
    
      <nav className={styles.nav} aria-label="Gerenciar plataforma">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

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
