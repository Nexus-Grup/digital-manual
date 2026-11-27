"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { TicketPriority, TicketStatus } from "@prisma/client";
import { updateTicketAdmin } from "@/lib/support/adminClient";
import { PRIORITY_OPTIONS, STATUS_OPTIONS_ADMIN } from "@/lib/support/constants";
import page from "@/_styles/cssUserPanelPage/support/supportPage.module.css";
import styles from "@/_styles/cssUserPanelPage/support/AdminTicket.module.css";

type Props = {
  ticketId: number;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeName: string | null;
};

export function ManageCard({ ticketId, status, priority, assigneeName }: Props) {
  const router = useRouter();
  const [s, setS] = useState(status);
  const [p, setP] = useState(priority);
  const [busy, setBusy] = useState(false);

  async function save(payload: { status?: TicketStatus; priority?: TicketPriority }) {
    setBusy(true);
    const res = await updateTicketAdmin(ticketId, payload);
    setBusy(false);
    if (!res.ok) {
      setS(status);
      setP(priority);
      return toast.error(res.error);
    }
    toast.success("Chamado atualizado");
    router.refresh();
  }

  return (
    <aside className={page.card}>
      <h2 className={page.cardTitle}>Gerenciar</h2>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="manage-status">Status</label>
        <select
          id="manage-status"
          className={styles.select}
          value={s}
          disabled={busy}
          onChange={(e) => {
            const v = e.target.value as TicketStatus;
            setS(v);
            void save({ status: v });
          }}
        >
          {STATUS_OPTIONS_ADMIN.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="manage-priority">Prioridade</label>
        <select
          id="manage-priority"
          className={styles.select}
          value={p}
          disabled={busy}
          onChange={(e) => {
            const v = e.target.value as TicketPriority;
            setP(v);
            void save({ priority: v });
          }}
        >
          {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Responsável</span>
        <p className={styles.value}>{assigneeName ?? "Sem responsável"}</p>
        {!assigneeName && <p className={styles.hint}>O primeiro admin a responder assume este chamado.</p>}
      </div>
    </aside>
  );
}
