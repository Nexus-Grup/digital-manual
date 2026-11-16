'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import styles from '@/_styles/cssProductPage/ContrastToggle.module.css';
import IconContraste from '@/_assets/image/hub icon/icone-contraste.svg';
import IconContrastehub from '@/_assets/image/hub icon/sun-moon 1.svg';

const KEY = 'contrast';
const EVENT = 'contrastchange';

type Mode = 'normal' | 'gray' | 'high';

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

const getSnapshot = (): Mode => {
  const v = document.documentElement.dataset.contrast;
  return v === 'high' || v === 'gray' ? v : 'normal';
};

function apply(mode: Mode) {
  if (mode === 'normal') delete document.documentElement.dataset.contrast;
  else document.documentElement.dataset.contrast = mode;
  window.dispatchEvent(new Event(EVENT));
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

type ContrastLabels = {
  trigger: string;
  group: string;
  normal: string;
  gray: string;
  high: string;
};

// pt-BR defaults (product pages); the landing page passes translated labels.
const DEFAULT_LABELS: ContrastLabels = {
  trigger: "Opções de contraste",
  group: "Modo de visualização",
  normal: "Padrão",
  gray: "Escala de cinza",
  high: "Alto contraste",
};

export default function ContrastToggle({ labels = DEFAULT_LABELS }: { labels?: ContrastLabels }) {
  const mode = useSyncExternalStore<Mode>(subscribe, getSnapshot, () => 'normal');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // ao abrir a página: usa a escolha salva; sem escolha, respeita o "alto contraste" do sistema
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'high' || saved === 'gray') apply(saved);
      else if (saved === null && window.matchMedia('(prefers-contrast: more)').matches) apply('high');
    } catch {
      /* localStorage bloqueado: segue sem salvar */
    }
  }, []);

  // menu aberto: clique fora ou ESC fecham
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // "Padrão" sempre volta ao normal; clicar na opção já ligada também volta ao normal
  const choose = (target: Mode) => {
    const next: Mode = target === 'normal' || mode === target ? 'normal' : target;
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignora */
    }
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        data-active={mode !== 'normal'}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={labels.trigger}
        title={labels.trigger}
        onClick={() => setOpen((v) => !v)}
      >
        <Image src={IconContrastehub} alt="" width={24} height={24} className={styles.triggerImg} />
      </button>

      {open && (
        <div id={menuId} className={styles.menu} role="group" aria-label={labels.group}>
          <button
            type="button"
            className={styles.item}
            aria-pressed={mode === 'normal'}
            onClick={() => choose('normal')}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
              strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="8" />
            </svg>
            <span className={styles.label}>{labels.normal}</span>
            {mode === 'normal' && <CheckIcon />}
          </button>

          <button
            type="button"
            className={styles.item}
            aria-pressed={mode === 'gray'}
            onClick={() => choose('gray')}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
            </svg>
            <span className={styles.label}>{labels.gray}</span>
            {mode === 'gray' && <CheckIcon />}
          </button>

          <button
            type="button"
            className={styles.item}
            aria-pressed={mode === 'high'}
            onClick={() => choose('high')}
          >
            <Image src={IconContraste} alt="" width={22} height={22} className={styles.itemImg} />
            <span className={styles.label}>{labels.high}</span>
            {mode === 'high' && <CheckIcon />}
          </button>
        </div>
      )}
    </div>
  );
}