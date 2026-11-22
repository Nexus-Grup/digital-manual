import styles from '@/_styles/cssProductPage/ProductTextCard.module.css';

type Props = {
  title: string;
  productName: string;
  /** optional heading above the description (e.g. "Instruções") */
  subtitle?: string;
  description: string;
};

// Left-column text card shared by the product pages (Informação, Montagem...), so they keep the same layout.
export default function ProductTextCard({ title, productName, subtitle, description }: Props) {
  return (
    <div className={styles['text-card']}>
      <div className={styles['text-card__heading']}>
        <h1 className={styles['text-card__title']}>{title}</h1>
        <p className={styles['text-card__name']}>{productName}</p>
      </div>
      <div className={styles['text-card__content']}>
        {subtitle && <h2 className={styles['text-card__subtitle']}>{subtitle}</h2>}
        <p className={styles['text-card__text']}>{description}</p>
      </div>
    </div>
  );
}
