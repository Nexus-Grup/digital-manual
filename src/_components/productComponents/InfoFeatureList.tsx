'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import styles from '@/_styles/cssProductPage/ProductInfo.module.css';
import type { InformationFeature, InformationFeatureIcon } from '@/_data/getInformation';
import { BoltIcon, GaugeIcon, LightbulbIcon, ReverseIcon } from './TabIcons';
import ScrollArrow from './ScrollArrow';

const ICONS: Record<InformationFeatureIcon, ReactNode> = {
  light: <LightbulbIcon />,
  bolt: <BoltIcon />,
  gauge: <GaugeIcon />,
  reverse: <ReverseIcon />,
};

export default function InfoFeatureList({ features }: { features: InformationFeature[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  // desktop shows two cards: start with "down" enabled when there are more, so SSR matches the common case
  const [atEnd, setAtEnd] = useState(features.length <= 2);

  const updateEdges = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setAtStart(list.scrollTop <= 1);
    setAtEnd(list.scrollTop + list.clientHeight >= list.scrollHeight - 1);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // fires once on observe and again on resize (the list only scrolls on desktop)
    const observer = new ResizeObserver(updateEdges);
    observer.observe(list);
    return () => observer.disconnect();
  }, [updateEdges]);

  // scrolls by one card (card height + list gap)
  const scroll = (direction: 1 | -1) => {
    const list = listRef.current;
    const card = list?.firstElementChild as HTMLElement | null;
    if (!list || !card) return;
    const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
    list.scrollBy({ top: direction * (card.offsetHeight + gap), behavior: 'smooth' });
  };

  return (
    <div className={styles['product-info__features']}>
      <ScrollArrow
        direction="up"
        label="Ver recursos anteriores"
        controls="product-features"
        disabled={atStart}
        onClick={() => scroll(-1)}
      />

      <ul
        id="product-features"
        ref={listRef}
        className={styles['product-info__list']}
        aria-label="Recursos da ferramenta"
        onScroll={updateEdges}
      >
        {features.map((feature) => (
          <li key={feature.id} className={styles['product-info__card']}>
            <span className={styles['product-info__card-icon']}>{ICONS[feature.icon]}</span>
            <p className={styles['product-info__card-text']}>{feature.text}</p>
          </li>
        ))}
      </ul>

      <ScrollArrow
        direction="down"
        label="Ver próximos recursos"
        controls="product-features"
        disabled={atEnd}
        onClick={() => scroll(1)}
      />
    </div>
  );
}
