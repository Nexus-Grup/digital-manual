import { CATEGORY_LABEL } from "@/lib/support/constants";
import { formatDate } from "@/lib/support/format";
import type { AdminTicketDetailView } from "@/lib/support/types";
import page from "@/_styles/cssUserPanelPage/support/supportPage.module.css";
import styles from "@/_styles/cssUserPanelPage/support/AdminTicket.module.css";

export function AdminDetailsCard({ ticket }: { ticket: AdminTicketDetailView }) {
  return (
    <aside className={page.card}>
      <h2 className={page.cardTitle}>Details</h2>
      <dl className={styles.list}>
        <div>
          <dt>Requester</dt>
          <dd>
            {ticket.requester.name}
            <span className={styles.sub}>{ticket.requester.email}</span>
          </dd>
        </div>
        {ticket.product && <div><dt>Product</dt><dd>{ticket.product}</dd></div>}
        {ticket.brand && <div><dt>Brand</dt><dd>{ticket.brand}</dd></div>}
        {ticket.company && <div><dt>Company</dt><dd>{ticket.company}</dd></div>}
        <div><dt>Category</dt><dd>{CATEGORY_LABEL[ticket.category]}</dd></div>
        <div><dt>Opened on</dt><dd>{formatDate(ticket.createdAt)}</dd></div>
      </dl>
    </aside>
  );
}
