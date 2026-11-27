'use client';

import { useId, useState, type DragEvent } from 'react';
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
};

export function UploadBox({ productId, kind, value, onChange, title, hint, compact, cutout }: Props) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function send(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const res = await uploadFile(productId, kind, file, { cutout });
    setBusy(false);
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

  if (value) {
    return (
      <div className={`${styles.uploaded} ${compact ? styles.uploadedCompact : ''}`}>
        {kind === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className={styles.uploadedImg} />
        ) : (
          <span className={styles.uploadedName}>{fileNameFromUrl(value)}</span>
        )}
        <button type="button" className={styles.iconBtn} onClick={() => onChange(null)} aria-label={`Remover ${title}`}>
          <Trash2 size={14} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      className={`${styles.dropzone} ${compact ? styles.dropzoneCompact : ''} ${drag ? styles.dropzoneActive : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
    >
      {compact ? <Plus size={14} aria-hidden /> : <ImagePlus size={18} aria-hidden />}
      <span className={styles.dropTitle}>{busy ? (cutout ? 'Removendo o fundo...' : 'Enviando...') : title}</span>
      <span className={styles.dropHint}>{hint}</span>
      <input
        id={id}
        type="file"
        accept={ACCEPT[kind]}
        className={styles.srOnly}
        disabled={busy}
        onChange={(e) => { send(e.target.files?.[0]); e.target.value = ''; }}
      />
    </label>
  );
}
