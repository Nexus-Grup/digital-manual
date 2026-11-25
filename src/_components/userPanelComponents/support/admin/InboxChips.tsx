import Link from "next/link";
import { ADMIN_SUPPORT_BASE, ADMIN_VIEWS, type AdminView } from "@/lib/support/constants";
import { withParams } from "@/lib/support/url";
import styles from "@/_styles/cssUserPanelPage/support/AdminInbox.module.css";

type Props = {
  view: AdminView;
  counts: Record<AdminView, number>;
  current: Record<string, string | undefined>;
};

export function InboxChips({ view, counts, current }: Props) {
  return (
    <nav className={styles.chips} aria-label="Ticket views">
      {ADMIN_VIEWS.map((v) => (
        <Link
          key={v.key}
          href={withParams(ADMIN_SUPPORT_BASE, current, { view: v.key === "all" ? undefined : v.key, page: undefined })}
          aria-current={view === v.key ? "page" : undefined}
          className={`${styles.chip} ${view === v.key ? styles.active : ""}`}
        >
          {v.label} ({counts[v.key]})
        </Link>
      ))}
    </nav>
  );
}
