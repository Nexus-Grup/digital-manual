'use client';

import type { MouseEvent } from 'react';
import styles from '@/_styles/global/SkipLink.module.css';

/**
 * "Pular para o conteúdo" (WCAG 2.4.1): first Tab stop of every page, hidden until focused.
 * Moves focus to the page's <main id="conteudo"> (the #conteudo anchor also works without JS).
 */
export function SkipLink() {
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = document.querySelector('main');
    if (!main) return;
    event.preventDefault();
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    main.focus();
    main.scrollIntoView({ block: 'start' });
  };

  return (
    <a className={styles['skip-link']} href="#conteudo" onClick={skip}>
      Pular para o conteúdo
    </a>
  );
}
