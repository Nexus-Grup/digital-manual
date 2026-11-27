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
      <h2 className={page.cardTitle}>Detalhes</h2>
      <dl className={styles.list}>
        <div><dt>Prioridade</dt><dd>{PRIORITY_LABEL[ticket.priority]}</dd></div>
        <div><dt>Categoria</dt><dd>{CATEGORY_LABEL[ticket.category]}</dd></div>
        <div><dt>{ticket.related.kind === "Geral" ? "Relacionado a" : ticket.related.kind}</dt><dd>{ticket.related.name}</dd></div>
        <div><dt>Responsável</dt><dd>{ticket.hasAssignee ? SUPPORT_TEAM_LABEL : "Aguardando a equipe"}</dd></div>
        <div><dt>Aberto em</dt><dd>{formatDate(ticket.createdAt)}</dd></div>
      </dl>
      {canResolve && <ResolveTicketButton ticketId={ticket.id} />}
    </aside>
  );
}
