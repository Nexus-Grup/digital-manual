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

const BASE = "/user-panel";
const MANAGE = `${BASE}/manage-platform`;

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Users", href: `${MANAGE}/users`, icon: User },
  { label: "Companies", href: `${MANAGE}/companies`, icon: Building2 },
  { label: "Brands", href: `${MANAGE}/brands`, icon: Tag },
  { label: "Products", href: `${MANAGE}/products`, icon: Package },
  { label: "Reports", href: `${MANAGE}/reports`, icon: FileBarChart },
];

export function ManagePlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href={MANAGE}><header className={styles.header}>Manage Platform</header></Link>
    
      <nav className={styles.nav} aria-label="Manage Platform">
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
