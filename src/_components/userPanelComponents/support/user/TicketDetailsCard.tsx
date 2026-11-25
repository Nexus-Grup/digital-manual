import { CATEGORY_LABEL, PRIORITY_LABEL, SUPPORT_TEAM_LABEL } from "@/lib/support/constants";
import { formatDate } from "@/lib/support/format";
import type { TicketDetailView } from "@/lib/support/types";
import page from "@/_styles/cssUserPanelPage/support/supportPage.module.css";
import styles from "@/_styles/cssUserPanelPage/support/TicketDetailsCard.module.css";
import { ResolveTicketButton } from "./ResolveTicketButton";

export function TicketDetailsCard({ ticket }: { ticket: TicketDetailView }) {
  const canResolve = ticket.status !== "RESOLVED" && ticket.status !== "CLOSED";
  return (
    <aside className={page.card}>
      <h2 className={page.cardTitle}>Details</h2>
      <dl className={styles.list}>
        <div><dt>Priority</dt><dd>{PRIORITY_LABEL[ticket.priority]}</dd></div>
        <div><dt>Category</dt><dd>{CATEGORY_LABEL[ticket.category]}</dd></div>
        <div><dt>{ticket.related.kind === "General" ? "Related to" : ticket.related.kind}</dt><dd>{ticket.related.name}</dd></div>
        <div><dt>Assignee</dt><dd>{ticket.hasAssignee ? SUPPORT_TEAM_LABEL : "Waiting for the team"}</dd></div>
        <div><dt>Opened on</dt><dd>{formatDate(ticket.createdAt)}</dd></div>
      </dl>
      {canResolve && <ResolveTicketButton ticketId={ticket.id} />}
    </aside>
  );
}
