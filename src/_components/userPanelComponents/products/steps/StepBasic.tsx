'use client';

import { useId, useImperativeHandle, useState, type Ref } from 'react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';;
import { CATEGORIES, SUBCATEGORIES } from '@/_lib/productConstants';
import type { BrandOption, ProductFull, Progress } from '@/_lib/productTypes';
import { api } from '../productApi';
import type { StepHandle } from './stepTypes';

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
    const missing = !name.trim() ? 'name' : !model.trim() ? 'model' : !code.trim() ? 'code' : !category ? 'category' : !product && brandId === '' ? 'brand' : null;
    setInvalid(missing);
    if (missing) {
      toast.error(missing === 'category' ? 'Selecione uma categoria' : missing === 'brand' ? 'Selecione uma marca' : 'Preencha os campos obrigatórios');
      document.getElementById(`${uid}-${missing}`)?.focus();
      return false;
    }

    const body = {
      name, model, code, category,
      subcategory: subcategory || null,
      description: description || null,
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

  return (
    <div className={styles.stack}>
      <div className={styles.field}>
        <label htmlFor={`${uid}-name`}>Nome do produto *</label>
        <input id={`${uid}-name`} className={styles.input} placeholder="Digite o nome do produto" value={name} maxLength={160} aria-invalid={bad('name')} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-model`}>Modelo do produto *</label>
          <input id={`${uid}-model`} className={styles.input} placeholder="ex.: GSB 13 RE" value={model} maxLength={120} aria-invalid={bad('model')} onChange={(e) => setModel(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-code`}>SKU / código / GTIN / EAN *</label>
          <input id={`${uid}-code`} className={styles.input} placeholder="ex.: PRD-001" value={code} maxLength={80} aria-invalid={bad('code')} onChange={(e) => setCode(e.target.value)} />
        </div>
      </div>

      <div className={styles.row3}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-category`}>Categoria</label>
          <select id={`${uid}-category`} className={styles.select} value={category} aria-invalid={bad('category')} onChange={(e) => { setCategory(e.target.value); setSubcategory(''); }}>
            <option value="">Selecione a categoria</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-sub`}>Subcategoria</label>
          <select id={`${uid}-sub`} className={styles.select} value={subcategory} disabled={subs.length === 0} onChange={(e) => setSubcategory(e.target.value)}>
            <option value="">{category && subs.length === 0 ? 'Sem subcategorias' : 'Selecione a subcategoria'}</option>
            {subs.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-brand`}>Marca</label>
          <select id={`${uid}-brand`} className={styles.select} value={brandId} disabled={!!product} aria-invalid={bad('brand')} onChange={(e) => setBrandId(Number(e.target.value))}>
            {product ? (
              <option value={product.brandId}>{product.brandName}</option>
            ) : (
              <>
                <option value="">Selecione a marca</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.companyName})</option>)}
              </>
            )}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${uid}-desc`}>Descrição</label>
        <textarea id={`${uid}-desc`} className={styles.textarea} placeholder="Descreva seu produto..." value={description} maxLength={4000} onChange={(e) => setDescription(e.target.value)} />
      </div>
    </div>
  );
}
