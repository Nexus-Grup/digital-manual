import styles from '@/_styles/cssProductPage/ScrollArrow.module.css';
import { ChevronIcon } from './TabIcons';

type Props = {
  direction: 'up' | 'down';
  label: string;
  disabled?: boolean;
  controls?: string;
  onClick: () => void;
};

// Up/down control for the right-hand columns (feature cards, assembly thumbnails). Desktop only.
export default function ScrollArrow({ direction, label, disabled, controls, onClick }: Props) {
  return (
    <button
      type="button"
      className={styles['scroll-arrow']}
      aria-label={label}
      aria-controls={controls}
      disabled={disabled}
      onClick={onClick}
    >
      <ChevronIcon direction={direction} size={20} />
    </button>
  );
}
