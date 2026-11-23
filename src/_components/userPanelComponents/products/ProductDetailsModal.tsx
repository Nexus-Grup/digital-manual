'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/Products.module.css';
import { CATEGORIES, labelOf } from '@/_lib/productConstants';
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

  async function toggleStatus() {
    if (!product) return;
    const next = product.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setBusy(true);
    const r = await api(`/api/products/${product.id}/status`, 'PATCH', { status: next });
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.success(next === 'PUBLISHED' ? 'Product published.' : 'Product moved to draft.');
    router.refresh();
    onClose();
  }

  return (
    <ProductModal title="Product Details" onClose={onClose} wide>
      <header className={styles.detailsHead}>
        <h2 className={styles.detailsTitle}><Package size={22} aria-hidden /> Product Details</h2>
        {product?.canEdit && (
          <div className={styles.detailsActions}>
            <Link href={`/user-panel/products/${product.id}/edit`} className={styles.pillBtn}><Pencil size={12} aria-hidden /> Edit Product</Link>
            <button type="button" className={styles.primaryBtn} onClick={toggleStatus} disabled={busy}>
              {busy ? 'Saving...' : product.status === 'PUBLISHED' ? 'Move to draft' : 'Publish Product'}
            </button>
          </div>
        )}
      </header>

      {error && <p className={styles.errorText} role="alert">{error}</p>}
      {!product && !error && <p className={styles.muted}>Loading...</p>}

      {product && (
        <>
          <div className={styles.detailsInfo}>
            <span className={`${styles.pill} ${product.status === 'PUBLISHED' ? styles.pillGreen : styles.pillYellow}`}>{product.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span>
            <p><strong>Product Name:</strong> {product.name}</p>
            <p><strong>Sku / Part Number / GTIN / EAN:</strong> {product.code}</p>
            <p><strong>Category:</strong> {labelOf(CATEGORIES, product.category)}</p>
            <p className={styles.muted}>Last updated: {formatDay(product.updatedAt)}</p>
          </div>
          <div className={styles.stats}>
            <div><strong>{product.stats.views}</strong><span>Product Views</span></div>
            <div><strong>{product.stats.qrScans}</strong><span>QR Scans</span></div>
            <div><strong>{product.stats.downloads}</strong><span>Manual Downloads</span></div>
            <div><strong>{product.stats.landing}</strong><span>Landing Page Views</span></div>
          </div>
        </>
      )}

      <div className={styles.detailsFoot}>
        <button type="button" className={styles.pillBtn} onClick={onClose}>Cancel</button>
      </div>
    </ProductModal>
  );
}
