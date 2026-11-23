'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '@/_styles/cssProductPage/VerticalCarousel.module.css';

type Props<T> = {
  items: T[];
  /** quantos itens aparecem entre as setas */
  size?: number;
  label: string;
  render: (item: T, index: number) => ReactNode;
};

/** Lista vertical com setas: mostra `size` itens por vez (cards da Informacao, miniaturas da Montagem). */
export default function VerticalCarousel<T>({ items, size = 2, label, render }: Props<T>) {
  const [start, setStart] = useState(0);
  const max = Math.max(0, items.length - size);
  const s = Math.min(start, max);

  return (
    <div className={styles.root} role="group" aria-label={label}>
      <button type="button" className={styles.arrow} onClick={() => setStart(Math.max(0, s - 1))} disabled={s === 0} aria-label="Itens anteriores">
        <ChevronUp size={18} aria-hidden />
      </button>
      <ul className={styles.list}>
        {items.slice(s, s + size).map((item, i) => (
          <li key={s + i}>{render(item, s + i)}</li>
        ))}
      </ul>
      <button type="button" className={styles.arrow} onClick={() => setStart(Math.min(max, s + 1))} disabled={s >= max} aria-label="Proximos itens">
        <ChevronDown size={18} aria-hidden />
      </button>
    </div>
  );
}
