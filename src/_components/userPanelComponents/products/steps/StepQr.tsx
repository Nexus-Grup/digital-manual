'use client';

import { useImperativeHandle, useState } from 'react';
import { Copy, Download, Eye, QrCode, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import type { Progress, QrDTO } from '@/_lib/productTypes';
import { KebabMenu } from '../KebabMenu';
import { ProductModal } from '../ProductModal';
import { QrImage, downloadQrPdf, downloadQrPng } from '../QrImage';
import { api, formatDay } from '../productApi';
import type { StepProps } from './stepTypes';

type ModalState = null | { kind: 'create' } | { kind: 'view'; qr: QrDTO } | { kind: 'remove'; qr: QrDTO };

export function StepQr({ product, onProgress, ref }: StepProps) {
  const [qrs, setQrs] = useState<QrDTO[]>(product.qrCodes);
  const [modal, setModal] = useState<ModalState>(null);
  const [busy, setBusy] = useState(false);

  // os QR Codes são salvos na hora (gerar / remover): não há nada pendente
  useImperativeHandle(ref, () => ({ save: async () => true }));

  const refreshProgress = async () => {
    const r = await api<{ product: { progress: Progress } }>(`/api/products/${product.id}`);
    if (r.ok) onProgress(r.data.product.progress);
  };

  const nextValue = `QR-${String(qrs.reduce((m, q) => Math.max(m, Number(q.value.replace(/\D/g, '')) || 0), 0) + 1).padStart(3, '0')}`;

  async function create() {
    setBusy(true);
    const r = await api<{ qr: QrDTO }>(`/api/products/${product.id}/qr-codes`, 'POST');
    setBusy(false);
    if (!r.ok) return void toast.error(r.error);
    setQrs((l) => [...l, r.data.qr]);
    setModal(null);
    toast.success(`${r.data.qr.value} created.`);
    refreshProgress();
  }

  async function remove(qr: QrDTO) {
    setBusy(true);
    const r = await api(`/api/products/${product.id}/qr-codes/${qr.id}`, 'DELETE');
    setBusy(false);
    if (!r.ok) return void toast.error(r.error);
    setQrs((l) => l.filter((q) => q.id !== qr.id));
    setModal(null);
    toast.success(`${qr.value} removed.`);
    refreshProgress();
  }

  async function toggle(qr: QrDTO) {
    const r = await api(`/api/products/${product.id}/qr-codes/${qr.id}`, 'PATCH', { isActive: !qr.isActive });
    if (!r.ok) return void toast.error(r.error);
    setQrs((l) => l.map((q) => (q.id === qr.id ? { ...q, isActive: !q.isActive } : q)));
    toast.success(qr.isActive ? `${qr.value} deactivated.` : `${qr.value} activated.`);
  }

  const copy = (url: string) =>
    navigator.clipboard.writeText(url).then(() => toast.success('URL copied.'), () => toast.error('Could not copy the URL'));

  return (
    <div className={styles.stack}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>Product QR Codes</h3>
        <span className={styles.count}>{qrs.length} generated</span>
      </div>

      {qrs.length > 0 && (
        <ul className={styles.qrList}>
          {qrs.map((q) => (
            <li key={q.id}>
              <QrImage value={q.url ?? q.value} size={56} />
              <div className={styles.qrText}>
                <strong>{q.value}</strong>
                <small>{product.name}</small>
                <span className={`${styles.badge} ${q.isActive ? styles.badgeOn : styles.badgeOff}`}>{q.isActive ? 'Active' : 'Inactive'}</span>
                <small>Created {formatDay(q.createdAt)}</small>
              </div>
              <KebabMenu label={`Actions for ${q.value}`}>
                {(close) => (
                  <>
                    <button type="button" className={styles.menuItem} onClick={() => { close(); setModal({ kind: 'view', qr: q }); }}><Eye size={14} aria-hidden /> View QR Code</button>
                    <button type="button" className={styles.menuItem} onClick={() => { close(); downloadQrPng(q.url ?? q.value, q.value); }}><Download size={14} aria-hidden /> Download PNG</button>
                    <button type="button" className={styles.menuItem} onClick={() => { close(); toggle(q); }}><QrCode size={14} aria-hidden /> {q.isActive ? 'Deactivate' : 'Activate'}</button>
                    <hr className={styles.menuDivider} />
                    <button type="button" className={`${styles.menuItem} ${styles.menuDanger}`} onClick={() => { close(); setModal({ kind: 'remove', qr: q }); }}><Trash2 size={14} aria-hidden /> Remove QR Code</button>
                  </>
                )}
              </KebabMenu>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={styles.bigBtn} onClick={() => setModal({ kind: 'create' })}>
        <QrCode size={16} aria-hidden />
        <strong>Generate New QR Code</strong>
        <small>Create another QR Code linked to this product.</small>
      </button>

      {modal?.kind === 'create' && (
        <ProductModal title="Generate QR Code" onClose={() => setModal(null)}>
          <h2 className={styles.modalTitle}>Generate QR Code</h2>
          <p className={styles.modalSub}>Create a new QR Code for {product.name}.</p>
          <div className={styles.qrPreviewRow}>
            <QrImage value={`${product.code}-${nextValue}`} size={80} />
            <div><small>QR Code ID</small><strong className={styles.qrId}>{nextValue}</strong><small>{product.name}</small></div>
          </div>
          <small>Automatically generated</small>
          <div className={styles.field}>
            <label>Destination URL</label>
            <input className={styles.input} readOnly value={`${window.location.origin}/qr/••••••••`} aria-label="Destination URL" />
            <small>The final address is created when you save.</small>
          </div>
          <div className={styles.modalFoot}>
            <button type="button" className={styles.pillBtn} onClick={() => setModal(null)} disabled={busy}>Cancel</button>
            <button type="button" className={styles.primaryBtn} onClick={create} disabled={busy}>{busy ? 'Creating...' : 'Create QR Code'}</button>
          </div>
        </ProductModal>
      )}

      {modal?.kind === 'view' && (
        <ProductModal title="QR Code Preview" onClose={() => setModal(null)} wide>
          <h2 className={styles.modalTitle}>QR Code Preview</h2>
          <strong className={styles.qrId}>{modal.qr.value}</strong>
          <small>{product.name}</small>
          <div className={styles.viewGrid}>
            <QrImage value={modal.qr.url ?? modal.qr.value} size={170} className={styles.viewQr} />
            <div className={styles.viewRight}>
              <button type="button" className={styles.bigBtn} onClick={() => downloadQrPng(modal.qr.url ?? modal.qr.value, modal.qr.value)}><Download size={16} aria-hidden /> Download PNG</button>
              <button type="button" className={styles.bigBtn} onClick={() => downloadQrPdf(modal.qr.url ?? modal.qr.value, modal.qr.value, product.name)}><Download size={16} aria-hidden /> Download PDF</button>
              <div className={styles.urlBox}>
                <small>QR Code URL</small>
                <span>{modal.qr.url}</span>
                <button type="button" className={styles.iconBtn} onClick={() => modal.qr.url && copy(modal.qr.url)} aria-label="Copy URL"><Copy size={14} aria-hidden /></button>
              </div>
            </div>
          </div>
          <div className={styles.modalFoot}><button type="button" className={styles.pillBtn} onClick={() => setModal(null)}>Cancel</button></div>
        </ProductModal>
      )}

      {modal?.kind === 'remove' && (
        <ProductModal title="Remove QR Code" onClose={() => setModal(null)}>
          <h2 className={styles.modalTitle}>Remove {modal.qr.value}?</h2>
          <p className={styles.modalSub}>Printed copies of this QR Code will stop working.</p>
          <div className={styles.modalFoot}>
            <button type="button" className={styles.pillBtn} onClick={() => setModal(null)} disabled={busy}>Cancel</button>
            <button type="button" className={styles.dangerBtn} onClick={() => remove(modal.qr)} disabled={busy}>{busy ? 'Removing...' : 'Remove QR Code'}</button>
          </div>
        </ProductModal>
      )}
    </div>
  );
}
