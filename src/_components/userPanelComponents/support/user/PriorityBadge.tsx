import type { TicketPriority } from "@prisma/client";
import { PRIORITY_LABEL, PRIORITY_TONE } from "@/lib/support/constants";
import styles from "@/_styles/cssUserPanelPage/support/StatusBadge.module.css";

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={`${styles.badge} ${styles[PRIORITY_TONE[priority]]}`}>{PRIORITY_LABEL[priority]}</span>;
}
