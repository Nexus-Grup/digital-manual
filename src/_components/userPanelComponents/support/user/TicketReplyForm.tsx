"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { TicketStatus } from "@prisma/client";
import { sendReply } from "@/lib/support/client";
import { LIMITS } from "@/lib/support/constants";
import type { UploadedFile } from "@/lib/support/types";
import { AttachmentPicker } from "./AttachmentPicker";
import styles from "@/_styles/cssUserPanelPage/support/TicketReplyForm.module.css";

export function TicketReplyForm({ ticketId, status }: { ticketId: number; status: TicketStatus }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  if (status === "CLOSED")
    return <p className={styles.closed}>Este chamado está fechado. Abra um novo chamado se ainda precisar de ajuda.</p>;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!body.trim()) return setError("Escreva uma mensagem primeiro.");
    setBusy(true);
    const res = await sendReply(ticketId, body, files);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setBody("");
    setFiles([]);
    toast.success("Resposta enviada");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.label} htmlFor="ticket-reply">Sua resposta</label>
      <textarea
        id="ticket-reply"
        className={styles.textarea}
        value={body}
        maxLength={LIMITS.bodyMax}
        placeholder="Escreva uma mensagem"
        onChange={(e) => setBody(e.target.value)}
      />
      {status === "RESOLVED" && <p className={styles.hint}>Responder vai reabrir este chamado.</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.actions}>
        <AttachmentPicker files={files} onChange={setFiles} onBusyChange={setUploading} />
        <button type="submit" className={styles.primary} disabled={busy || uploading}>
          {busy ? "Enviando..." : "Enviar resposta"}
        </button>
      </div>
    </form>
  );
}
