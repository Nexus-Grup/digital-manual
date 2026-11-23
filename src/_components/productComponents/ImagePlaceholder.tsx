import styles from '@/_styles/cssProductPage/ImagePlaceholder.module.css';
import { ImageIcon } from './TabIcons';

type Props = {
  /** describes the missing image to screen readers; "" for decorative */
  alt: string;
  /** short visible caption; hidden on small thumbnails */
  caption?: string;
};

// Stand-in for product photos/drawings that haven't been uploaded yet. Fills its parent box.
export default function ImagePlaceholder({ alt, caption }: Props) {
  return (
    <div
      className={styles['image-placeholder']}
      // empty alt = decorative (e.g. inside a labelled button)
      {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}
    >
      <ImageIcon size={32} />
      {caption && <span className={styles['image-placeholder__caption']}>{caption}</span>}
    </div>
  );
}
