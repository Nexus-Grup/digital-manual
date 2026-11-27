'use client';

import { useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, RotateCcw } from 'lucide-react';
import styles from '@/_styles/cssProductPage/ProductView.module.css';
import introStyles from '@/_styles/cssProductPage/ProductIntro.module.css';
import type { ProductAssembly } from '@/_data/getAssembly';
import luccaCelebrate from '@/_assets/image/lucca/lucca-celebrate.png';
import MediaCarousel, { type MediaSlide } from './MediaCarousel';
import ProductIntro from './ProductIntro';
import SideCard from './SideCard';
import SnapList from './SnapList';

/**
 * Montagem: the step text, the drawing carousel and the steps list share the current step.
 * Renders the three cells of the product-view container.
 */
export default function AssemblyViewer({ assembly }: { assembly: ProductAssembly }) {
  const { steps } = assembly;
  const total = steps.length;
  // ?passo=B opens that step (links from the "Pergunte ao Lucca" chat)
  const wanted = useSearchParams().get('passo')?.toUpperCase();
  const indexOf = (label?: string) => Math.max(0, steps.findIndex((s) => s.label === label));
  const [current, setCurrent] = useState(() => indexOf(wanted));
  // a new ?passo= while already on this page (the viewer stays mounted): follow it
  const [prevWanted, setPrevWanted] = useState(wanted);
  if (wanted !== prevWanted) {
    setPrevWanted(wanted);
    if (wanted) setCurrent(indexOf(wanted));
  }
  const step = steps[current];
  const isLast = current === total - 1;

  const go = useCallback((i: number) => setCurrent(Math.min(Math.max(i, 0), total - 1)), [total]);

  const slides: MediaSlide[] = steps.map((s) => ({ id: s.id, src: s.imageUrl, alt: s.alt, badge: s.label }));

  return (
    <>
      <div className={styles['product-view__intro']}>
        <ProductIntro
          tag="Montagem"
          title={assembly.title}
          subtitle={assembly.productName}
          progress={{ current: current + 1, total, stepName: step.name }}
          description={step.description || assembly.description}
          sheetTitle={`Passo ${step.label}: ${step.name}`}
          sheetExtra={
            step.description && assembly.description ? (
              <p className={introStyles['intro__sheet-note']}>{assembly.description}</p>
            ) : null
          }
          action={
            <>
              {/* last step: Lucca celebrates next to "Recomeçar" */}
              {isLast && (
                <Image className={introStyles['intro__lucca']} src={luccaCelebrate} alt="" sizes="64px" />
              )}
              <button
                type="button"
                className={introStyles['intro__action']}
                onClick={() => go(isLast ? 0 : current + 1)}
              >
                {isLast ? 'Recomeçar' : 'Próximo passo'}
                {isLast ? <RotateCcw size={18} aria-hidden /> : <ArrowRight size={18} aria-hidden />}
              </button>
            </>
          }
        />
      </div>

      <div className={styles['product-view__media']}>
        <MediaCarousel
          slides={slides}
          label="Desenhos da montagem"
          index={current}
          onIndexChange={go}
          counterPrefix={(i) => steps[i]?.label ?? ''}
          zoomable
          tone="drawing"
        />
      </div>

      {/* steps list: inline on desktop and on tall screens (same rule as the information highlights) */}
      <div className={`${styles['product-view__aside']} ${styles['product-view__aside--when-fits']}`}>
        <SnapList
          title="Passos"
          label="Passos da montagem"
          items={steps}
          getKey={(s) => s.id}
          activeIndex={current}
          renderItem={(s, i, active) => (
            <SideCard
              variant="letter"
              leading={s.label}
              title={s.name}
              text={`Passo ${s.label}`}
              active={active}
              // no aria-label: the name is the visible text itself ("<name> Passo 1"), WCAG 2.5.3
              onSelect={() => go(i)}
            />
          )}
        />
      </div>
    </>
  );
}
