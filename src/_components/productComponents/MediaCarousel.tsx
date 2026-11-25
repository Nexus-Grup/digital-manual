'use client';

import { createElement, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import styles from '@/_styles/cssProductPage/MediaCarousel.module.css';
import ImagePlaceholder from './ImagePlaceholder';
import { useSnapTrack } from './useSnapTrack';

export type MediaSlide = {
  id: string | number;
  /** null = placeholder until the real image is uploaded */
  src: string | null;
  alt: string;
  /** letter printed over the drawing (assembly steps) */
  badge?: string;
  /** .glb model shown with <model-viewer> instead of an image */
  model?: boolean;
};

type Props = {
  slides: MediaSlide[];
  label: string;
  /** controlled index (assembly keeps it in sync with the steps list) */
  index?: number;
  onIndexChange?: (index: number) => void;
  /** "A · 1/3" instead of "1/4" */
  counterPrefix?: (index: number) => string;
  /** "Ampliar" button that opens the current image full screen */
  zoomable?: boolean;
  /** light gray card (product photos) or white card (line drawings) */
  tone?: 'photo' | 'drawing';
  /** mobile hint on the first slide */
  swipeHint?: string;
};

// only these hosts go through the image optimizer (see next.config images.remotePatterns)
const optimizable = (src: string) => src.startsWith('/') || /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(src);

function Picture({ src, alt, sizes, priority }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  if (!optimizable(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={styles['media-carousel__image']} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} />;
  }
  return (
    <Image
      className={styles['media-carousel__image']}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      fetchPriority={priority ? 'high' : undefined}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

/** 3D model (.glb) with the <model-viewer> web component, loaded only on the client. */
function Model3D({ src, alt }: { src: string; alt: string }) {
  useEffect(() => {
    import('@google/model-viewer').catch(() => {});
  }, []);

  return (
    <div className={styles['media-carousel__model']}>
      {createElement('model-viewer', {
        src,
        alt,
        'camera-controls': true,
        'auto-rotate': true,
        'touch-action': 'pan-y',
        style: { width: '100%', height: '100%' },
      })}
      <span className={styles['media-carousel__tag']} aria-hidden="true">360°</span>
    </div>
  );
}

const SLIDE_SIZES = '(min-width: 1200px) and (orientation: landscape) 520px, (min-width: 1024px) and (orientation: landscape) 40vw, 88vw';

export default function MediaCarousel({
  slides,
  label,
  index,
  onIndexChange,
  counterPrefix,
  zoomable,
  tone = 'photo',
  swipeHint,
}: Props) {
  const total = slides.length;
  const { ref, state, scrollToIndex } = useSnapTrack<HTMLUListElement>(total);
  const current = state.index;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  // index the track is being scrolled to by code: intermediate positions are not reported
  const target = useRef<number | null>(null);
  const reported = useRef(index ?? 0);

  // user swipe -> report to the parent
  useEffect(() => {
    if (target.current !== null) {
      if (current === target.current) target.current = null;
      return;
    }
    if (current !== reported.current) {
      reported.current = current;
      onIndexChange?.(current);
    }
  }, [current, onIndexChange]);

  // parent changed the index (step list, "Próximo passo") -> scroll the track
  useEffect(() => {
    if (index === undefined || index === reported.current) return;
    reported.current = index;
    target.current = index === current ? null : index;
    scrollToIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reacts to the parent's index
  }, [index, scrollToIndex]);

  const go = (i: number) => {
    const next = Math.min(Math.max(i, 0), total - 1);
    if (next === current) return;
    target.current = next;
    reported.current = next;
    scrollToIndex(next);
    onIndexChange?.(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(current + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(current - 1);
    }
  };

  const counter = (i: number) => `${counterPrefix ? `${counterPrefix(i)} · ` : ''}${i + 1}/${total}`;
  const zoomed = zoomIndex === null ? null : slides[zoomIndex];
  const toneClass = `${styles['media-carousel']} ${styles[`media-carousel--${tone}`]}`;

  if (total === 0) {
    return (
      <div className={toneClass}>
        <div className={styles['media-carousel__empty']}>
          <ImagePlaceholder alt="" caption="Sem imagens" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={toneClass}
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div className={styles['media-carousel__viewport']}>
        <ul ref={ref} className={styles['media-carousel__track']} tabIndex={0}>
          {slides.map((slide, i) => (
            <li
              key={slide.id}
              className={styles['media-carousel__slide']}
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${total}`}
            >
              <div
                className={[
                  styles['media-carousel__frame'],
                  slide.badge ? styles['media-carousel__frame--badge'] : '',
                  zoomable && slide.src && !slide.model ? styles['media-carousel__frame--zoom'] : '',
                ].join(' ')}
              >
                {slide.model && slide.src ? (
                  <Model3D src={slide.src} alt={slide.alt} />
                ) : slide.src ? (
                  <Picture src={slide.src} alt={slide.alt} sizes={SLIDE_SIZES} priority={i === 0} />
                ) : (
                  <ImagePlaceholder
                    alt={slide.alt}
                    caption={slide.badge ? `Desenho do passo ${slide.badge}` : 'Imagem do produto'}
                  />
                )}
              </div>

              {slide.badge && (
                <span className={styles['media-carousel__badge']} aria-hidden="true">
                  {slide.badge}
                </span>
              )}

              <span className={styles['media-carousel__counter']} aria-hidden="true">
                {counter(i)}
              </span>

              {swipeHint && i === 0 && total > 1 && (
                <span className={styles['media-carousel__hint']} aria-hidden="true">
                  {swipeHint}
                  <ChevronRight size={16} />
                </span>
              )}

              {zoomable && slide.src && !slide.model && (
                <button
                  type="button"
                  className={styles['media-carousel__zoom']}
                  tabIndex={i === current ? 0 : -1}
                  onClick={() => {
                    setZoomIndex(i);
                    dialogRef.current?.showModal();
                  }}
                >
                  <ZoomIn size={18} aria-hidden />
                  Ampliar
                </button>
              )}
            </li>
          ))}
        </ul>

        {total > 1 && (
          <>
            <button
              type="button"
              className={`${styles['media-carousel__nav']} ${styles['media-carousel__nav--prev']}`}
              aria-label="Anterior"
              disabled={current === 0}
              onClick={() => go(current - 1)}
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              className={`${styles['media-carousel__nav']} ${styles['media-carousel__nav--next']}`}
              aria-label="Próximo"
              disabled={current === total - 1}
              onClick={() => go(current + 1)}
            >
              <ChevronRight size={20} aria-hidden />
            </button>
          </>
        )}
      </div>

      <p className={styles['media-carousel__sr-only']} aria-live="polite">
        {counter(current)}
      </p>

      {total > 1 && (
        <div className={styles['media-carousel__dots']} aria-hidden="true">
          {slides.map((slide, i) => (
            <span
              key={slide.id}
              className={`${styles['media-carousel__dot']} ${i === current ? styles['media-carousel__dot--active'] : ''}`}
            />
          ))}
        </div>
      )}

      {zoomable && (
        <dialog
          ref={dialogRef}
          className={styles['media-carousel__dialog']}
          aria-label={zoomed?.alt ?? label}
          onClose={() => setZoomIndex(null)}
          onClick={(e) => {
            // a click on the backdrop (the dialog itself, outside its content) closes it
            if (e.target === e.currentTarget) e.currentTarget.close();
          }}
        >
          <div className={styles['media-carousel__zoom-frame']}>
            {zoomed?.src && <Picture src={zoomed.src} alt={zoomed.alt} sizes="100vw" />}
          </div>
          <form method="dialog">
            <button type="submit" className={styles['media-carousel__close']} aria-label="Fechar imagem ampliada">
              <X size={22} aria-hidden />
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
}
