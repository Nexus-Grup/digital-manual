import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import type { ProductFull } from '@/_lib/productTypes';

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function StepReview({ product }: { product: ProductFull }) {
  const images = (product.imgUrl ? 1 : 0) + product.gallery.length;
  const items = (product.information?.cards.length ?? 0) + product.assemblies.length;

  const rows: { title: string; sub?: string; value: string; done: boolean }[] = [
    { title: 'Basic Information', sub: 'Product Name, Model, SKU, Category, Brand, Description', value: 'Completed', done: true },
    { title: 'Images & Media', value: `${plural(images, 'image')} · ${plural(product.videos.length, 'video')}`, done: product.progress.steps.media },
    { title: 'Technical Information', value: plural(product.technical?.specs.length ?? 0, 'specification'), done: product.progress.steps.technical },
    { title: 'Manuals & Documents', value: plural(product.manuals.length, 'document'), done: product.progress.steps.manuals },
    { title: 'Guides & Product Content', value: plural(items, 'item'), done: product.progress.steps.guides },
    { title: 'QR Codes', value: `${product.qrCodes.length} generated`, done: product.progress.steps.qr },
  ];

  return (
    <ul className={styles.review}>
      {rows.map((r) => (
        <li key={r.title}>
          <span className={styles.reviewText}><strong>{r.title}</strong>{r.sub && <small>{r.sub}</small>}</span>
          <span className={`${styles.badge} ${r.done ? styles.badgeOn : styles.badgeOff}`}>{r.value}</span>
        </li>
      ))}
      <li>
        <span className={styles.reviewText}>
          <strong>Product Status</strong>
          <small>{product.status === 'PUBLISHED' ? 'This product is published.' : 'Your product will be saved as a draft. You can publish it later.'}</small>
        </span>
        <span className={`${styles.badge} ${product.status === 'PUBLISHED' ? styles.badgeOn : styles.badgeDraft}`}>{product.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span>
      </li>
    </ul>
  );
}
