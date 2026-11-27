'use client';

import { useEffect, useId, useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import { fileNameFromUrl, uploadFile, type UploadKind } from './productApi';

const ACCEPT: Record<UploadKind, string> = {
  image: 'image/png,image/jpeg,image/webp',
  audio: 'audio/mpeg,audio/wav,audio/ogg',
  pdf: 'application/pdf',
  model: '.glb',
};

const KIND_NAME: Record<UploadKind, string> = { image: 'imagem', audio: 'áudio', pdf: 'PDF', model: 'modelo 3D' };

type Props = {
  productId: number;
  kind: UploadKind;
  value: string | null;
  onChange: (url: string | null) => void;
  title: string;
  hint: string;
  /** quadradinho da galeria */
  compact?: boolean;
  /** product photo: the server removes the background and crops to the product */
  cutout?: boolean;
  /** id of the file input, so a step can focus it when the file is missing */
  inputId?: string;
  /** required file: announced to screen readers; invalid = shows the error state */
  required?: boolean;
  invalid?: boolean;
  /** id of the inline error message (aria-describedby) */
  errorId?: string;
};

export function UploadBox({ productId, kind, value, onChange, title, hint, compact, cutout, inputId, required, invalid, errorId }: Props) {
  const autoId = useId();
  const id = inputId ?? autoId;
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const refocus = useRef(false);

  async function send(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setStatus(cutout ? 'Enviando e removendo o fundo...' : 'Enviando...');
    const res = await uploadFile(productId, kind, file, { cutout });
    setBusy(false);
    setStatus(res.ok ? `Arquivo enviado: ${file.name}.` : '');
    if (!res.ok) return toast.error(res.error);
    if (cutout && res.data.cutout === false) {
      toast.warning('Imagem salva, mas o fundo não pôde ser removido agora. Envie de novo mais tarde para tentar outra vez.');
    }
    onChange(res.data.url);
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    send(e.dataTransfer.files?.[0]);
  };

  // removing unmounts the trash button: send focus to the new picker instead of losing it
  useEffect(() => {
    if (value || !refocus.current) return;
    refocus.current = false;
    inputRef.current?.focus();
  }, [value]);

  const fileName = value ? fileNameFromUrl(value) : '';

  // the wrapper (display: contents) keeps one live region across both states, so messages are announced
  return (
    <div className={styles.uploadSlot}>
      {value ? (
        <div className={`${styles.uploaded} ${compact ? styles.uploadedCompact : ''}`}>
          {kind === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={`Imagem enviada: ${fileName}`} className={styles.uploadedImg} />
          ) : (
            <span className={styles.uploadedName}>{fileName}</span>
          )}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => {
              refocus.current = true;
              onChange(null);
              setStatus('Arquivo removido.');
            }}
            aria-label={`Remover ${KIND_NAME[kind]} ${fileName}`}
          >
            <Trash2 size={14} aria-hidden />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`${styles.dropzone} ${compact ? styles.dropzoneCompact : ''} ${drag ? styles.dropzoneActive : ''} ${invalid ? styles.dropzoneInvalid : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          {compact ? <Plus size={14} aria-hidden /> : <ImagePlus size={18} aria-hidden />}
          <span className={styles.dropTitle}>{busy ? (cutout ? 'Removendo o fundo...' : 'Enviando...') : title}</span>
          <span className={styles.dropHint}>{hint}</span>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ACCEPT[kind]}
            className={styles.srOnly}
            disabled={busy}
            aria-busy={busy}
            aria-required={required || undefined}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : undefined}
            onChange={(e) => { send(e.target.files?.[0]); e.target.value = ''; }}
          />
        </label>
      )}
      <span className={styles.srOnly} role="status">{status}</span>
    </div>
  );
}
