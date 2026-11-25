'use client';

import { useEffect, type Key, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '@/_styles/cssProductPage/SnapList.module.css';
import { useSnapTrack } from './useSnapTrack';

type Props<T> = {
  /** small uppercase heading ("Destaques", "Passos") */
  title: string;
  label: string;
  items: T[];
  getKey: (item: T) => Key;
  /** `active` = selected item (assembly) or the first visible one (information) */
  renderItem: (item: T, index: number, active: boolean) => ReactNode;
  /** controlled selection: the list scrolls to keep it visible */
  activeIndex?: number;
};

/**
 * Side column of cards. Desktop: vertical list with up/down arrows when it doesn't fit.
 * Mobile: horizontal swipe with snap and dots. Only the list scrolls, never the page.
 */
export default function SnapList<T>({ title, label, items, getKey, renderItem, activeIndex }: Props<T>) {
  const total = items.length;
  const { ref, state, scrollToIndex } = useSnapTrack<HTMLUListElement>(total);
  const { first, last, overflow } = state;

  // keep the selected item in view when it changes from outside (carousel, "Próximo passo")
  useEffect(() => {
    if (activeIndex === undefined) return;
    if (activeIndex < first || activeIndex > last) scrollToIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reacts to the selection
  }, [activeIndex, scrollToIndex]);

  const count =
    activeIndex !== undefined
      ? `${activeIndex + 1} de ${total}`
      : overflow && last > first
        ? `${first + 1}–${last + 1} de ${total}`
        : `${total} ${total === 1 ? 'item' : 'itens'}`;

  const highlighted = activeIndex ?? first;
  // modifiers go on each element (no combined selectors): arrows on desktop, dots on mobile
  const arrowClass = `${styles['snap-list__arrow']} ${overflow ? styles['snap-list__arrow--visible'] : ''}`;

  return (
    <div
      className={styles['snap-list']}
      role="region"
      aria-label={label}
    >
      <div className={styles['snap-list__header']}>
        <h2 className={styles['snap-list__title']}>{title}</h2>
        <span className={styles['snap-list__count']}>{count}</span>
      </div>

      <button
        type="button"
        className={arrowClass}
        aria-label="Itens anteriores"
        disabled={first === 0}
        onClick={() => scrollToIndex(first - 1)}
      >
        <ChevronUp size={20} aria-hidden />
      </button>

      <ul ref={ref} className={styles['snap-list__track']} tabIndex={overflow ? 0 : -1}>
        {items.map((item, i) => (
          <li key={getKey(item)} className={styles['snap-list__item']}>
            {renderItem(item, i, i === highlighted)}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={arrowClass}
        aria-label="Próximos itens"
        disabled={last >= total - 1}
        onClick={() => scrollToIndex(first + 1)}
      >
        <ChevronDown size={20} aria-hidden />
      </button>

      <div className={`${styles['snap-list__dots']} ${overflow ? styles['snap-list__dots--visible'] : ''}`} aria-hidden="true">
        {items.map((item, i) => (
          <span
            key={getKey(item)}
            className={`${styles['snap-list__dot']} ${i === state.index ? styles['snap-list__dot--active'] : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
