'use client';

import { useId, useRef } from 'react';
import { LayoutList, X } from 'lucide-react';
import styles from '@/_styles/cssProductPage/ProductIntro.module.css';
import type { Highlight } from './HighlightList';
import { highlightIcon } from './highlightIcons';
import SideCard from './SideCard';

/**
 * Mobile/tablet: the highlight cards don't fit next to the photos, so they open in a bottom sheet.
 * Hidden on desktop, where the side column shows them.
 */
export default function HighlightsSheet({ cards }: { cards: Highlight[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        className={`${styles['intro__secondary']} ${styles['intro__secondary--compact']}`}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <LayoutList size={18} aria-hidden />
        Destaques
        <span className={styles['intro__count']}>{cards.length}</span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles['intro__sheet']}
        aria-labelledby={titleId}
        onClick={(e) => {
          // a click on the backdrop (the dialog itself, outside its content) closes it
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className={styles['intro__sheet-body']}>
          <span className={styles['intro__sheet-handle']} aria-hidden="true" />
          <div className={styles['intro__sheet-header']}>
            <h2 id={titleId} className={styles['intro__sheet-title']}>
              Destaques da ferramenta
            </h2>
            <form method="dialog">
              <button type="submit" className={styles['intro__sheet-close']} aria-label="Fechar">
                <X size={22} aria-hidden />
              </button>
            </form>
          </div>

          <ul className={`${styles['intro__sheet-content']} ${styles['intro__sheet-list']}`}>
            {cards.map((card) => {
              const Icon = highlightIcon(card.icon);
              return (
                <li key={card.id}>
                  <SideCard variant="icon" leading={<Icon size={22} />} title={card.title} text={card.description} full />
                </li>
              );
            })}
          </ul>

          <form method="dialog" className={styles['intro__sheet-footer']}>
            <button type="submit" className={styles['intro__sheet-ok']}>
              Entendi
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
