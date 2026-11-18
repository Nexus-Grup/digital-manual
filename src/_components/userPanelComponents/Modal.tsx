'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/Modal.module.css';

type Props = {
  label: string;
  onClose: () => void;
  children: ReactNode;
  /** true quando o conteúdo já tem card próprio (ex.: CreateUserForm) */
  bare?: boolean;
};

/** Montado só quando aberto: o estado interno nasce zerado a cada abertura. */
export function Modal({ label, onClose, children, bare = false }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    return () => el?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${bare ? styles.bare : ""}`}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault(); // Esc
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // clique no fundo
      }}
    >
      <div className={styles.inner}>
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          <X size={20} aria-hidden />
        </button>
        {children}
      </div>
    </dialog>
  );
}