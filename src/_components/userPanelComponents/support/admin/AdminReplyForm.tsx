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
  { value: "public", label: "Reply to user" },
  { value: "internal", label: "Internal note" },
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
    if (!body.trim()) return setError("Write a message first.");
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
    toast.success(isNote ? "Note added" : resolve ? "Reply sent and ticket resolved" : "Reply sent");
    router.refresh();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(false);
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <ChipGroup label="Message type" hideLabel options={closed ? [MODES[1]] : MODES} value={mode} onChange={setMode} />
      {closed && <p className={styles.closed}>This ticket is closed. You can still add internal notes.</p>}
      <label htmlFor="admin-reply" className="sr-only" style={{ position: "absolute", left: -9999 }}>Message</label>
      <textarea
        id="admin-reply"
        className={`${styles.textarea} ${isNote ? styles.note : ""}`}
        value={body}
        maxLength={LIMITS.bodyMax}
        placeholder={isNote ? "Write a note. Only the team sees it." : "Write a reply. The user is notified."}
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
            {isNote ? "Add note" : "Send reply"}
          </button>
        </div>
      </div>
    </form>
  );
}
