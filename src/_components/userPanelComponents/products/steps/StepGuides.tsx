'use client';

import { useId, useImperativeHandle, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import { ASSEMBLY_TYPES, INFO_ICONS, labelOf } from '@/_lib/productConstants';
import type { AssemblyDTO, GuideStepDTO, InfoCardDTO, Progress } from '@/_lib/productTypes';
import { UploadBox } from '../UploadBox';
import { InfoIcon } from '../infoIcons';
import { api } from '../productApi';
import type { StepProps } from './stepTypes';

const EMPTY_STEP = { title: '', description: '', imageUrl: null as string | null };

export function StepGuides({ product, onProgress, ref }: StepProps) {
  const uid = useId();
  const productName = (product as { name?: string }).name;

  /* ---------- informações ---------- */
  const [infoTitle, setInfoTitle] = useState(product.information?.title ?? '');
  const [infoDesc, setInfoDesc] = useState(product.information?.description ?? '');
  const [cards, setCards] = useState<InfoCardDTO[]>(product.information?.cards ?? []);
  const [card, setCard] = useState({ title: '', icon: '', description: '' });

  function addCard(list = cards) {
    if (!card.title.trim() || !card.description.trim()) {
      toast.error(!card.title.trim() ? 'Digite o título do card' : 'Digite a descrição do card');
      document.getElementById(`${uid}-${!card.title.trim() ? 'ct' : 'cd'}`)?.focus();
      return null;
    }
    const next = [...list, { title: card.title.trim(), icon: card.icon || null, description: card.description.trim() || null }];
    setCards(next);
    setCard({ title: '', icon: '', description: '' });
    return next;
  }

  /* ---------- guia de montagem (um formulário só, como no Figma) ---------- */
  const first = product.assemblies[0];
  // guias além do primeiro (se já existirem salvos) são preservados ao salvar
  const [extraGuides] = useState<AssemblyDTO[]>(product.assemblies.slice(1));
  const [guide, setGuide] = useState({
    title: first?.title ?? '',
    type: first?.type ?? '',
    description: first?.description ?? '',
    imageUrl: (first?.imageUrl ?? null) as string | null,
  });
  const [steps, setSteps] = useState<GuideStepDTO[]>(first?.steps ?? []);
  const [step, setStep] = useState(EMPTY_STEP);

  function addStep(list = steps) {
    // the Montagem page shows each step's text and drawing
    const missing = !step.title.trim() ? 'st' : !step.description.trim() ? 'sd' : !step.imageUrl ? 'si' : null;
    if (missing) {
      toast.error(missing === 'st' ? 'Digite o título do passo' : missing === 'sd' ? 'Digite a descrição do passo' : 'Envie a imagem do passo');
      document.getElementById(`${uid}-${missing}`)?.focus();
      return null;
    }
    const next = [...list, { title: step.title.trim(), description: step.description.trim() || null, imageUrl: step.imageUrl }];
    setSteps(next);
    setStep(EMPTY_STEP);
    return next;
  }

  async function save() {
    let c = cards;
    if (card.title.trim() || card.description.trim()) { const n = addCard(); if (!n) return false; c = n; }
    if (!infoTitle.trim() && (c.length > 0 || infoDesc.trim())) {
      toast.error('Digite o título da informação');
      document.getElementById(`${uid}-it`)?.focus();
      return false;
    }

    let assemblies: AssemblyDTO[] = extraGuides;
    const hasGuide = guide.title.trim() || guide.type || guide.description.trim() || guide.imageUrl || steps.length > 0 || step.title.trim();
    if (hasGuide) {
      if (guide.title.trim().length < 2 || !guide.type) {
        toast.error('Digite o título do guia e escolha o tipo');
        document.getElementById(`${uid}-gt`)?.focus();
        return false;
      }
      let s = steps;
      if (step.title.trim() || step.description.trim() || step.imageUrl) { const n = addStep(); if (!n) return false; s = n; }
      if (s.length === 0) {
        toast.error('Adicione pelo menos um passo ao guia: sem passos, a página Montagem não aparece');
        document.getElementById(`${uid}-st`)?.focus();
        return false;
      }
      assemblies = [
        { title: guide.title.trim(), type: guide.type, description: guide.description.trim() || null, imageUrl: guide.imageUrl, steps: s },
        ...extraGuides,
      ];
    }

    const r = await api<{ progress: Progress }>(`/api/products/${product.id}/guides`, 'PUT', {
      information: infoTitle.trim() ? { title: infoTitle, description: infoDesc, cards: c } : null,
      assemblies,
    });
    if (!r.ok) return void toast.error(r.error), false;
    onProgress(r.data.progress);
    toast.success('Guias e conteúdo do produto salvos.');
    return true;
  }

  useImperativeHandle(ref, () => ({ save }));

  return (
    <div className={styles.stack}>
      <p className={styles.requiredNote}>
        Informação e Guia de montagem são opcionais. Ao preencher um deles, os campos com * passam a ser obrigatórios, para a página do produto não ficar com informação faltando.
      </p>

      {/* ---------- Information ---------- */}
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>Informação</h3>
        <span className={styles.count}>{cards.length} {cards.length === 1 ? 'card' : 'cards'}</span>
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-it`}>Título da informação *</label>
        <input id={`${uid}-it`} className={styles.input} placeholder="ex.: Parafusadeira GRT 120-CLI" value={infoTitle} maxLength={160} onChange={(e) => setInfoTitle(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-id`}>Descrição</label>
        <textarea id={`${uid}-id`} className={styles.textarea} placeholder="Descreva o produto..." value={infoDesc} maxLength={2000} onChange={(e) => setInfoDesc(e.target.value)} />
      </div>

      <div className={styles.sectionHead}>
        <span className={styles.label}>Card de informação</span>
      </div>
      <div className={styles.builder}>
        <div className={styles.field}><label htmlFor={`${uid}-ct`}>Título do card *</label><input id={`${uid}-ct`} className={styles.input} placeholder="ex.: design compacto" value={card.title} maxLength={120} onChange={(e) => setCard({ ...card, title: e.target.value })} /></div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-ci`}>Ícone</label>
          <select id={`${uid}-ci`} className={styles.select} value={card.icon} onChange={(e) => setCard({ ...card, icon: e.target.value })}>
            <option value="">Selecione o ícone</option>
            {INFO_ICONS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </div>
        <div className={styles.field}><label htmlFor={`${uid}-cd`}>Descrição do card *</label><textarea id={`${uid}-cd`} className={styles.textarea} placeholder="Descreva o card..." value={card.description} maxLength={500} onChange={(e) => setCard({ ...card, description: e.target.value })} /></div>
        <div className={styles.builderActions}><button type="button" className={styles.pillBtn} onClick={() => addCard()}><Plus size={13} aria-hidden /> Adicionar</button></div>
        {cards.length > 0 && (
          <section className={styles.addedList} aria-label="Cards adicionados">
            <h4 className={styles.addedTitle}>Cards adicionados</h4>
            <ul>
              {cards.map((c, i) => (
                <li key={i}>
                  <InfoIcon name={c.icon} size={24} />
                  <span className={styles.addedText}><span>{c.title}</span>{c.description && <small>{c.description}</small>}</span>
                  <span className={styles.num} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <button type="button" className={styles.iconBtn} aria-label={`Remover ${c.title}`} onClick={() => setCards(cards.filter((_, k) => k !== i))}><Trash2 size={14} aria-hidden /></button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* ---------- Assembly guide ---------- */}
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionTitle}>Guias de montagem</h3>
        <span className={styles.count}>{steps.length} {steps.length === 1 ? 'passo' : 'passos'}</span>
      </div>

      <div className={styles.field}><label htmlFor={`${uid}-gt`}>Título do guia *</label><input id={`${uid}-gt`} className={styles.input} placeholder="ex.: design compacto" value={guide.title} maxLength={160} onChange={(e) => setGuide({ ...guide, title: e.target.value })} /></div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-gy`}>Tipo de guia *</label>
        <select id={`${uid}-gy`} className={styles.select} value={guide.type} onChange={(e) => setGuide({ ...guide, type: e.target.value })}>
          <option value="">Selecione o tipo de guia</option>
          {ASSEMBLY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div className={styles.field}><label htmlFor={`${uid}-gd`}>Descrição</label><textarea id={`${uid}-gd`} className={styles.textarea} placeholder="Descreva o guia..." value={guide.description} maxLength={4000} onChange={(e) => setGuide({ ...guide, description: e.target.value })} /></div>
      <div className={styles.field}>
        <span className={styles.label}>Imagem principal do guia</span>
        <UploadBox productId={product.id} kind="image" value={guide.imageUrl} onChange={(u) => setGuide({ ...guide, imageUrl: u })} title="Adicionar imagem" hint="PNG e JPG" />
      </div>

      <div className={styles.sectionHead}>
        <span className={styles.label}>Passos do guia * (pelo menos 1)</span>
      </div>
      <div className={styles.builder}>
        <div className={styles.field}><label htmlFor={`${uid}-st`}>Título do passo *</label><input id={`${uid}-st`} className={styles.input} placeholder="ex.: Furadeira GSB 13 RE - aranha" value={step.title} maxLength={160} onChange={(e) => setStep({ ...step, title: e.target.value })} /></div>
        <div className={styles.field}><label htmlFor={`${uid}-sd`}>Descrição do passo *</label><textarea id={`${uid}-sd`} className={styles.textarea} placeholder="Descreva o passo..." value={step.description} maxLength={2000} onChange={(e) => setStep({ ...step, description: e.target.value })} /></div>
        <div className={styles.field}>
          <span className={styles.label}>Imagem do passo *</span>
          <UploadBox productId={product.id} kind="image" value={step.imageUrl} onChange={(u) => setStep({ ...step, imageUrl: u })} title="Adicionar imagem do passo" hint="PNG e JPG · o desenho mostrado na Montagem" inputId={`${uid}-si`} required />
        </div>
        <div className={styles.builderActions}><button type="button" className={styles.pillBtn} onClick={() => addStep()}><Plus size={13} aria-hidden /> Adicionar</button></div>

        {steps.length > 0 && (
          <section className={styles.addedList} aria-label="Passos adicionados">
            <h4 className={styles.addedTitle}>Passos adicionados</h4>
            <div className={styles.guideSplit}>
              {/* esquerda: infos do guia (ao vivo) */}
              <div className={styles.guidePreview}>
                <strong className={styles.guidePreviewTitle}>{guide.title.trim() || 'Título do guia'}</strong>
                {productName && <span className={styles.guidePreviewProduct}>{productName}</span>}
                {guide.description.trim() && (
                  <>
                    {guide.type && <span className={styles.guidePreviewLabel}>{labelOf(ASSEMBLY_TYPES, guide.type)}</span>}
                    <p className={styles.guidePreviewText}>{guide.description}</p>
                  </>
                )}
              </div>

              {/* direita: só os steps */}
              <ol className={styles.stepGrid}>
                {steps.map((s, i) => (
                  <li key={i} className={styles.stepCard}>
                    <span className={styles.stepNum}><span className={styles.srOnly}>Passo </span>{String(i + 1).padStart(2, '0')}</span>
                    {s.imageUrl ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={s.imageUrl} alt="" /> : <span className={styles.stepNoImg}>Sem imagem</span>}
                    <span className={styles.stepTitle}>{s.title}</span>
                    <button type="button" className={styles.iconBtn} aria-label={`Remover passo ${i + 1}`} onClick={() => setSteps(steps.filter((_, k) => k !== i))}><Trash2 size={13} aria-hidden /></button>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}