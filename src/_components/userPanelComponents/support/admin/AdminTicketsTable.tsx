import Link from "next/link";
import { ADMIN_SUPPORT_BASE } from "@/lib/support/constants";
import type { AdminTicketListItem } from "@/lib/support/types";
import { PriorityBadge } from "@/_components/userPanelComponents/support/user/PriorityBadge";
import { StatusBadge } from "@/_components/userPanelComponents/support/user/StatusBadge";
import { TimeText } from "@/_components/userPanelComponents/support/user/TimeText";
import { AdminTicketActionsMenu } from "./AdminTicketActionsMenu";
import styles from "@/_styles/cssUserPanelPage/support/AdminInbox.module.css";

export function AdminTicketsTable({ items }: { items: AdminTicketListItem[] }) {
  if (items.length === 0) return <p className={styles.empty}>No tickets match these filters.</p>;
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Subject</th>
            <th scope="col">Requester</th>
            <th scope="col">Related to</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col">Assignee</th>
            <th scope="col">Updated</th>
            <th scope="col">Action</th>
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
              <td className={t.assigneeName ? undefined : styles.muted}>{t.assigneeName ?? "Unassigned"}</td>
              <td className={styles.muted}><TimeText iso={t.lastMessageAt} relative /></td>
              <td><AdminTicketActionsMenu ticketId={t.id} status={t.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
