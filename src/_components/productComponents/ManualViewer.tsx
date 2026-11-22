'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import Image from 'next/image';
import styles from '@/_styles/cssProductPage/Manual.module.css';
import type { ManualBlock, ManualSection } from '@/_data/getManual';
import ImagePlaceholder from './ImagePlaceholder';
import { AlertIcon, ExternalFileIcon, LightbulbIcon, ListIcon, SearchIcon } from './TabIcons';

const FONT_SCALES = [0.9, 1, 1.15, 1.3] as const;
const MIN_QUERY = 2;

// ---------- search helpers ----------

// Lowercases and strips accents char by char, so indexes still match the original text.
function normalize(text: string): string {
  let out = '';
  for (const ch of text) {
    const base = ch.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    out += base.length === ch.length ? base : ch.toLowerCase();
  }
  return out;
}

function blockTexts(block: ManualBlock): string[] {
  switch (block.type) {
    case 'heading':
    case 'paragraph':
      return [block.text];
    case 'list':
    case 'steps':
      return block.items;
    case 'callout':
      return [block.title, block.text];
    case 'table':
      return [block.caption, ...block.headers, ...block.rows.flat()];
    case 'image':
      return [block.caption];
  }
}

function countMatches(text: string, query: string): number {
  if (!query) return 0;
  const norm = normalize(text);
  let count = 0;
  let i = norm.indexOf(query);
  while (i !== -1) {
    count += 1;
    i = norm.indexOf(query, i + query.length);
  }
  return count;
}

function snippet(texts: string[], query: string): string | null {
  for (const text of texts) {
    const i = normalize(text).indexOf(query);
    if (i === -1) continue;
    const start = Math.max(0, i - 30);
    const end = Math.min(text.length, i + query.length + 50);
    return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
  }
  return null;
}

