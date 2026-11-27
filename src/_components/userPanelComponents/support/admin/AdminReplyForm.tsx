"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { sendAdminMessage } from "@/lib/support/adminClient";
import { LIMITS } from "@/lib/support/constants";
import type { UploadedFile } from "@/lib/support/types";
import { AttachmentPicker } from "@/_components/userPanelComponents/support/user/AttachmentPicker";
import { ChipGroup } from "@/_components/userPanelComponents/support/user/ChipGroup";
import styles from "@/_styles/cssUserPanelPage/support/AdminTicket.module.css";

type Mode = "public" | "internal";
const MODES: { value: Mode; label: string }[] = [
  { value: "public", label: "Responder ao usuário" },
  { value: "internal", label: "Nota interna" },
];

export function AdminReplyForm({ ticketId, closed }: { ticketId: number; closed: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(closed ? "internal" : "public");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isNote = mode === "internal";

  async function send(resolve: boolean) {
    setError("");
    if (!body.trim()) return setError("Escreva uma mensagem primeiro.");
    setBusy(true);
    const res = await sendAdminMessage(ticketId, {
      body,
      isInternal: isNote,
      resolve: resolve && !isNote,
      attachments: files,
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setBody("");
    setFiles([]);
    toast.success(isNote ? "Nota adicionada" : resolve ? "Resposta enviada e chamado resolvido" : "Resposta enviada");
    router.refresh();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(false);
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <ChipGroup label="Tipo de mensagem" hideLabel options={closed ? [MODES[1]] : MODES} value={mode} onChange={setMode} />
      {closed && <p className={styles.closed}>Este chamado está fechado. Você ainda pode adicionar notas internas.</p>}
      <label htmlFor="admin-reply" className="sr-only" style={{ position: "absolute", left: -9999 }}>Mensagem</label>
      <textarea
        id="admin-reply"
        className={`${styles.textarea} ${isNote ? styles.note : ""}`}
        value={body}
        maxLength={LIMITS.bodyMax}
        placeholder={isNote ? "Escreva uma nota. Só a equipe vê." : "Escreva uma resposta. O usuário será notificado."}
        onChange={(e) => setBody(e.target.value)}
      />
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.actions}>
        <AttachmentPicker files={files} onChange={setFiles} onBusyChange={setUploading} />
        <div className={styles.right}>
          {!isNote && (
            <button type="button" className={styles.secondary} disabled={busy || uploading} onClick={() => send(true)}>
              Send and resolve
            </button>
          )}
          <button type="submit" className={styles.primary} disabled={busy || uploading}>
            {isNote ? "Adicionar nota" : "Enviar resposta"}
          </button>
        </div>
      </div>
    </form>
  );
}
