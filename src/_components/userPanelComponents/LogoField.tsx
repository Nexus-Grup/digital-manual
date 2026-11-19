'use client';

import { useRef, useState, type DragEvent } from 'react';
import { Download, ImagePlus, Trash2 } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/CompanyForm.module.css';

type Props = {
  label: string | null;
  value: string | null;
  onChange: (url: string | null) => void;
  onBusyChange: (busy: boolean) => void;
  onError: (message: string) => void;
};

export function LogoField({ value, onChange, onBusyChange, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    onBusyChange(true);
    onError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/uploads/logo', { method: 'POST', body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onError(data.error ?? 'Upload failed');
        return;
      }
      onChange(data.url);
    } catch {
      onError('Upload failed. Try again.');
    } finally {
      setBusy(false);
      onBusyChange(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>Company Logo</span>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className={styles.srOnly}
        aria-label="Upload company logo"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {value ? (
        <div className={styles.logoRow}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Company logo" className={styles.logoPreview} />
          <button type="button" className={styles.smallBtn} disabled={busy} onClick={() => inputRef.current?.click()}>
            <Download size={13} aria-hidden /> {busy ? 'Uploading...' : 'Change logo'}
          </button>
          <button type="button" className={styles.removeBtn} disabled={busy} onClick={() => onChange(null)}>
            <Trash2 size={13} aria-hidden /> Remove
          </button>
        </div>
      ) : (
        <label
          className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
        >
          <ImagePlus size={18} aria-hidden />
          <span className={styles.dropTitle}>{busy ? 'Uploading...' : 'Upload company logo'}</span>
          <span className={styles.dropHint}>PNG, JPG OR SVG</span>
        </label>
      )}
    </div>
  );
}