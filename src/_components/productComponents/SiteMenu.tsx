'use client';

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import styles from '@/_styles/cssProductPage/SiteMenu.module.css';
import IconHome from '@/_assets/image/hub icon/icone-inicio-black.svg';
import IconManual from '@/_assets/image/hub icon/icone-manual-black.svg';
import IconInformation from '@/_assets/image/hub icon/icone-informacao-black.svg';
import IconMontagem from '@/_assets/image/hub icon/icone-montagem-black.svg';

type Item = { group: string; label: string; href: string; icon: ReactNode };

// tira acento e maiúscula para a busca ("informacoes" acha "Informações")
const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const img = (src: typeof IconHome) => (
  <Image src={src} alt="" width={24} height={24} className={styles.itemImg} />
);

const gridIcon = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
  </svg>
);

export default function SiteMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { productId } = useParams<{ productId?: string }>();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const items: Item[] = useMemo(() => {
    const base = productId ? `/products/${productId}` : null;
    const list: Item[] = [];
    if (base) {
      list.push(
        { group: 'Neste produto', label: 'Início', href: base, icon: img(IconHome) },
        { group: 'Neste produto', label: 'Manual', href: `${base}/manual`, icon: img(IconManual) },
        { group: 'Neste produto', label: 'Informações', href: `${base}/information`, icon: img(IconInformation) },
        { group: 'Neste produto', label: 'Montagem', href: `${base}/assembly`, icon: img(IconMontagem) },
      );
    }
    list.push({ group: 'Geral', label: 'Todos os produtos', href: '/products', icon: gridIcon });
    // ideias para depois (descomente quando as rotas existirem):
    // { group: 'Geral', label: 'Ajuda e contato', href: '/help', icon: ... }
    return list;
  }, [productId]);

  const results = useMemo(() => {
    const q = norm(query);
    return q ? items.filter((i) => norm(i.label).includes(q)) : items;
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Item[]>();
    results.forEach((i) => map.set(i.group, [...(map.get(i.group) ?? []), i]));
    return [...map.entries()];
  }, [results]);

  const close = () => {
    setOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      // mantém o Tab dentro do menu
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // no celular não abre o teclado sozinho
    if (!window.matchMedia('(pointer: coarse)').matches) inputRef.current?.focus();
    else panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Enter na busca com um único resultado: vai direto
  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length === 1) {
      router.push(results[0].href);
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.backdrop} onClick={close} aria-hidden="true" />

          <div
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
          >
            <header className={styles.head}>
              <h2 id={titleId} className={styles.title}>Menu</h2>
              <button type="button" className={styles.close} onClick={close} aria-label="Fechar menu">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <div className={styles.search}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4 4" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                className={styles.input}
                placeholder="Buscar"
                aria-label="Buscar no menu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKey}
              />
            </div>

            <nav className={styles.nav} aria-label="Menu principal">
              {groups.map(([group, list]) => (
                <section key={group} className={styles.group}>
                  <h3 className={styles.groupTitle}>{group}</h3>
                  <ul className={styles.list}>
                    {list.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={styles.link}
                          aria-current={pathname === item.href ? 'page' : undefined}
                          onClick={() => {
                            setOpen(false);
                            setQuery('');
                          }}
                        >
                          {item.icon}
                          <span className={styles.label}>{item.label}</span>
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              {results.length === 0 && (
                <p className={styles.empty} role="status">
                  Nada encontrado para “{query}”. Tente outra palavra.
                </p>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}