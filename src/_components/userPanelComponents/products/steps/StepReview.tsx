import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import type { ProductFull } from '@/_lib/productTypes';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function StepReview({ product }: { product: ProductFull }) {
  const images = (product.imgUrl ? 1 : 0) + product.gallery.length;
  const items = (product.information?.cards.length ?? 0) + product.assemblies.length;

  const rows: { title: string; sub?: string; value: string; done: boolean }[] = [
    { title: 'Informações básicas', sub: 'Nome, modelo, SKU, categoria, marca e descrição do produto', value: 'Concluído', done: true },
    { title: 'Imagens e mídias', value: `${plural(images, 'imagem', 'imagens')} · ${plural(product.videos.length, 'vídeo', 'vídeos')}`, done: product.progress.steps.media },
    { title: 'Informações técnicas', value: plural(product.technical?.specs.length ?? 0, 'especificação', 'especificações'), done: product.progress.steps.technical },
    { title: 'Manuais e documentos', value: plural(product.manuals.length, 'documento', 'documentos'), done: product.progress.steps.manuals },
    { title: 'Guias e conteúdo do produto', value: plural(items, 'item', 'itens'), done: product.progress.steps.guides },
    { title: 'QR Codes', value: plural(product.qrCodes.length, 'gerado', 'gerados'), done: product.progress.steps.qr },
  ];

  return (
    <ul className={styles.review}>
      {rows.map((r) => (
        <li key={r.title}>
          <span className={styles.reviewText}><strong>{r.title}</strong>{r.sub && <small>{r.sub}</small>}</span>
          <span className={`${styles.badge} ${r.done ? styles.badgeOn : styles.badgeOff}`}>
            {r.value}
            <span className={styles.srOnly}>{r.done ? ' (concluída)' : ' (pendente)'}</span>
          </span>
        </li>
      ))}
      <li>
        <span className={styles.reviewText}>
          <strong>Status do produto</strong>
          <small>{product.status === 'PUBLISHED' ? 'Este produto está publicado.' : 'Seu produto será salvo como rascunho. Você pode publicá-lo depois.'}</small>
        </span>
        <span className={`${styles.badge} ${product.status === 'PUBLISHED' ? styles.badgeOn : styles.badgeDraft}`}>{product.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}</span>
      </li>
    </ul>
  );
}
