'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/Products.module.css';
import { CATEGORIES, labelOf, missingSteps } from '@/_lib/productConstants';
import type { ProductFull } from '@/_lib/productTypes';
import { ProductModal } from './ProductModal';
import { api, formatDay } from './productApi';

export function ProductDetailsModal({ productId, onClose }: { productId: number; onClose: () => void }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductFull | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    api<{ product: ProductFull }>(`/api/products/${productId}`).then((r) => {
      if (!alive) return;
      if (r.ok) setProduct(r.data.product);
      else setError(r.error);
    });
    return () => { alive = false; };
  }, [productId]);

  // publishing needs 100% (the server checks it too); a draft below that explains what is missing
  const missing = product ? missingSteps(product.progress.steps) : [];
  const blocked = !!product && product.status !== 'PUBLISHED' && product.progress.completion < 100 && missing.length > 0;

  async function toggleStatus() {
    if (!product) return;
    const next = product.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setBusy(true);
    const r = await api(`/api/products/${product.id}/status`, 'PATCH', { status: next });
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.success(next === 'PUBLISHED' ? 'Produto publicado.' : 'Produto voltou para rascunho.');
    router.refresh();
    onClose();
  }

  return (
    <ProductModal title="Detalhes do produto" onClose={onClose} wide>
      <header className={styles.detailsHead}>
        <h2 className={styles.detailsTitle}><Package size={22} aria-hidden /> Detalhes do produto</h2>
        {product?.canEdit && (
          <div className={styles.detailsActions}>
            <Link href={`/painel/produtos/${product.id}/editar`} className={styles.pillBtn}><Pencil size={12} aria-hidden /> Editar produto</Link>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={toggleStatus}
              disabled={busy || blocked}
              aria-describedby={blocked ? 'publish-blocked' : undefined}
            >
              {busy ? 'Salvando...' : product.status === 'PUBLISHED' ? 'Voltar para rascunho' : 'Publicar produto'}
            </button>
          </div>
        )}
      </header>

      {product?.canEdit && blocked && (
        <p className={styles.publishHint} id="publish-blocked">
          Para publicar, complete o cadastro ({product.progress.completion}%). Falta preencher: <strong>{missing.join(', ')}</strong>.{' '}
          <Link className={styles.publishHintLink} href={`/painel/produtos/${product.id}/editar`}>Continuar a edição</Link>
        </p>
      )}

      {error && <p className={styles.errorText} role="alert">{error}</p>}
      {!product && !error && <p className={styles.muted}>Carregando...</p>}

      {product && (
        <>
          <div className={styles.detailsInfo}>
            <span className={`${styles.pill} ${product.status === 'PUBLISHED' ? styles.pillGreen : styles.pillYellow}`}>{product.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}</span>
            <p><strong>Nome do produto:</strong> {product.name}</p>
            <p><strong>SKU / código / GTIN / EAN:</strong> {product.code}</p>
            <p><strong>Categoria:</strong> {labelOf(CATEGORIES, product.category)}</p>
            <p className={styles.muted}>Atualizado em: {formatDay(product.updatedAt)}</p>
          </div>
          <div className={styles.stats}>
            <div><strong>{product.stats.views}</strong><span>Visualizações do produto</span></div>
            <div><strong>{product.stats.qrScans}</strong><span>Leituras de QR Code</span></div>
            <div><strong>{product.stats.downloads}</strong><span>Downloads do manual</span></div>
            <div><strong>{product.stats.landing}</strong><span>Visitas à landing page</span></div>
          </div>
        </>
      )}

      <div className={styles.detailsFoot}>
        <button type="button" className={styles.pillBtn} onClick={onClose}>Cancelar</button>
      </div>
    </ProductModal>
  );
}
