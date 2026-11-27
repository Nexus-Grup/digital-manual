import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/PanelEmptyState.module.css';

type Shortcut = { href: string; label: string };

type Props = {
  icon: LucideIcon;
  title: string;
  /** what this area will show */
  text: string;
  /** what the person can do right now instead */
  shortcuts: Shortcut[];
};

/**
 * Panel page whose feature is not built yet: says so clearly and points to what already works,
 * instead of an empty screen (Nielsen 1 — visibility of system status; 8 — no dead ends).
 */
export function PanelEmptyState({ icon: Icon, title, text, shortcuts }: Props) {
  return (
    <section className={styles['panel-empty']} aria-labelledby="panel-empty-title">
      <div className={styles['panel-empty__container']}>
        <span className={styles['panel-empty__icon']} aria-hidden="true">
          <Icon size={28} />
        </span>
        <div className={styles['panel-empty__heading']}>
          <p className={styles['panel-empty__tag']}>Em breve</p>
          <h1 className={styles['panel-empty__title']} id="panel-empty-title">{title}</h1>
          <p className={styles['panel-empty__text']}>{text}</p>
        </div>
        {shortcuts.length > 0 && (
          <nav className={styles['panel-empty__shortcuts']} aria-label="Enquanto isso, você pode">
            <p className={styles['panel-empty__shortcuts-title']}>Enquanto isso, você pode:</p>
            <ul className={styles['panel-empty__list']}>
              {shortcuts.map((s) => (
                <li key={s.href}>
                  <Link className={styles['panel-empty__link']} href={s.href}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
