"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { resolveTicket } from "@/lib/support/client";
import styles from "@/_styles/cssUserPanelPage/support/TicketDetailsCard.module.css";

export function ResolveTicketButton({ ticketId }: { ticketId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    const res = await resolveTicket(ticketId);
    setBusy(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Chamado marcado como resolvido");
    router.refresh();
  }

  return (
    <button type="button" className={styles.resolve} disabled={busy} onClick={onClick}>
      {busy ? "Salvando..." : "Marcar como resolvido"}
    </button>
  );
}
