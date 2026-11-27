"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { TicketStatus } from "@prisma/client";
import { SUPPORT_BASE } from "@/lib/support/constants";
import { resolveTicket } from "@/lib/support/client";
import styles from "@/_styles/cssUserPanelPage/support/TicketActionsMenu.module.css";

export function TicketActionsMenu({ ticketId, status }: { ticketId: number; status: TicketStatus }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const canResolve = status !== "RESOLVED" && status !== "CLOSED";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function resolve() {
    setBusy(true);
    const res = await resolveTicket(ticketId);
    setBusy(false);
    setOpen(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Chamado marcado como resolvido");
    router.refresh();
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={`Ações do chamado #${ticketId}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          <Link href={`${SUPPORT_BASE}/${ticketId}`} className={styles.item} role="menuitem">
            View ticket
          </Link>
          {canResolve && (
            <button type="button" className={styles.item} role="menuitem" disabled={busy} onClick={resolve}>
              Marcar como resolvido
            </button>
          )}
        </div>
      )}
    </div>
  );
}
