'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, ClipboardCheck, FileText, Images, Package, QrCode, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import { STEPS } from '@/_lib/productConstants';
import type { BrandOption, ProductFull, Progress, StepKey } from '@/_lib/productTypes';
import { api } from './productApi';
import { StepBasic } from './steps/StepBasic';
import { StepMedia } from './steps/StepMedia';
import { StepTechnical } from './steps/StepTechnical';
import { StepManuals } from './steps/StepManuals';
import { StepGuides } from './steps/StepGuides';
import { StepQr } from './steps/StepQr';
import { StepReview } from './steps/StepReview';
import type { StepHandle } from './steps/stepTypes';

const BASE = '/painel/produtos';

const HINTS: Record<number, string> = {
  1: 'Preencha as informações principais do seu produto.',
  2: 'Adicione imagens e mídias para apresentar seu produto.',
  3: 'Adicione as especificações técnicas e os detalhes do produto.',
  4: 'Envie e organize a documentação do seu produto.',
  5: 'Crie informações úteis sobre o produto e guias passo a passo.',
  6: 'Gere QR Codes para dar acesso direto ao seu produto.',
  7: 'Revise as informações abaixo antes de salvar seu produto.',
};
const ICONS = [Package, Images, FileText, BookOpen, Wrench, QrCode, ClipboardCheck];
const STEP_KEY: Record<number, StepKey> = { 2: 'media', 3: 'technical', 4: 'manuals', 5: 'guides', 6: 'qr' };

type Props = { product: ProductFull | null; brands: BrandOption[]; initialStep: number };

export function ProductWizard({ product: initial, brands, initialStep }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductFull | null>(initial);
  const [progress, setProgress] = useState<Progress | null>(initial?.progress ?? null);
  const [step, setStep] = useState(initial ? initialStep : 1);
  const [busy, setBusy] = useState(false);

  // um ref por etapa (a etapa 7, revisão, não tem ref)
  const r1 = useRef<StepHandle>(null);
  const r2 = useRef<StepHandle>(null);
  const r3 = useRef<StepHandle>(null);
  const r4 = useRef<StepHandle>(null);
  const r5 = useRef<StepHandle>(null);
  const r6 = useRef<StepHandle>(null);

  const goTo = (n: number) => {
    setStep(Math.min(Math.max(n, 1), 7));
    window.scrollTo?.({ top: 0 });
  };

  // a revisão mostra os números atuais: busca o produto de novo ao abrir a etapa 7
  useEffect(() => {
    if (step !== 7 || !product) return;
    let alive = true;
    api<{ product: ProductFull }>(`/api/products/${product.id}`).then((r) => {
      if (alive && r.ok) { setProduct(r.data.product); setProgress(r.data.product.progress); }
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function saveAndContinue() {
    // os refs só são lidos aqui, dentro de um handler (fora do render)
    const refs = [null, r1, r2, r3, r4, r5, r6];
    const handle = refs[step]?.current;

    setBusy(true);
    const ok = await handle?.save();
    setBusy(false);
    if (ok && product) goTo(step + 1); // sem produto, a etapa 1 já leva para a edição (onCreated)
  }

  function finish() {
    toast.success('Produto salvo.');
    router.push(BASE);
    router.refresh();
  }

  const isDone = (n: number) => (n === 1 ? !!product : n === 7 ? false : !!progress?.steps[STEP_KEY[n]]);
  const Icon = ICONS[step - 1];
  const stepInfo = STEPS[step - 1];
  const pct = progress?.completion ?? 0;

  const stepProps = product ? { product, onProgress: setProgress } : null;

  return (
    <section className={styles.page}>
      <header className={styles.head}>
        <h1 className={styles.title}>{product ? 'Editar produto' : 'Criar produto'}</h1>
        <p className={styles.sub}>{product ? product.name : 'Adicione um novo produto à sua marca'}</p>
      </header>

      <p className={styles.lead}>Conclua as etapas para configurar seu produto</p>
      <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Conteúdo preenchido">
        <span style={{ width: `${Math.max(pct, 3)}%` }} />
      </div>

      <div className={styles.layout}>
        {/* ---------- cartão (só o miolo rola; cabeçalho e rodapé ficam fixos) ---------- */}
        <div className={styles.card}>
          <header className={styles.cardHead}>
            <span className={styles.badgeNum}>{String(step).padStart(2, '0')}</span>
            <div><h2>{stepInfo.title}</h2><p>{stepInfo.sub}</p></div>
            <Icon size={30} className={styles.cardIcon} aria-hidden />
          </header>

          <div className={styles.content}>
            <div hidden={step !== 1}>
              <StepBasic
                ref={r1}
                product={product}
                brands={brands}
                onProgress={setProgress}
                onCreated={(id) => router.replace(`${BASE}/${id}/editar?etapa=2`)}
              />
            </div>
            {stepProps && (
              <>
                <div hidden={step !== 2}><StepMedia ref={r2} {...stepProps} /></div>
                <div hidden={step !== 3}><StepTechnical ref={r3} {...stepProps} /></div>
                <div hidden={step !== 4}><StepManuals ref={r4} {...stepProps} /></div>
                <div hidden={step !== 5}><StepGuides ref={r5} {...stepProps} /></div>
                <div hidden={step !== 6}><StepQr ref={r6} {...stepProps} /></div>
                {step === 7 && <StepReview product={product!} />}
              </>
            )}
          </div>

          <footer className={styles.cardFoot}>
            <span>{HINTS[step]}</span>
            <div className={styles.footBtns}>
              {step === 7 ? (
                <>
                  <button type="button" className={styles.pillBtn} onClick={() => goTo(6)}>Voltar</button>
                  <button type="button" className={styles.primaryBtn} onClick={finish}>Concluir e salvar produto <ArrowRight size={14} aria-hidden /></button>
                </>
              ) : (
                <>
                  {product && <button type="button" className={styles.pillBtn} onClick={() => goTo(step + 1)} disabled={busy}>Pular por enquanto</button>}
                  <button type="button" className={styles.primaryBtn} onClick={saveAndContinue} disabled={busy}>
                    {busy ? 'Salvando...' : <>Salvar e continuar <ArrowRight size={14} aria-hidden /></>}
                  </button>
                </>
              )}
            </div>
          </footer>
        </div>

        {/* ---------- etapas (fixas) ---------- */}
        <nav className={styles.steps} aria-label="Etapas">
          <ol>
            {STEPS.map((s) => (
              <li key={s.n}>
                <button
                  type="button"
                  className={`${styles.stepBtn} ${s.n === step ? styles.stepCurrent : ''} ${isDone(s.n) ? styles.stepDone : ''}`}
                  aria-current={s.n === step ? 'step' : undefined}
                  disabled={!product && s.n > 1}
                  onClick={() => goTo(s.n)}
                >
                  <span className={styles.stepNumber}>{String(s.n).padStart(2, '0')}</span>
                  <span className={styles.stepText}><strong>{s.title}</strong><small>{s.sub}</small></span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}