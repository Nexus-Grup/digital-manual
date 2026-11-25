'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, FileText, LayoutGrid, List, Package, Plus, Search, SlidersHorizontal } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/products/Products.module.css';
import { ALL_SUBCATEGORIES, CATEGORIES, SUBCATEGORIES, labelOf } from '@/_lib/productConstants';
import type { ListSummary, ProductListItem } from '@/_lib/productTypes';
import { KebabMenu } from './KebabMenu';
import { ProductDetailsModal } from './ProductDetailsModal';
import { formatDate } from './productApi';

const BASE = '/user-panel/products';

export type ListFilters = {
  brandId: string;
  category: string;
  subcategory: string;
  q: string;
  tab: 'all' | 'complete' | 'incomplete' | 'draft';
  view: 'overview' | 'list';
  page: number;
};

type Props = {
  items: ProductListItem[];
  total: number;
  pages: number;
  pageSize: number;
  summary: ListSummary;
  filters: ListFilters;
  brands: { id: number; name: string }[];
  canCreate: boolean;
};

export function ProductsList({ items, total, pages, pageSize, summary, filters, brands, canCreate }: Props) {
  const router = useRouter();
  const [details, setDetails] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(!!filters.subcategory);
  const [q, setQ] = useState(filters.q);
  const last = useRef(filters.q);

  function go(patch: Partial<Record<keyof ListFilters, string | number>>, keepPage = false) {
    const next = { ...filters, ...patch, ...(keepPage ? {} : { page: 1 }) } as Record<string, string | number>;
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (v === '' || v === undefined) continue;
      if ((k === 'tab' && v === 'all') || (k === 'view' && v === 'overview') || (k === 'page' && v === 1)) continue;
      sp.set(k, String(v));
    }
    router.push(sp.size ? `${BASE}?${sp}` : BASE);
  }

  // busca: espera 400 ms depois de digitar
  useEffect(() => {
    if (q === last.current) return;
    const t = setTimeout(() => {
      last.current = q;
      go({ q });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const isList = filters.view === 'list';
  const subOptions = filters.category ? (SUBCATEGORIES[filters.category] ?? []) : ALL_SUBCATEGORIES;
  const from = total === 0 ? 0 : (filters.page - 1) * pageSize + 1;
  const to = Math.min(filters.page * pageSize, total);

  const pill = (p: ProductListItem) =>
    p.status === 'DRAFT' ? { text: 'Draft', cls: styles.pillGray } : p.complete ? { text: 'Complete', cls: styles.pillGreen } : { text: 'Incomplete', cls: styles.pillYellow };

  const TABS: { key: ListFilters['tab']; label: string; n: number; cls: string }[] = [
    { key: 'all', label: 'All Products', n: summary.all, cls: styles.tabBlue },
    { key: 'complete', label: 'Complete', n: summary.complete, cls: styles.tabGreen },
    { key: 'incomplete', label: 'Incomplete', n: summary.incomplete, cls: styles.tabYellow },
    { key: 'draft', label: 'Draft', n: summary.draft, cls: styles.tabGray },
  ];

  return (
    <section className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.sub}>Add a new product to your brand</p>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <select className={styles.select} aria-label="Brand" value={filters.brandId} onChange={(e) => go({ brandId: e.target.value })}>
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select
            className={styles.select}
            aria-label="Category"
            value={filters.category}
            onChange={(e) => go({ category: e.target.value, subcategory: '' })}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {(showFilters || isList) && (
            <select className={styles.select} aria-label="Sub category" value={filters.subcategory} onChange={(e) => go({ subcategory: e.target.value })}>
              <option value="">All Sub Categories</option>
              {subOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )}
          <label className={styles.search}>
            <Search size={14} aria-hidden />
            <input type="search" placeholder="Search products ...." aria-label="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.pillBtn} aria-pressed={showFilters} onClick={() => setShowFilters((v) => !v)}>
            <SlidersHorizontal size={13} aria-hidden /> Filters
          </button>
          <button type="button" className={styles.pillBtn} onClick={() => go({ view: isList ? 'overview' : 'list' }, true)}>
            {isList ? <LayoutGrid size={13} aria-hidden /> : <List size={13} aria-hidden />} {isList ? 'Overview' : 'List'}
          </button>
          {canCreate && (
            <Link href={`${BASE}/new`} className={styles.pillBtn}>
              <Plus size={13} aria-hidden /> Add Product
            </Link>
          )}
        </div>
      </div>

      {!isList && (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryCard}><span className={styles.summaryLabel}>All Products</span><strong>{summary.all}</strong><small>Total products</small></div>
            <div className={styles.summaryCard}><span className={`${styles.summaryLabel} ${styles.green}`}>Published</span><strong>{summary.published}</strong><small>Ready to access</small></div>
            <div className={styles.summaryCard}><span className={`${styles.summaryLabel} ${styles.yellow}`}>Draft</span><strong>{summary.draft}</strong><small>Not published</small></div>
            <div className={styles.summaryCard}><span className={`${styles.summaryLabel} ${styles.gray}`}>Incomplete</span><strong>{summary.incomplete}</strong><small>Missing content</small></div>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Product status">
            {TABS.map((t) => (
              <button key={t.key} type="button" role="tab" aria-selected={filters.tab === t.key} className={`${styles.tab} ${t.cls}`} onClick={() => go({ tab: t.key })}>
                {t.label} · {t.n}
              </button>
            ))}
          </div>
        </>
      )}

      {items.length === 0 ? (
        <div className={styles.empty}>
          <Package size={28} aria-hidden />
          <p>No products found.</p>
        </div>
      ) : isList ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Company</th><th>Brand</th><th>Status</th><th>Updated</th><th>Edit</th></tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.prodCell}>
                      <span className={styles.thumb}>{p.imgUrl ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.imgUrl} alt="" /> : <Package size={16} aria-hidden />}</span>
                      <span><span className={styles.prodName}>{p.name}</span><small>{p.code}</small></span>
                    </div>
                  </td>
                  <td>{labelOf(CATEGORIES, p.category)}</td>
                  <td>{p.companyName}</td>
                  <td>{p.brandName}</td>
                  <td><span className={`${styles.pill} ${p.status === 'PUBLISHED' ? styles.pillGreen : styles.pillYellow}`}>{p.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span></td>
                  <td><time dateTime={p.updatedAt} suppressHydrationWarning>{formatDate(p.updatedAt)}</time></td>
                  <td><RowMenu p={p} onDetails={() => setDetails(p.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className={styles.cards}>
          {items.map((p) => {
            const s = pill(p);
            return (
              <li key={p.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardIcon}>{p.imgUrl ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.imgUrl} alt="" /> : <Package size={26} aria-hidden />}</span>
                  <div className={styles.cardText}><span className={styles.prodName}>{p.name}</span><small>{p.code}</small></div>
                  <RowMenu p={p} onDetails={() => setDetails(p.id)} />
                </div>
                <div className={styles.cardBottom}>
                  <span>{p.completion}% content completion</span>
                  <span className={`${styles.pill} ${s.cls}`}>{s.text}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <footer className={styles.pager}>
        <span>Showing {from}–{to} of {total} products</span>
        <div className={styles.pagerBtns}>
          <button type="button" aria-label="Previous page" disabled={filters.page <= 1} onClick={() => go({ page: filters.page - 1 }, true)}><ChevronLeft size={20} aria-hidden /></button>
          <button type="button" aria-label="Next page" disabled={filters.page >= pages} onClick={() => go({ page: filters.page + 1 }, true)}><ChevronRight size={20} aria-hidden /></button>
        </div>
      </footer>

      {details !== null && <ProductDetailsModal productId={details} onClose={() => setDetails(null)} />}
    </section>
  );
}

function RowMenu({ p, onDetails }: { p: ProductListItem; onDetails: () => void }) {
  return (
    <KebabMenu label={`Actions for ${p.name}`}>
      {(close) => (
        <>
          <button type="button" className={styles.panelItem} onClick={() => { close(); onDetails(); }}>
            <FileText size={14} aria-hidden /> View details
          </button>
          {p.canEdit && (
            <Link href={`${BASE}/${p.id}/edit`} className={styles.panelItem} onClick={close}>
              <Package size={14} aria-hidden /> Edit product
            </Link>
          )}
        </>
      )}
    </KebabMenu>
  );
}
