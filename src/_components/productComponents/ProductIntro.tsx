'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronRight, X } from 'lucide-react';
import styles from '@/_styles/cssProductPage/ProductIntro.module.css';

export type IntroChip = { key: string; value: string; label: string };

type Props = {
  /** green tag above the title ("Informações", "Montagem") */
  tag: string;
  title: string;
  subtitle?: string | null;
  /** step progress bars + "Passo x de y" (assembly) */
  progress?: { current: number; total: number; stepName?: string };
  description: string;
  chips?: IntroChip[];
  /** heading of the "Ver mais" sheet */
  sheetTitle: string;
  /** extra content at the end of the sheet */
  sheetExtra?: ReactNode;
  /** primary action next to "Ver mais" ("Próximo passo") */
  action?: ReactNode;
};

function Chips({ chips, className }: { chips: IntroChip[]; className: string }) {
  return (
    <ul className={className} aria-label="Especificações">
      {chips.map((chip) => (
        <li key={chip.key} className={styles['intro__chip']}>
          <strong className={styles['intro__chip-value']}>{chip.value}</strong> {chip.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Text column of the product pages. The description is clamped so the page never scrolls;
 * "Ver mais" opens the full text in a bottom sheet (centered dialog on desktop).
 */
export default function ProductIntro({
  tag,
  title,
  subtitle,
  progress,
  description,
  chips = [],
  sheetTitle,
  sheetExtra,
  action,
}: Props) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [truncated, setTruncated] = useState(false);
  const sheetTitleId = useId();

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => setTruncated(el.scrollHeight > el.clientHeight + 1);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [description]);

  return (
    <div className={styles['intro']}>
      <span className={styles['intro__tag']}>{tag}</span>

      <div className={styles['intro__heading']}>
        {/* zero-width space after "/" lets long names ("Parafusadeira/Furadeira") wrap */}
        <h1 className={styles['intro__title']}>{title.split('/').join('/\u200B')}</h1>
        {subtitle && <p className={styles['intro__subtitle']}>{subtitle}</p>}
      </div>

      {progress && (
        <div className={styles['intro__progress']}>
          <div
            className={styles['intro__bars']}
            role="progressbar"
            aria-label="Progresso da montagem"
            aria-valuemin={1}
            aria-valuemax={progress.total}
            aria-valuenow={progress.current}
            aria-valuetext={`Passo ${progress.current} de ${progress.total}`}
          >
            {Array.from({ length: progress.total }, (_, i) => (
              <span
                key={i}
                className={`${styles['intro__bar']} ${i < progress.current ? styles['intro__bar--done'] : ''}`}
              />
            ))}
          </div>
          <p className={styles['intro__step']}>
            Passo {progress.current} de {progress.total}
            {progress.stepName && (
              <span className={styles['intro__step-name']}> · {progress.stepName}</span>
            )}
          </p>
        </div>
      )}

      {description && (
        <p ref={textRef} className={`${styles['intro__text']} ${progress ? styles['intro__text--steps'] : ''}`}>
          {description}
        </p>
      )}

      {chips.length > 0 && <Chips chips={chips} className={styles['intro__chips']} />}

      <div className={styles['intro__actions']}>
        <button
          type="button"
          className={`${styles['intro__more']} ${truncated ? styles['intro__more--visible'] : ''}`}
          aria-haspopup="dialog"
          onClick={() => dialogRef.current?.showModal()}
        >
          Ver mais
          <ChevronRight size={18} aria-hidden />
        </button>
        {action}
      </div>

      <dialog
        ref={dialogRef}
        className={styles['intro__sheet']}
        aria-labelledby={sheetTitleId}
        onClick={(e) => {
          // a click on the backdrop (the dialog itself, outside its content) closes it
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className={styles['intro__sheet-body']}>
          <span className={styles['intro__sheet-handle']} aria-hidden="true" />
          <div className={styles['intro__sheet-header']}>
            <h2 id={sheetTitleId} className={styles['intro__sheet-title']}>
              {sheetTitle}
            </h2>
            <form method="dialog">
              <button type="submit" className={styles['intro__sheet-close']} aria-label="Fechar">
                <X size={22} aria-hidden />
              </button>
            </form>
          </div>

          <div className={styles['intro__sheet-content']}>
            <p className={styles['intro__sheet-text']}>{description}</p>
            {chips.length > 0 && <Chips chips={chips} className={styles['intro__sheet-chips']} />}
            {sheetExtra}
          </div>

          <form method="dialog" className={styles['intro__sheet-footer']}>
            <button type="submit" className={styles['intro__sheet-ok']}>
              Entendi
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