/** Wraps every occurrence of `query` (already normalized) in <mark>. */
function highlight(text: string, query: string): ReactNode {
  if (query.length < MIN_QUERY) return text;
  const norm = normalize(text);
  const parts: ReactNode[] = [];
  let last = 0;
  let i = norm.indexOf(query);
  while (i !== -1) {
    if (i > last) parts.push(text.slice(last, i));
    parts.push(
      <mark key={i} className={styles['manual__mark']}>
        {text.slice(i, i + query.length)}
      </mark>,
    );
    last = i + query.length;
    i = norm.indexOf(query, last);
  }
  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ---------- blocks ----------

function Block({ block, query }: { block: ManualBlock; query: string }) {
  const hl = (text: string) => highlight(text, query);

  switch (block.type) {
    case 'heading':
      return <h3 className={styles['manual__subtitle']}>{hl(block.text)}</h3>;

    case 'paragraph':
      return <p className={styles['manual__text']}>{hl(block.text)}</p>;

    case 'list':
      return (
        <ul className={styles['manual__list']}>
          {block.items.map((item, i) => (
            <li key={i} className={styles['manual__list-item']}>{hl(item)}</li>
          ))}
        </ul>
      );

    case 'steps':
      return (
        <ol className={styles['manual__steps']}>
          {block.items.map((item, i) => (
            <li key={i} className={styles['manual__step']}>{hl(item)}</li>
          ))}
        </ol>
      );

    case 'callout': {
      const warning = block.tone === 'warning';
      return (
        <div
          role="note"
          className={`${styles['manual__callout']} ${warning ? styles['manual__callout--warning'] : styles['manual__callout--tip']}`}
        >
          <span className={styles['manual__callout-icon']} aria-hidden="true">
            {warning ? <AlertIcon /> : <LightbulbIcon />}
          </span>
          <p className={styles['manual__callout-text']}>
            <strong className={styles['manual__callout-title']}>{hl(block.title)}: </strong>
            {hl(block.text)}
          </p>
        </div>
      );
    }

    case 'table':
      return (
        // focusable so keyboard users can scroll wide tables on small screens
        <div className={styles['manual__table-wrap']} role="region" aria-label={block.caption} tabIndex={0}>
          <table className={styles['manual__table']}>
            <caption className={styles['manual__table-caption']}>{hl(block.caption)}</caption>
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th key={h} scope="col" className={styles['manual__th']}>{hl(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className={styles['manual__th']}>{hl(cell)}</th>
                    ) : (
                      <td key={c} className={styles['manual__td']}>{hl(cell)}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'image':
      return (
        <figure className={styles['manual__figure']}>
          <div className={styles['manual__figure-media']}>
            {block.imageUrl ? (
              <Image
                className={styles['manual__figure-image']}
                src={block.imageUrl}
                alt={block.alt}
                fill
                sizes="(min-width: 768px) 360px, 92vw"
              />
            ) : (
              <ImagePlaceholder alt={block.alt} caption="Ilustração do manual" />
            )}
          </div>
          <figcaption className={styles['manual__figcaption']}>{hl(block.caption)}</figcaption>
        </figure>
      );
  }
}

// ---------- viewer ----------

export default function ManualViewer({
  sections,
  pdfUrl,
}: {
  sections: ManualSection[];
  /** original PDF; enables the "see page N" link on each section */
  pdfUrl?: string | null;
}) {
  const [rawQuery, setRawQuery] = useState('');
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const [tocOpen, setTocOpen] = useState(false);
  const [scale, setScale] = useState(1); // index in FONT_SCALES
  const articleRef = useRef<HTMLElement>(null);

  const query = normalize(rawQuery.trim());
  const searching = query.length >= MIN_QUERY;

  const results = useMemo(() => {
    if (!searching) return [];
    return sections
      .map((s) => {
        const texts = [s.title, ...s.blocks.flatMap(blockTexts)];
        const count = texts.reduce((n, t) => n + countMatches(t, query), 0);
        return { id: s.id, title: s.title, count, snippet: snippet(texts, query) };
      })
      .filter((r) => r.count > 0);
  }, [sections, query, searching]);

  const total = results.reduce((n, r) => n + r.count, 0);

  // highlights the section being read in the table of contents
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '0px 0px -65% 0px' },
    );
    article.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // scrolls to the section and moves keyboard/screen reader focus to its heading
  const goTo = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    const heading = document.getElementById(`${id}-title`);
    if (!heading) return;
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    heading.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    heading.focus({ preventScroll: true });
    history.replaceState(null, '', `#${id}`);
    setActive(id);
    setTocOpen(false);
  };

  const articleStyle = { '--manual-scale': FONT_SCALES[scale] } as CSSProperties;

  return (
    <div className={styles['manual__layout']}>
      <aside className={styles['manual__aside']}>
        {/* ----- search ----- */}
        <div className={styles['manual__search']} role="search">
          <label className={styles['manual__search-label']} htmlFor="manual-search">
            Buscar no manual
          </label>
          <div className={styles['manual__search-field']}>
            <span className={styles['manual__search-icon']} aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              id="manual-search"
              className={styles['manual__search-input']}
              type="search"
              placeholder="Ex.: bateria, torque"
              autoComplete="off"
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              aria-describedby="manual-search-status"
            />
          </div>
          <p id="manual-search-status" className={styles['manual__search-status']} aria-live="polite">
            {searching &&
              (total > 0
                ? `${total} ${total === 1 ? 'resultado' : 'resultados'} em ${results.length} ${results.length === 1 ? 'seção' : 'seções'}`
                : 'Nenhum resultado. Tente outra palavra.')}
          </p>
          {results.length > 0 && (
            <ul className={styles['manual__results']} aria-label="Resultados da busca">
              {results.map((r) => (
                <li key={r.id} className={styles['manual__result-item']}>
                  <a className={styles['manual__result']} href={`#${r.id}`} onClick={goTo(r.id)}>
                    <span className={styles['manual__result-title']}>
                      {r.title} <span className={styles['manual__result-count']}>({r.count})</span>
                    </span>
                    {r.snippet && (
                      <span className={styles['manual__result-snippet']}>{highlight(r.snippet, query)}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ----- table of contents ----- */}
        <button
          type="button"
          className={styles['manual__toc-toggle']}
          aria-expanded={tocOpen}
          aria-controls="manual-toc"
          onClick={() => setTocOpen((open) => !open)}
        >
          <ListIcon />
          {tocOpen ? 'Fechar sumário' : 'Ver sumário'}
        </button>
        <nav
          id="manual-toc"
          className={`${styles['manual__toc']} ${tocOpen ? styles['manual__toc--open'] : ''}`}
          aria-label="Sumário do manual"
        >
          <p className={styles['manual__toc-title']} aria-hidden="true">Sumário</p>
          <ol className={styles['manual__toc-list']}>
            {sections.map((s, i) => (
              <li key={s.id} className={styles['manual__toc-item']}>
                <a
                  className={`${styles['manual__toc-link']} ${active === s.id ? styles['manual__toc-link--active'] : ''}`}
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'location' : undefined}
                  onClick={goTo(s.id)}
                >
                  <span className={styles['manual__toc-number']}>{i + 1}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <div className={styles['manual__main']}>
        {/* ----- text size ----- */}
        <div className={styles['manual__toolbar']} role="group" aria-label="Tamanho do texto">
          <span className={styles['manual__toolbar-label']} aria-hidden="true">Tamanho do texto</span>
          <button
            type="button"
            className={styles['manual__tool']}
            aria-label="Diminuir texto"
            disabled={scale === 0}
            onClick={() => setScale((s) => Math.max(0, s - 1))}
          >
            A−
          </button>
          <output className={styles['manual__tool-value']} aria-live="polite" aria-label="Tamanho atual">
            {Math.round(FONT_SCALES[scale] * 100)}%
          </output>
          <button
            type="button"
            className={styles['manual__tool']}
            aria-label="Aumentar texto"
            disabled={scale === FONT_SCALES.length - 1}
            onClick={() => setScale((s) => Math.min(FONT_SCALES.length - 1, s + 1))}
          >
            A+
          </button>
        </div>

        <article ref={articleRef} className={styles['manual__article']} style={articleStyle}>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className={styles['manual__section']} aria-labelledby={`${s.id}-title`}>
              <div className={styles['manual__section-head']}>
                <h2 id={`${s.id}-title`} className={styles['manual__section-title']} tabIndex={-1}>
                  <span className={styles['manual__section-number']}>{i + 1}.</span> {highlight(s.title, query)}
                </h2>
                {/* figures stay in the original: link straight to the page (#page=N works in browser PDF viewers) */}
                {pdfUrl && s.page && (
                  <a
                    className={styles['manual__page-link']}
                    href={`${pdfUrl}#page=${s.page}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalFileIcon size={16} />
                    Ver no PDF original (página {s.page})
                    <span className={styles['manual__sr-only']}> — abre em nova aba</span>
                  </a>
                )}
              </div>
              <div className={styles['manual__blocks']}>
                {s.blocks.map((block, b) => (
                  <Block key={b} block={block} query={searching ? query : ''} />
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
