'use client';

import { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';

type EventName = 'PRODUCT_VIEW' | 'LANDING_PAGE_VIEW' | 'MANUAL_VIEW' | 'MANUAL_DOWNLOAD' | 'GALLERY_VIEW';

// the same page in the same tab is counted once every 30 minutes (refreshes don't inflate the numbers)
const DEDUPE_MS = 30 * 60_000;

function send(productId: string, type: EventName, dedupeKey?: string) {
  if (dedupeKey) {
    try {
      const key = `md-ev:${productId}:${dedupeKey}`;
      const last = Number(sessionStorage.getItem(key) ?? 0);
      if (Date.now() - last < DEDUPE_MS) return;
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      // storage blocked: count anyway
    }
  }
  const url = `/api/products/${productId}/events`;
  const body = JSON.stringify({ type });
  // sendBeacon survives navigation and never delays the page; fetch keepalive as fallback
  if (!navigator.sendBeacon?.(url, new Blob([body], { type: 'application/json' }))) {
    fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
  }
}

/** Page of the product -> extra event besides PRODUCT_VIEW. */
function pageEvent(path: string): EventName | null {
  if (path.endsWith('/manual')) return 'MANUAL_VIEW';
  if (path.endsWith('/informacoes')) return 'GALLERY_VIEW';
  if (/\/produtos\/[^/]+$/.test(path)) return 'LANDING_PAGE_VIEW';
  return null;
}

/**
 * Counts the visits of the public product pages for the panel indicators (views, manual access,
 * PDF downloads). Renders nothing; QR scans are counted by the /qr route itself.
 */
export default function ProductTracker() {
  const { productId } = useParams<{ productId: string }>();
  const pathname = usePathname();

  // one view per page (client navigations between Início / Manual / Montagem included)
  useEffect(() => {
    if (!productId) return;
    send(productId, 'PRODUCT_VIEW', pathname);
    const extra = pageEvent(pathname);
    if (extra) send(productId, extra, `${pathname}:${extra}`);
  }, [productId, pathname]);

  // a click on any link to a PDF = manual download
  useEffect(() => {
    if (!productId) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]');
      if (link && /\.pdf(?:$|[?#])/i.test(link.getAttribute('href') ?? '')) send(productId, 'MANUAL_DOWNLOAD');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [productId]);

  return null;
}
