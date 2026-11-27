'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keyboard behaviour for a floating panel opened by a trigger button (WCAG 2.1.1, 2.4.3):
 * - focus moves to the panel's first control when it opens or changes view;
 * - Esc closes it and returns focus to the trigger;
 * - tabbing out of the panel closes it;
 * - when it closes and focus would be lost (the clicked item was unmounted), focus returns to the trigger.
 */
export function usePopoverFocus({
  open,
  view,
  panelRef,
  triggerRef,
  onClose,
}: {
  open: boolean;
  /** Changes when the panel swaps its content (menu → form), to move focus again */
  view?: unknown;
  panelRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    // preventScroll: some panels close on scroll
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
  }, [open, view, panelRef]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      closeRef.current();
      trigger?.focus();
    };
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && !panel?.contains(next) && !trigger?.contains(next)) closeRef.current();
    };

    document.addEventListener('keydown', onKey);
    panel?.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('keydown', onKey);
      panel?.removeEventListener('focusout', onFocusOut);
      const active = document.activeElement;
      if ((!active || active === document.body) && trigger?.isConnected) trigger.focus();
    };
  }, [open, panelRef, triggerRef]);
}
