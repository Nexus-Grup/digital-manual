import Link from "next/link";
import { ADMIN_SUPPORT_BASE } from "@/lib/support/constants";
import type { AdminTicketListItem } from "@/lib/support/types";
import { PriorityBadge } from "@/_components/userPanelComponents/support/user/PriorityBadge";
import { StatusBadge } from "@/_components/userPanelComponents/support/user/StatusBadge";
import { TimeText } from "@/_components/userPanelComponents/support/user/TimeText";
import { AdminTicketActionsMenu } from "./AdminTicketActionsMenu";
import styles from "@/_styles/cssUserPanelPage/support/AdminInbox.module.css";

export function AdminTicketsTable({ items }: { items: AdminTicketListItem[] }) {
  if (items.length === 0) return <p className={styles.empty}>Nenhum chamado corresponde a estes filtros.</p>;
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Assunto</th>
            <th scope="col">Solicitante</th>
            <th scope="col">Relacionado a</th>
            <th scope="col">Prioridade</th>
            <th scope="col">Status</th>
            <th scope="col">Responsável</th>
            <th scope="col">Atualizado</th>
            <th scope="col">Ação</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id}>
              <td>#{t.id}</td>
              <td>
                <Link href={`${ADMIN_SUPPORT_BASE}/${t.id}`} className={styles.subject}>{t.title}</Link>
              </td>
              <td>{t.requesterName}</td>
              <td>
                {t.related.name}
                <span className={styles.kind}>{t.related.kind}</span>
              </td>
              <td><PriorityBadge priority={t.priority} /></td>
              <td><StatusBadge status={t.status} audience="admin" /></td>
              <td className={t.assigneeName ? undefined : styles.muted}>{t.assigneeName ?? "Sem responsável"}</td>
              <td className={styles.muted}><TimeText iso={t.lastMessageAt} relative /></td>
              <td><AdminTicketActionsMenu ticketId={t.id} status={t.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
