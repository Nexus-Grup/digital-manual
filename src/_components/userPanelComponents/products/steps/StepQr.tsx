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
    navigator.clipboard.writeText(url).then(() => toast.success('URL copiada.'), () => toast.error('Não foi possível copiar a URL'));

  return (
    <div className={styles.stack}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>QR Codes do produto</h3>
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
                <span className={`${styles.badge} ${q.isActive ? styles.badgeOn : styles.badgeOff}`}>{q.isActive ? 'Ativo' : 'Inativo'}</span>
                <small>Created {formatDay(q.createdAt)}</small>
              </div>
              <KebabMenu label={`Ações de ${q.value}`}>
                {(close) => (
                  <>
                    <button type="button" className={styles.menuItem} onClick={() => { close(); setModal({ kind: 'view', qr: q }); }}><Eye size={14} aria-hidden /> Ver QR Code</button>
                    <button type="button" className={styles.menuItem} onClick={() => { close(); downloadQrPng(q.url ?? q.value, q.value); }}><Download size={14} aria-hidden /> Baixar PNG</button>
                    <button type="button" className={styles.menuItem} onClick={() => { close(); toggle(q); }}><QrCode size={14} aria-hidden /> {q.isActive ? 'Desativar' : 'Ativar'}</button>
                    <hr className={styles.menuDivider} />
                    <button type="button" className={`${styles.menuItem} ${styles.menuDanger}`} onClick={() => { close(); setModal({ kind: 'remove', qr: q }); }}><Trash2 size={14} aria-hidden /> Remover QR Code</button>
                  </>
                )}
              </KebabMenu>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className={styles.bigBtn} onClick={() => setModal({ kind: 'create' })}>
        <QrCode size={16} aria-hidden />
        <strong>Gerar novo QR Code</strong>
        <small>Crie outro QR Code ligado a este produto.</small>
      </button>

      {modal?.kind === 'create' && (
        <ProductModal title="Gerar QR Code" onClose={() => setModal(null)}>
          <h2 className={styles.modalTitle}>Gerar QR Code</h2>
          <p className={styles.modalSub}>Crie um novo QR Code para {product.name}.</p>
          <div className={styles.qrPreviewRow}>
            <QrImage value={`${product.code}-${nextValue}`} size={80} />
            <div><small>ID do QR Code</small><strong className={styles.qrId}>{nextValue}</strong><small>{product.name}</small></div>
          </div>
          <small>Gerado automaticamente</small>
          <div className={styles.field}>
            <label>URL de destino</label>
            <input className={styles.input} readOnly value={`${window.location.origin}/qr/••••••••`} aria-label="URL de destino" />
            <small>O endereço final é criado quando você salvar.</small>
          </div>
          <div className={styles.modalFoot}>
            <button type="button" className={styles.pillBtn} onClick={() => setModal(null)} disabled={busy}>Cancelar</button>
            <button type="button" className={styles.primaryBtn} onClick={create} disabled={busy}>{busy ? 'Criando...' : 'Criar QR Code'}</button>
          </div>
        </ProductModal>
      )}

      {modal?.kind === 'view' && (
        <ProductModal title="Prévia do QR Code" onClose={() => setModal(null)} wide>
          <h2 className={styles.modalTitle}>Prévia do QR Code</h2>
          <strong className={styles.qrId}>{modal.qr.value}</strong>
          <small>{product.name}</small>
          <div className={styles.viewGrid}>
            <QrImage value={modal.qr.url ?? modal.qr.value} size={170} className={styles.viewQr} />
            <div className={styles.viewRight}>
              <button type="button" className={styles.bigBtn} onClick={() => downloadQrPng(modal.qr.url ?? modal.qr.value, modal.qr.value)}><Download size={16} aria-hidden /> Baixar PNG</button>
              <button type="button" className={styles.bigBtn} onClick={() => downloadQrPdf(modal.qr.url ?? modal.qr.value, modal.qr.value, product.name)}><Download size={16} aria-hidden /> Baixar PDF</button>
              <div className={styles.urlBox}>
                <small>URL do QR Code</small>
                <span>{modal.qr.url}</span>
                <button type="button" className={styles.iconBtn} onClick={() => modal.qr.url && copy(modal.qr.url)} aria-label="Copiar URL"><Copy size={14} aria-hidden /></button>
              </div>
            </div>
          </div>
          <div className={styles.modalFoot}><button type="button" className={styles.pillBtn} onClick={() => setModal(null)}>Cancelar</button></div>
        </ProductModal>
      )}

      {modal?.kind === 'remove' && (
        <ProductModal title="Remover QR Code" onClose={() => setModal(null)}>
          <h2 className={styles.modalTitle}>Remover {modal.qr.value}?</h2>
          <p className={styles.modalSub}>Cópias impressas deste QR Code vão parar de funcionar.</p>
          <div className={styles.modalFoot}>
            <button type="button" className={styles.pillBtn} onClick={() => setModal(null)} disabled={busy}>Cancelar</button>
            <button type="button" className={styles.dangerBtn} onClick={() => remove(modal.qr)} disabled={busy}>{busy ? 'Removendo...' : 'Remover QR Code'}</button>
          </div>
        </ProductModal>
      )}
    </div>
  );
}
