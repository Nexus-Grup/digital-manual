'use client';

import { useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import styles from '@/_styles/cssProductPage/Assembly.module.css';
import type { AssemblyStepItem } from '@/_data/getAssembly';
import ImagePlaceholder from './ImagePlaceholder';
import ScrollArrow from './ScrollArrow';

export default function AssemblyViewer({ steps }: { steps: AssemblyStepItem[] }) {
  const [current, setCurrent] = useState(0);
  const total = steps.length;
  const step = steps[current];

  const go = (index: number) => setCurrent(Math.min(Math.max(index, 0), total - 1));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      go(current + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      go(current - 1);
    }
  };

  return (
    <div
      className={styles['assembly__viewer']}
      role="group"
      aria-roledescription="carrossel"
      aria-label="Passos da montagem"
      onKeyDown={onKeyDown}
    >
      <div className={styles['assembly__stage']}>
        <figure className={styles['assembly__figure']}>
          {step.imageUrl ? (
            <Image
              className={styles['assembly__image']}
              src={step.imageUrl}
              alt={step.alt}
              fill
              sizes="(min-width: 1200px) 330px, (min-width: 768px) 50vw, 92vw"
              fetchPriority="high"
            />
          ) : (
            <ImagePlaceholder alt={step.alt} caption={`Desenho do passo ${step.label}`} />
          )}
          <span className={styles['assembly__badge']} aria-hidden="true">
            {step.label}
          </span>
        </figure>

        <div className={styles['assembly__progress']}>
          <div className={styles['assembly__bars']} aria-hidden="true">
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={`${styles['assembly__bar']} ${i === current ? styles['assembly__bar--active'] : ''}`}
              />
            ))}
          </div>
          <p className={styles['assembly__counter']} aria-live="polite">
            <span className={styles['assembly__sr-only']}>Passo </span>
            {current + 1} / {total}
          </p>
        </div>
      </div>

      <div className={styles['assembly__thumbs']}>
        <ScrollArrow
          direction="up"
          label="Passo anterior"
          disabled={current === 0}
          onClick={() => go(current - 1)}
        />

        <ul className={styles['assembly__thumb-list']}>
          {steps.map((s, i) => (
            <li key={s.id} className={styles['assembly__thumb-item']}>
              <button
                type="button"
                className={`${styles['assembly__thumb']} ${i === current ? styles['assembly__thumb--active'] : ''}`}
                aria-label={`Passo ${s.label}: ${s.title}`}
                aria-current={i === current ? 'step' : undefined}
                onClick={() => go(i)}
              >
                {s.imageUrl ? (
                  <Image
                    className={styles['assembly__image']}
                    src={s.imageUrl}
                    alt=""
                    fill
                    sizes="120px"
                  />
                ) : (
                  <ImagePlaceholder alt="" />
                )}
                <span
                  className={`${styles['assembly__badge']} ${styles['assembly__badge--small']}`}
                  aria-hidden="true"
                >
                  {s.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <ScrollArrow
          direction="down"
          label="Próximo passo"
          disabled={current === total - 1}
          onClick={() => go(current + 1)}
        />
      </div>
    </div>
  );
}
