'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type SnapState = {
  /** item whose center is closest to the track's center */
  index: number;
  /** first and last fully visible items */
  first: number;
  last: number;
  /** true when the track has more content than fits (shows arrows / dots) */
  overflow: boolean;
};

const INITIAL: SnapState = { index: 0, first: 0, last: 0, overflow: false };

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Tracks a scroll-snap track (horizontal or vertical, read from its flex-direction) and scrolls it
 * to an item. Only the track scrolls: it never moves the page (no scrollIntoView).
 */
export function useSnapTrack<T extends HTMLElement>(count: number) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<SnapState>(INITIAL);
  const frame = useRef(0);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    if (kids.length === 0) return;

    const vertical = getComputedStyle(el).flexDirection.startsWith('column');
    const pos = (k: HTMLElement) => (vertical ? k.offsetTop : k.offsetLeft);
    const len = (k: HTMLElement) => (vertical ? k.offsetHeight : k.offsetWidth);
    const start = vertical ? el.scrollTop : el.scrollLeft;
    const size = vertical ? el.clientHeight : el.clientWidth;
    const base = pos(kids[0]) - (vertical ? 0 : parseFloat(getComputedStyle(el).paddingLeft) || 0);
    const center = start + size / 2;

    let index = 0;
    let best = Infinity;
    let first = -1;
    let last = -1;
    kids.forEach((k, i) => {
      const from = pos(k) - base;
      const to = from + len(k);
      const distance = Math.abs(from + len(k) / 2 - center);
      if (distance < best) {
        best = distance;
        index = i;
      }
      if (from >= start - 2 && to <= start + size + 2) {
        if (first === -1) first = i;
        last = i;
      }
    });
    if (first === -1) first = last = index;

    const overflow = vertical ? el.scrollHeight > el.clientHeight + 1 : el.scrollWidth > el.clientWidth + 1;
    setState((s) =>
      s.index === index && s.first === first && s.last === last && s.overflow === overflow
        ? s
        : { index, first, last, overflow },
    );
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(measure);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    // first measure + re-measure when the layout switches (mobile row <-> desktop column) or an
    // item changes size (late web font, image), which changes the overflow without resizing the track
    const observer = new ResizeObserver(onScroll);
    observer.observe(el);
    Array.from(el.children).forEach((kid) => observer.observe(kid));
    return () => {
      el.removeEventListener('scroll', onScroll);
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [measure, count]);

  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const el = ref.current;
    const kid = el?.children[i] as HTMLElement | undefined;
    const firstKid = el?.children[0] as HTMLElement | undefined;
    if (!el || !kid || !firstKid) return;
    const vertical = getComputedStyle(el).flexDirection.startsWith('column');
    const behavior: ScrollBehavior = smooth && !reducedMotion() ? 'smooth' : 'auto';
    if (vertical) {
      el.scrollTo({ top: kid.offsetTop - firstKid.offsetTop, behavior });
    } else {
      // center the item (matches scroll-snap-align: center); the browser clamps at both ends
      const left = kid.offsetLeft - firstKid.offsetLeft - (el.clientWidth - kid.offsetWidth) / 2
        + (parseFloat(getComputedStyle(el).paddingLeft) || 0);
      el.scrollTo({ left, behavior });
    }
  }, []);

  return { ref, state, scrollToIndex };
}
