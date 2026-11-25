import styles from '@/_styles/cssProductPage/ProductView.module.css';
import HighlightList, { type Highlight } from './HighlightList';
import HighlightsSheet from './HighlightsSheet';
import MediaCarousel, { type MediaSlide } from './MediaCarousel';
import ProductIntro, { type IntroChip } from './ProductIntro';

type Props = {
  productName: string;
  /** information title saved in the wizard (subtitle) */
  title: string | null;
  description: string | null;
  cards: Highlight[];
  chips: IntroChip[];
  model3dUrl: string | null;
  /** main product image + gallery (already without duplicates) */
  images: string[];
};

// Server Component: only the carousels and the "Ver mais" sheet ship JS.
export default function InformationView({ productName, title, description, cards, chips, model3dUrl, images }: Props) {
  const slides: MediaSlide[] = [
    ...(model3dUrl ? [{ id: 'model', src: model3dUrl, alt: `Modelo 3D de ${productName}`, model: true }] : []),
    ...images.map((src, i) => ({ id: src, src, alt: `${productName} - imagem ${i + 1} de ${images.length}` })),
  ];

  return (
    <section className={styles['product-view']}>
      <div className={styles['product-view__container']}>
        <div className={styles['product-view__intro']}>
          <ProductIntro
            tag="Informações"
            title={productName}
            subtitle={title && title !== productName ? title : 'Descrição da ferramenta'}
            description={description ?? ''}
            chips={chips}
            sheetTitle="Descrição da ferramenta"
            action={cards.length > 0 ? <HighlightsSheet cards={cards} /> : undefined}
          />
        </div>

        <div className={styles['product-view__media']}>
          <MediaCarousel slides={slides} label={`Imagens de ${productName}`} tone="photo" swipeHint="Deslize" />
        </div>

        {cards.length > 0 && (
          // shown inline on desktop and on tall screens; elsewhere they open from "Destaques" (HighlightsSheet)
          <div className={`${styles['product-view__aside']} ${styles['product-view__aside--when-fits']}`}>
            <HighlightList cards={cards} />
          </div>
        )}
      </div>
    </section>
  );
}
