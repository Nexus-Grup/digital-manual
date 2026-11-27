import Link from 'next/link';
import styles from '@/_styles/cssUserPanelPage/UsageChart.module.css';
import type { TopProduct } from '@/lib/panelOverview';

const num = new Intl.NumberFormat('pt-BR');

/**
 * Horizontal bars (one series: accesses per product). The value is printed at the tip of each bar,
 * so it needs no tooltip; the list itself is the table view.
 */
export function ProductBars({ title, items, empty }: { title: string; items: TopProduct[]; empty: string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <figure className={styles['usage-chart']} aria-labelledby="product-bars-title">
      <figcaption className={styles['usage-chart__title']} id="product-bars-title">{title}</figcaption>
      {items.length ? (
        <ol className={styles['bar-chart']}>
          {items.map((p) => (
            <li key={p.id} className={styles['bar-chart__row']}>
              <Link className={styles['bar-chart__name']} href={`/painel/produtos/${p.id}`}>
                {p.name}
                <span className={styles['bar-chart__brand']}> · {p.brand}</span>
              </Link>
              <span className={styles['bar-chart__track']}>
                <span className={styles['bar-chart__bar']} style={{ width: `calc((100% - 56px) * ${p.count / max})` }} />
                <span className={styles['bar-chart__value']}>{num.format(p.count)}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles['usage-chart__empty-text']}>{empty}</p>
      )}
    </figure>
  );
}
