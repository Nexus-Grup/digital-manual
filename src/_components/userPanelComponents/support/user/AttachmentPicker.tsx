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
    if (picked.length === 0) return setError(`You can attach up to ${MAX_ATTACHMENTS} files.`);

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
        aria-label="Attach files"
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
          <span>{busy ? "Uploading..." : "Drag files or screenshots here, or click to choose"}</span>
          <span>PNG, JPG or PDF, up to 10 MB each</span>
        </button>
      ) : (
        <button type="button" className={styles.btn} disabled={busy} onClick={open}>
          {busy ? "Uploading..." : "Attach file"}
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
                aria-label={`Remove ${f.fileName}`}
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
