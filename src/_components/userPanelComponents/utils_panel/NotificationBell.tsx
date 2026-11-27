"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useDropdown } from "./useDropdown";
import styles from "@/_styles/cssUserPanelPage/NotificationBell.module.css";

const BASE = "/painel";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
  data?: { url?: string } | null;
}

interface NotificationBellProps {
  notifications: NotificationItem[]; // as últimas (ex: 8)
  unreadCount: number;
}

export default function NotificationBell({ notifications, unreadCount }: NotificationBellProps) {
  const { open, setOpen, ref } = useDropdown();
  const router = useRouter();

  async function handleClick(n: NotificationItem) {
    setOpen(false);
    if (!n.read) {
      await fetch(`/api/notifications/${n.id}/read`, { method: "PATCH" });
      router.refresh(); // recarrega contagem e lista
    }
    if (n.data?.url) router.push(n.data.url);
  }

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "PATCH" });
    router.refresh();
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.iconBtn} onClick={() => setOpen(!open)} aria-label="Notificações">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <strong>Notificações</strong>
            {unreadCount > 0 && (
              <button className={styles.linkBtn} onClick={markAllRead}>
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <p className={styles.empty}>Nenhuma notificação</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  className={`${styles.item} ${n.read ? "" : styles.unread}`}
                  onClick={() => handleClick(n)}
                >
                  <span className={styles.title}>{n.title}</span>
                  <span className={styles.msg}>{n.message}</span>
                  <span className={styles.date}>
                    {new Date(n.createdAt).toLocaleString("pt-BR", {
                      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </button>
              ))
            )}
          </div>

          <Link href={`${BASE}/notificacoes`} className={styles.seeAll} onClick={() => setOpen(false)}>
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
}