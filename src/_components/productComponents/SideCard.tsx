import type { ReactNode } from 'react';
import styles from '@/_styles/cssProductPage/SideCard.module.css';

type Props = {
  /** icon (highlights) or step letter (assembly) */
  leading: ReactNode;
  variant: 'icon' | 'letter';
  title: string;
  text?: string | null;
  active?: boolean;
  /** makes the card a button (assembly steps) */
  onSelect?: () => void;
  /** a11y label for the button version */
  ariaLabel?: string;
  /** show the whole text (no line clamp), e.g. inside the highlights sheet */
  full?: boolean;
};

// Card of the side column: highlights (Informações) and steps (Montagem).
export default function SideCard({ leading, variant, title, text, active, onSelect, ariaLabel, full }: Props) {
  const className = `${styles['side-card']} ${active ? styles['side-card--active'] : ''} ${onSelect ? styles['side-card--button'] : ''} ${full ? styles['side-card--full'] : ''}`;
  const content = (
    <>
      <span className={`${styles['side-card__lead']} ${styles[`side-card__lead--${variant}`]}`} aria-hidden="true">
        {leading}
      </span>
      <span className={styles['side-card__content']}>
        <span className={`${styles['side-card__title']} ${full ? styles['side-card__title--full'] : ''}`}>{title}</span>
        {text && <span className={`${styles['side-card__text']} ${full ? styles['side-card__text--full'] : ''}`}>{text}</span>}
      </span>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        aria-current={active ? 'step' : undefined}
        onClick={onSelect}
      >
        {content}
      </button>
    );
  }
  return <article className={className}>{content}</article>;
}
