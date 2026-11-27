'use client';

import { useId, useRef, useState, type DragEvent } from 'react';
import { Download, ImagePlus, Trash2 } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/CompanyForm.module.css';

type Props = {
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  onBusyChange: (busy: boolean) => void;
  onError: (message: string) => void;
};

/**
 * Logo upload. The drop area is a real <button> (focusable, Enter/Space open the file picker);
 * drag and drop is an extra, not the only way (WCAG 2.1.1).
 */
export function LogoField({ label = 'Logo da empresa', value, onChange, onBusyChange, onError }: Props) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState('');

  async function upload(file: File) {
    setBusy(true);
    onBusyChange(true);
    onError('');
    setStatus('Enviando o logo...');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/uploads/logo', { method: 'POST', body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('');
        onError(data.error ?? 'Falha no envio');
        return;
      }
      onChange(data.url);
      setStatus('Logo enviado.');
    } catch {
      setStatus('');
      onError('Falha no envio. Tente de novo.');
    } finally {
      setBusy(false);
      onBusyChange(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function onDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  const pick = () => inputRef.current?.click();

  return (
    <div className={styles.field} role="group" aria-labelledby={`${uid}-label`}>
      <span id={`${uid}-label`} className={styles.label}>{label}</span>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className={styles.srOnly}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {value ? (
        <div className={styles.logoRow}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={`${label} atual`} className={styles.logoPreview} />
          <button type="button" className={styles.smallBtn} disabled={busy} onClick={pick}>
            <Download size={13} aria-hidden /> {busy ? 'Enviando...' : 'Trocar logo'}
          </button>
          <button
            type="button"
            className={styles.removeBtn}
            disabled={busy}
            onClick={() => {
              onChange(null);
              setStatus('Logo removido.');
            }}
          >
            <Trash2 size={13} aria-hidden /> Remover logo
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
          disabled={busy}
          aria-describedby={`${uid}-hint`}
          onClick={pick}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <ImagePlus size={18} aria-hidden />
          <span className={styles.dropTitle}>{busy ? 'Enviando...' : `Enviar ${label.toLowerCase()}`}</span>
          <span id={`${uid}-hint`} className={styles.dropHint}>PNG, JPG ou SVG · clique ou arraste o arquivo</span>
        </button>
      )}

      <span className={styles.srOnly} role="status">{status}</span>
    </div>
  );
}
