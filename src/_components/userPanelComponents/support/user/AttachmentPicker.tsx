"use client";
import { useRef, useState, type DragEvent } from "react";
import { uploadAttachment } from "@/lib/support/client";
import { MAX_ATTACHMENTS } from "@/lib/support/constants";
import type { UploadedFile } from "@/lib/support/types";
import styles from "@/_styles/cssUserPanelPage/support/AttachmentPicker.module.css";

type Props = {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  onBusyChange?: (busy: boolean) => void;
  variant?: "button" | "dropzone";
};

export function AttachmentPicker({ files, onChange, onBusyChange, variant = "button" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function addFiles(list: FileList | File[]) {
    const picked = Array.from(list).slice(0, MAX_ATTACHMENTS - files.length);
    if (picked.length === 0) return setError(`Você pode anexar até ${MAX_ATTACHMENTS} arquivos.`);

    setBusy(true);
    onBusyChange?.(true);
    setError("");
    const added: UploadedFile[] = [];
    for (const file of picked) {
      const res = await uploadAttachment(file);
      if (!res.ok) {
        setError(res.error);
        break;
      }
      added.push(res.data);
    }
    if (added.length) onChange([...files, ...added]);
    setBusy(false);
    onBusyChange?.(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) void addFiles(e.dataTransfer.files);
  }

  const open = () => inputRef.current?.click();

  return (
    <div className={styles.wrap}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,application/pdf"
        className={styles.input}
        aria-label="Anexar arquivos"
        tabIndex={-1}
        onChange={(e) => e.target.files && void addFiles(e.target.files)}
      />
      {variant === "dropzone" ? (
        <button
          type="button"
          className={`${styles.drop} ${dragging ? styles.dragging : ""}`}
          disabled={busy}
          onClick={open}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <span>{busy ? "Enviando..." : "Arraste arquivos ou prints para cá, ou clique para escolher"}</span>
          <span>PNG, JPG ou PDF, até 10 MB cada</span>
        </button>
      ) : (
        <button type="button" className={styles.btn} disabled={busy} onClick={open}>
          {busy ? "Enviando..." : "Anexar arquivo"}
        </button>
      )}

      {files.length > 0 && (
        <ul className={styles.list}>
          {files.map((f) => (
            <li key={f.fileUrl} className={styles.file}>
              <span className={styles.name}>{f.fileName}</span>
              <button
                type="button"
                className={styles.remove}
                aria-label={`Remover ${f.fileName}`}
                onClick={() => onChange(files.filter((x) => x.fileUrl !== f.fileUrl))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
