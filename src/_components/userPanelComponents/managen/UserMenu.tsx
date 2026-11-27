// _components/userPanelComponents/UserMenu.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUserRound, User, Settings, Bell, LogOut, ChevronRight } from "lucide-react";
import { useDropdown } from "../utils_panel/useDropdown";
import styles from "@/_styles/cssUserPanelPage/UserMenu.module.css";

const BASE = "/painel";

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
    router.push("/entrar");
  }

  const links = [
    { label: "Meu perfil",   href: `${BASE}/perfil`,       icon: User },
    { label: "Configurações",     href: `${BASE}/configuracoes`,      icon: Settings },
    { label: "Notificações", href: `${BASE}/notificacoes`, icon: Bell },
  ];

  return (
    <div className={styles.wrapper} ref={ref}>
      {/* same look as the landing page's account button (44px outlined square, CircleUserRound) */}
      <button
        type="button"
        className={styles.avatarBtn}
        onClick={() => setOpen(!open)}
        aria-label={`Menu da conta de ${name}`}
        title="Minha conta"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <CircleUserRound size={22} strokeWidth={1.75} aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.profile}>
            <span className={styles.avatarLg}><CircleUserRound size={28} strokeWidth={1.75} aria-hidden="true" /></span>
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
            <span className={styles.rowLabel}>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}