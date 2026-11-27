import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/support/format";
import styles from "@/_styles/cssUserPanelPage/NotificationsPage.module.css";
import { MarkAllReadButton } from "@/_components/userPanelComponents/utils_panel/MarkAllReadButton";

export const metadata: Metadata = { title: "Notificações" };

export const instant = false;

const HISTORY = 50;

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: HISTORY,
    select: { id: true, title: true, message: true, read: true, createdAt: true, data: true },
  });
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <main id="conteudo" className={styles["notifications"]}>
      <div className={styles["notifications__container"]}>
        <header className={styles["notifications__header"]}>
          <div className={styles["notifications__heading"]}>
            <h1 className={styles["notifications__title"]}>Notificações</h1>
            <p className={styles["notifications__summary"]} aria-live="polite">
              {unread === 0 ? "Tudo lido." : `${unread} não ${unread === 1 ? "lida" : "lidas"}.`}
            </p>
          </div>
          {unread > 0 && <MarkAllReadButton className={styles["notifications__mark-all"]} />}
        </header>

        {notifications.length === 0 ? (
          <div className={styles["notifications__empty"]}>
            <Bell size={28} aria-hidden="true" />
            <p className={styles["notifications__empty-text"]}>
              Você ainda não tem notificações. Elas aparecem aqui quando, por exemplo, o suporte responde um chamado seu.
            </p>
          </div>
        ) : (
          <ol className={styles["notifications__list"]}>
            {notifications.map((n) => {
              const url = (n.data as { url?: string } | null)?.url;
              const body = (
                <>
                  <span className={styles["notifications__item-heading"]}>
                    {!n.read && <span className={styles["notifications__dot"]} aria-hidden="true" />}
                    <span className={styles["notifications__item-title"]}>{n.title}</span>
                    {!n.read && <span className={styles["notifications__sr-only"]}>(não lida)</span>}
                  </span>
                  <span className={styles["notifications__item-text"]}>{n.message}</span>
                  <time className={styles["notifications__item-date"]} dateTime={n.createdAt.toISOString()}>
                    {formatDateTime(n.createdAt.toISOString())}
                  </time>
                </>
              );
              return (
                <li
                  key={n.id}
                  className={`${styles["notifications__item"]} ${n.read ? "" : styles["notifications__item--unread"]}`}
                >
                  {url ? <Link className={styles["notifications__item-link"]} href={url}>{body}</Link> : body}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </main>
  );
}
