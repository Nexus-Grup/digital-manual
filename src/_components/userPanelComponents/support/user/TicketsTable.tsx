"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FILTERS, SUPPORT_BASE } from "@/lib/support/constants";
import type { TicketListItem } from "@/lib/support/types";
import { StatusBadge } from "./StatusBadge";
import { TicketActionsMenu } from "./TicketActionsMenu";
import { TimeText } from "./TimeText";
import styles from "@/_styles/cssUserPanelPage/support/TicketsTable.module.css";

export function TicketsTable({ tickets }: { tickets: TicketListItem[] }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const statuses = FILTERS.find((f) => f.key === filter)?.statuses ?? null;
    const q = query.trim().toLowerCase().replace("#", "");
    return tickets.filter(
      (t) =>
        (!statuses || statuses.includes(t.status)) &&
        (!q ||
          t.title.toLowerCase().includes(q) ||
          String(t.id).includes(q) ||
          t.related.name.toLowerCase().includes(q)),
    );
  }, [tickets, filter, query]);

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              className={`${styles.chip} ${filter === f.key ? styles.active : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {f.key === "all" ? ` (${tickets.length})` : ""}
            </button>
          ))}
        </div>
        <label>
          <span className={styles.srOnly}>Search tickets</span>
          <input
            type="search"
            className={styles.search}
            placeholder="Search tickets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {tickets.length === 0 ? (
        <p className={styles.empty}>You haven&apos;t opened any tickets yet. Use &quot;Open ticket&quot; when you need help.</p>
      ) : (
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">N°</th>
                <th scope="col">Subject</th>
                <th scope="col">Related to</th>
                <th scope="col">Status</th>
                <th scope="col">Updated</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>
                    <Link href={`${SUPPORT_BASE}/${t.id}`} className={styles.subject}>
                      {t.title}
                    </Link>
                  </td>
                  <td>
                    {t.related.name}
                    <span className={styles.kind}>{t.related.kind}</span>
                  </td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td className={styles.muted}>
                    <TimeText iso={t.lastMessageAt} relative />
                  </td>
                  <td>
                    <TicketActionsMenu ticketId={t.id} status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && <p className={styles.empty}>No tickets match your filters.</p>}
        </div>
      )}
    </>
  );
}
