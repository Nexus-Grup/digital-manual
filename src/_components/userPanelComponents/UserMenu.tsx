// _components/userPanelComponents/UserMenu.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, Bell, LogOut, ChevronRight } from "lucide-react";
import { useDropdown } from "./useDropdown";
import styles from "@/_styles/cssUserPanelPage/UserMenu.module.css";

const BASE = "/user-panel";

interface UserMenuProps {
  name: string;
  email: string;
}

export default function UserMenu({ name, email }: UserMenuProps) {
  const { open, setOpen, ref } = useDropdown();
  const router = useRouter();

  async function handleLogout() {
    // ajuste para o seu sistema de autenticação
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const links = [
    { label: "My Profile",   href: `${BASE}/profile`,       icon: User },
    { label: "Settings",     href: `${BASE}/settings`,      icon: Settings },
    { label: "Notification", href: `${BASE}/notifications`, icon: Bell },
  ];

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.avatarBtn} onClick={() => setOpen(!open)} aria-label="Menu do usuário">
        <User size={20} />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.profile}>
            <span className={styles.avatarLg}><User size={28} /></span>
            <div>
              <p className={styles.name}>{name}</p>
              <p className={styles.email}>{email}</p>
            </div>
          </div>

          {links.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className={styles.row} onClick={() => setOpen(false)}>
              <Icon size={18} />
              <span className={styles.rowLabel}>{label}</span>
              <ChevronRight size={16} className={styles.chevron} />
            </Link>
          ))}

          <button className={styles.row} onClick={handleLogout}>
            <LogOut size={18} />
            <span className={styles.rowLabel}>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}