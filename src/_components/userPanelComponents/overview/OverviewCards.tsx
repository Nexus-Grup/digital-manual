import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowDownRight, ArrowUpRight, Package, type LucideIcon } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/Overview.module.css';
import { change, type CatalogStats, type TopProduct, type Usage, type UsageKey } from '@/lib/panelOverview';

const num = new Intl.NumberFormat('pt-BR');

// only public Supabase Storage URLs go through next/image (next.config remotePatterns)
const optimizable = (src: string) => /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(src);

/** Small square picture (product photo / brand logo); the icon when there is none. */
export function Thumb({ src, icon: Icon = Package }: { src: string | null; icon?: LucideIcon }) {
  if (!src) {
    return (
      <span className={styles['thumb']} aria-hidden="true">
        <Icon size={20} />
      </span>
    );
  }
  return (
    <span className={styles['thumb']}>
      {optimizable(src) ? (
        <Image className={styles['thumb__image']} src={src} alt="" fill sizes="44px" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles['thumb__image']} src={src} alt="" loading="lazy" />
      )}
    </span>
  );
}

// ---------------------------------------------------------------- headline numbers
export type StatItem = { label: string; value: number | string; hint: string; icon: LucideIcon; href?: string };

export function StatCards({ items, label }: { items: StatItem[]; label: string }) {
  return (
    <ul className={styles['stat-grid']} aria-label={label}>
      {items.map(({ label: l, value, hint, icon: Icon, href }) => {
        const body = (
          <>
            <span className={styles['stat__top']}>
              <span className={styles['stat__label']}>{l}</span>
              <Icon className={styles['stat__icon']} size={18} aria-hidden />
            </span>
            <span className={styles['stat__value']}>{typeof value === 'number' ? num.format(value) : value}</span>
            <span className={styles['stat__hint']}>{hint}</span>
          </>
        );
        return (
          <li key={l} className={styles['stat-grid__item']}>
            {href ? (
              <Link className={`${styles['stat']} ${styles['stat--link']}`} href={href}>{body}</Link>
            ) : (
              <div className={styles['stat']}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------- usage in the period
const USAGE_LABELS: Record<UsageKey, { label: string; hint: string }> = {
  qrScans: { label: 'Leituras de QR Code', hint: 'QR Codes escaneados nas embalagens' },
  views: { label: 'Visualizações', hint: 'Páginas de produto abertas' },
  landingViews: { label: 'Acessos à página inicial', hint: 'Início do manual digital' },
  manualViews: { label: 'Acessos ao manual', hint: 'Leituras da página do manual' },
  downloads: { label: 'Downloads do PDF', hint: 'Manuais originais baixados' },
};

export function UsageCards({ usage, days, keys }: { usage: Usage; days: number; keys: UsageKey[] }) {
  return (
    <ul className={styles['stat-grid']} aria-label={`Uso nos últimos ${days} dias`}>
      {keys.map((k) => {
        const delta = change(usage[k]);
        const up = delta !== null && delta >= 0;
        return (
          <li key={k} className={styles['stat-grid__item']}>
            <div className={styles['stat']}>
              <span className={styles['stat__label']}>{USAGE_LABELS[k].label}</span>
              <span className={styles['stat__value']}>{num.format(usage[k].value)}</span>
              <span className={styles['stat__hint']}>
                {delta === null ? (
                  USAGE_LABELS[k].hint
                ) : (
                  <span className={`${styles['delta']} ${up ? styles['delta--up'] : styles['delta--down']}`}>
                    {up ? <ArrowUpRight size={14} aria-hidden /> : <ArrowDownRight size={14} aria-hidden />}
                    {up ? '+' : ''}{delta}%
                    <span className={styles['delta__text']}> em relação aos {days} dias anteriores</span>
                  </span>
                )}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------- most accessed products
export function TopProducts({ items, days }: { items: TopProduct[]; days: number }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <section className={styles['panel-card']} aria-labelledby="top-products-title">
      <h2 className={styles['panel-card__title']} id="top-products-title">Produtos mais acessados</h2>
      {items.length ? (
        <ol className={styles['rank']}>
          {items.map((p, i) => (
            <li key={p.id} className={styles['rank__item']}>
              <Thumb src={p.imgUrl} />
              <span className={styles['rank__body']}>
                <span className={styles['rank__head']}>
                  <Link className={styles['rank__name']} href={`/painel/produtos/${p.id}`}>{p.name}</Link>
                  <span className={styles['rank__position']} aria-label={`${i + 1}º lugar`}>{i + 1}º</span>
                </span>
                <span className={styles['rank__meta']}>{p.brand} · {num.format(p.count)} acessos</span>
                <span className={styles['bar']} aria-hidden="true">
                  <span className={styles['bar__fill']} style={{ transform: `scaleX(${p.count / max})` }} />
                </span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles['panel-card__empty']}>
          Ainda não há acessos nos últimos {days} dias. Os números aparecem quando alguém escaneia um QR Code ou abre um manual publicado.
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- content completion
export function ContentCoverage({ stats }: { stats: CatalogStats }) {
  return (
    <section className={styles['panel-card']} aria-labelledby="coverage-title">
      <div className={styles['panel-card__head']}>
        <h2 className={styles['panel-card__title']} id="coverage-title">Conteúdo dos produtos</h2>
        <span className={styles['panel-card__badge']}>{stats.avgCompletion}% em média</span>
      </div>
      {stats.products ? (
        <ul className={styles['coverage']}>
          {stats.coverage.map((c) => (
            <li key={c.key} className={styles['coverage__item']}>
              <span className={styles['coverage__head']}>
                <span>{c.label}</span>
                <span className={styles['coverage__value']}>{c.percent}%</span>
              </span>
              <span
                className={styles['bar']}
                role="progressbar"
                aria-label={`${c.label}: ${c.percent}% dos produtos`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={c.percent}
              >
                <span className={styles['bar__fill']} style={{ transform: `scaleX(${c.percent / 100})` }} />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles['panel-card__empty']}>Nenhum produto cadastrado ainda.</p>
      )}
    </section>
  );
}

export function ToComplete({ stats }: { stats: CatalogStats }) {
  return (
    <section className={styles['panel-card']} aria-labelledby="to-complete-title">
      <h2 className={styles['panel-card__title']} id="to-complete-title">Para completar primeiro</h2>
      {stats.toComplete.length ? (
        <ul className={styles['todo']}>
          {stats.toComplete.map((p) => (
            <li key={p.id} className={styles['todo__item']}>
              <span className={styles['todo__body']}>
                <span className={styles['todo__name']}>{p.name}</span>
                <span className={styles['todo__meta']}>{p.brand} · falta: {p.missing.join(', ')}</span>
              </span>
              <span className={styles['todo__percent']}>{p.completion}%</span>
              <Link className={styles['todo__link']} href={`/painel/produtos/${p.id}/editar`} aria-label={`Completar ${p.name}`}>
                <ArrowRight size={18} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles['panel-card__empty']}>
          {stats.products ? 'Todos os produtos estão com o conteúdo completo.' : 'Nenhum produto cadastrado ainda.'}
        </p>
      )}
    </section>
  );
}
