'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { EllipsisVertical } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/products/Products.module.css';
import { usePopoverFocus } from '../utils_panel/usePopoverFocus';

/**
 * Botão de três pontinhos que abre um painel FLUTUANTE (position: fixed),
 * então não é cortado por listas com scroll. Mesmo padrão do CompanyUsers.
 * Teclado: o foco entra no painel ao abrir; Esc fecha e volta ao botão.
 */
export function KebabMenu({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  usePopoverFocus({ open, panelRef: panel, triggerRef: btn, onClose: () => setOpen(false) });

  function toggle() {
    if (open) return setOpen(false);
    const r = btn.current?.getBoundingClientRect();
    if (r) {
      const below = window.innerHeight - r.bottom;
      setPos({
        top: below < 200 ? Math.max(12, r.top - 160) : r.bottom + 6,
        right: Math.max(12, window.innerWidth - r.right),
      });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !btn.current?.contains(t)) setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btn}
        type="button"
        className={styles.kebab}
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={toggle}
      >
        <EllipsisVertical size={18} aria-hidden />
      </button>
      {open && (
        <div
          ref={panel}
          id={panelId}
          role="group"
          aria-label={label}
          className={styles.floatingPanel}
          style={{ top: pos.top, right: pos.right }}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </>
  );
}
