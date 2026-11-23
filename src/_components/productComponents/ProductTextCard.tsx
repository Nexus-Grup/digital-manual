import styles from '@/_styles/cssProductPage/ProductTextCard.module.css';

type Props = {
  title: string;
  productName: string;
  description: string;
};

// Left-column text block shared by the product pages (Informação, Montagem...), so they keep the same layout.
export default function ProductTextCard({ title, productName, description }: Props) {
  return (
    <div className={styles['text-card']}>
      <div className={styles['text-card__heading']}>
        <h1 className={styles['text-card__title']}>{title}</h1>
        <p className={styles['text-card__name']}>{productName}</p>
      </div>
      <p className={styles['text-card__text']}>{description}</p>
    </div>
  );
}
