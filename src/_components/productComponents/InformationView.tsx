'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import {
  Battery, ChevronLeft, ChevronRight, Clock, Info, Lightbulb, Ruler,
  Shield, Thermometer, Volume2, Wrench, Zap, type LucideIcon,
} from 'lucide-react';
import VerticalCarousel from './VerticalCarousel';
import styles from '@/_styles/cssProductPage/InformationView.module.css';

// mesmos valores de INFO_ICONS (productConstants)
const ICONS: Record<string, LucideIcon> = {
  lightbulb: Lightbulb, zap: Zap, battery: Battery, shield: Shield, wrench: Wrench,
  clock: Clock, volume: Volume2, ruler: Ruler, thermometer: Thermometer, info: Info,
};

type Card = { id: number; title: string; description: string | null; icon: string | null };

type Props = {
  productName: string;
  title: string | null;
  description: string | null;
  cards: Card[];
  model3dUrl: string | null;
  /** imagem principal do produto + galeria (ja sem repetidas) */
  images: string[];
};

/** Modelo 3D (.glb) com o web component <model-viewer>. Requer: npm i @google/model-viewer */
function Model3D({ src, alt }: { src: string; alt: string }) {
  useEffect(() => {
    import('@google/model-viewer').catch(() => {});
  }, []);

  return (
    <div className={styles.model}>
      {createElement('model-viewer', {
        src,
        alt,
        'camera-controls': true,
        'auto-rotate': true,
        'touch-action': 'pan-y',
        style: { width: '100%', height: '100%' },
      })}
      <span className={styles.badge360} aria-hidden="true">360°</span>
    </div>
  );
}

function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);

  if (images.length === 0) return <div className={styles.empty}>Sem imagens</div>;

  const go = (d: number) => setI((c) => (c + d + images.length) % images.length);

  return (
    <div
      className={styles.gallery}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.slideImg} src={images[i]} alt={`${alt} - imagem ${i + 1} de ${images.length}`} />
      {images.length > 1 && (
        <>
          <button type="button" className={`${styles.nav} ${styles.navPrev}`} onClick={() => go(-1)} aria-label="Imagem anterior">
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button type="button" className={`${styles.nav} ${styles.navNext}`} onClick={() => go(1)} aria-label="Proxima imagem">
            <ChevronRight size={20} aria-hidden />
          </button>
          <div className={styles.dots}>
            {images.map((_, k) => (
              <button
                key={k}
                type="button"
                className={k === i ? styles.dotOn : styles.dot}
                onClick={() => setI(k)}
                aria-label={`Ir para a imagem ${k + 1}`}
                aria-current={k === i}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function InformationView({ productName, title, description, cards, model3dUrl, images }: Props) {
  return (
    <section className={styles.root}>
      <div className={styles.text}>
        <h1 className={styles.heading}>Descrição da ferramenta</h1>
        <p className={styles.sub}>{title || productName}</p>
        {description && <p className={styles.desc}>{description}</p>}
      </div>

      <div className={styles.media}>
        {model3dUrl ? <Model3D src={model3dUrl} alt={`Modelo 3D de ${productName}`} /> : <Gallery images={images} alt={productName} />}
      </div>

      <div className={styles.cards}>
        {cards.length > 0 && (
          <VerticalCarousel
            items={cards}
            size={2}
            label="Informações do produto"
            render={(c) => {
              const Icon = (c.icon && ICONS[c.icon]) || Info;
              return (
                <article className={styles.card}>
                  <span className={styles.cardIcon}><Icon size={22} aria-hidden /></span>
                  <div>
                    <strong>{c.title}</strong>
                    {c.description && <p>{c.description}</p>}
                  </div>
                </article>
              );
            }}
          />
        )}
      </div>
    </section>
  );
}
