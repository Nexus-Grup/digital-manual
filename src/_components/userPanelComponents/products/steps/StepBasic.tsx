'use client';

import { useId, useImperativeHandle, useState, type Ref } from 'react';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import { CATEGORIES, SUBCATEGORIES } from '@/_lib/productConstants';
import type { BrandOption, ProductFull, Progress } from '@/_lib/productTypes';
import { api } from '../productApi';
import type { StepHandle } from './stepTypes';

const ERRORS: Record<string, string> = {
  name: 'Digite o nome do produto.',
  model: 'Digite o modelo do produto.',
  code: 'Digite o SKU, código, GTIN ou EAN.',
  category: 'Selecione uma categoria.',
  brand: 'Selecione a marca do produto.',
  desc: 'Descreva o produto com pelo menos 10 caracteres. O texto aparece no Início e em Informações.',
};

type Props = {
  product: ProductFull | null;
  brands: BrandOption[];
  onCreated: (id: number) => void;
  onProgress: (p: Progress) => void;
  ref?: Ref<StepHandle>;
};

export function StepBasic({ product, brands, onCreated, onProgress, ref }: Props) {
  const uid = useId();
  const [name, setName] = useState(product?.name ?? '');
  const [model, setModel] = useState(product?.model ?? '');
  const [code, setCode] = useState(product?.code ?? '');
  const [category, setCategory] = useState(product?.category ?? '');
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? '');
  const [brandId, setBrandId] = useState<number | ''>(product?.brandId ?? (brands.length === 1 ? brands[0].id : ''));
  const [description, setDescription] = useState(product?.description ?? '');
  const [invalid, setInvalid] = useState<string | null>(null);

  const subs = category ? (SUBCATEGORIES[category] ?? []) : [];

  async function save() {
    const missing = !name.trim() ? 'name' : !model.trim() ? 'model' : !code.trim() ? 'code' : !category ? 'category' : !product && brandId === '' ? 'brand' : description.trim().length < 10 ? 'desc' : null;
    setInvalid(missing);
    if (missing) {
      toast.error(ERRORS[missing]);
      document.getElementById(`${uid}-${missing}`)?.focus();
      return false;
    }

    const body = {
      name, model, code, category,
      subcategory: subcategory || null,
      description,
    };

    if (!product) {
      const r = await api<{ product: { id: number } }>('/api/products', 'POST', { ...body, brandId });
      if (!r.ok) return void toast.error(r.error), false;
      toast.success('Produto criado como rascunho.');
      onCreated(r.data.product.id);
      return true;
    }

    const r = await api<{ progress: Progress }>(`/api/products/${product.id}`, 'PATCH', body);
    if (!r.ok) return void toast.error(r.error), false;
    onProgress(r.data.progress);
    toast.success('Informações básicas salvas.');
    return true;
  }

  useImperativeHandle(ref, () => ({ save }));

  const bad = (k: string) => invalid === k || undefined;
  // a11y props of a required field: required + invalid state + link to its inline error
  const req = (k: string) => ({
    required: true,
    'aria-required': true as const,
    'aria-invalid': bad(k),
    'aria-describedby': invalid === k ? `${uid}-${k}-error` : undefined,
  });
  const error = (k: string) =>
    invalid === k ? (
      <p id={`${uid}-${k}-error`} className={styles.fieldError}>
        <CircleAlert size={14} aria-hidden /> {ERRORS[k]}
      </p>
    ) : null;

  return (
    <div className={styles.stack}>
      <p className={styles.requiredNote}>Campos com * são obrigatórios.</p>
      <div className={styles.field}>
        <label htmlFor={`${uid}-name`}>Nome do produto *</label>
        <input id={`${uid}-name`} className={styles.input} placeholder="Digite o nome do produto" value={name} maxLength={160} {...req('name')} onChange={(e) => setName(e.target.value)} />
        {error('name')}
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-model`}>Modelo do produto *</label>
          <input id={`${uid}-model`} className={styles.input} placeholder="ex.: GSB 13 RE" value={model} maxLength={120} {...req('model')} onChange={(e) => setModel(e.target.value)} />
          {error('model')}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-code`}>SKU / código / GTIN / EAN *</label>
          <input id={`${uid}-code`} className={styles.input} placeholder="ex.: PRD-001" value={code} maxLength={80} {...req('code')} onChange={(e) => setCode(e.target.value)} />
          {error('code')}
        </div>
      </div>

      <div className={styles.row3}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-category`}>Categoria *</label>
          <select id={`${uid}-category`} className={styles.select} value={category} {...req('category')} onChange={(e) => { setCategory(e.target.value); setSubcategory(''); }}>
            <option value="">Selecione a categoria</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {error('category')}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-sub`}>Subcategoria</label>
          <select id={`${uid}-sub`} className={styles.select} value={subcategory} disabled={subs.length === 0} onChange={(e) => setSubcategory(e.target.value)}>
            <option value="">{category && subs.length === 0 ? 'Sem subcategorias' : 'Selecione a subcategoria'}</option>
            {subs.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-brand`}>Marca{product ? '' : ' *'}</label>
          <select id={`${uid}-brand`} className={styles.select} value={brandId} disabled={!!product} {...(product ? {} : req('brand'))} aria-describedby={product ? `${uid}-brand-hint` : invalid === 'brand' ? `${uid}-brand-error` : undefined} onChange={(e) => setBrandId(Number(e.target.value))}>
            {product ? (
              <option value={product.brandId}>{product.brandName}</option>
            ) : (
              <>
                <option value="">Selecione a marca</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.companyName})</option>)}
              </>
            )}
          </select>
          {error('brand')}
          {product && <small id={`${uid}-brand-hint`} className={styles.requiredNote}>A marca não pode ser trocada depois de criar o produto.</small>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${uid}-desc`}>Descrição *</label>
        <textarea id={`${uid}-desc`} className={styles.textarea} placeholder="Descreva seu produto..." value={description} maxLength={4000} {...req('desc')} onChange={(e) => setDescription(e.target.value)} />
        {error('desc')}
      </div>
    </div>
  );
}
