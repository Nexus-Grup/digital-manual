import type { TicketStatus } from "@prisma/client";
import { STATUS_LABEL, STATUS_LABEL_ADMIN, STATUS_TONE } from "@/lib/support/constants";
import styles from "@/_styles/cssUserPanelPage/support/StatusBadge.module.css";

// audience="admin" troca "Awaiting your reply" por "Awaiting user".
export function StatusBadge({ status, audience = "user" }: { status: TicketStatus; audience?: "user" | "admin" }) {
  const label = (audience === "admin" ? STATUS_LABEL_ADMIN : STATUS_LABEL)[status];
  return <span className={`${styles.badge} ${styles[STATUS_TONE[status]]}`}>{label}</span>;
}
