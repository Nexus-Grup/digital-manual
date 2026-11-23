'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/_styles/cssProductPage/ProductInfo.module.css';
import type { GalleryImage } from '@/_data/getInformation';
import ImagePlaceholder from './ImagePlaceholder';
import { Rotate360Icon } from './TabIcons';

// Thumbnail column + main image. Returns two siblings so the parent grid places them in
// the left and center columns (on mobile the thumbnails move below the image).
export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [current, setCurrent] = useState(0);
  const image = images[current] ?? images[0];
  if (!image) return null;

  return (
    <>
      {images.length > 1 && (
        <ul className={styles['product-info__thumbs']} aria-label="Imagens do produto">
          {images.map((img, i) => (
            <li key={img.id} className={styles['product-info__thumb-item']}>
              <button
                type="button"
                className={`${styles['product-info__thumb']} ${i === current ? styles['product-info__thumb--active'] : ''}`}
                aria-label={`Imagem ${i + 1} de ${images.length}: ${img.alt}`}
                aria-current={i === current ? 'true' : undefined}
                onClick={() => setCurrent(i)}
              >
                {img.imageUrl ? (
                  <Image
                    className={styles['product-info__image']}
                    src={img.imageUrl}
                    alt=""
                    fill
                    sizes="72px"
                  />
                ) : (
                  <ImagePlaceholder alt="" />
                )}
                {img.is360 && (
                  <span className={styles['product-info__thumb-tag']} aria-hidden="true">
                    360°
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles['product-info__showcase']}>
        <div className={styles['product-info__media']}>
          {image.imageUrl ? (
            <Image
              className={styles['product-info__image']}
              src={image.imageUrl}
              alt={image.alt}
              fill
              sizes="(min-width: 1200px) 280px, (min-width: 768px) 40vw, 70vw"
              fetchPriority={current === 0 ? 'high' : undefined}
            />
          ) : (
            <ImagePlaceholder
              alt={image.alt}
              caption={image.is360 ? 'Imagem 360° do produto' : `Imagem ${current + 1} do produto`}
            />
          )}
          {/* anchored to the image's right edge so it doesn't push the image off center */}
          {image.is360 && (
            <span className={styles['product-info__360']}>
              <Rotate360Icon />
            </span>
          )}
        </div>
      </div>
    </>
  );
}
