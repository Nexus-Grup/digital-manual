'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/_styles/cssUserPanelPage/products/Products.module.css';

/** Modal com <dialog> nativo (Esc fecha, foco preso). Vai para o <body>: pode ser aberto de dentro de um <form>. */
export function ProductModal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      className={`${styles.dialog} ${wide ? styles.dialogWide : ''}`}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.dialogBody}>{children}</div>
    </dialog>,
    document.body,
  );
}
