'use client';

import { useId, useImperativeHandle, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import { SPEC_TYPES, specTypeLabel } from '@/_lib/productConstants';
import type { Progress, SpecDTO } from '@/_lib/productTypes';
import { api } from '../productApi';
import type { StepProps } from './stepTypes';

export function StepTechnical({ product, onProgress, ref }: StepProps) {
  const uid = useId();
  const t = product.technical;
  const [title, setTitle] = useState(t?.title ?? '');
  const [description, setDescription] = useState(t?.description ?? '');
  const [material, setMaterial] = useState(t?.material ?? '');
  const [dimensions, setDimensions] = useState(t?.dimensions ?? '');
  const [weight, setWeight] = useState(t?.weight != null ? `${t.weight} kg` : '');
  const [specs, setSpecs] = useState<SpecDTO[]>(t?.specs ?? []);

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [value, setValue] = useState('');
  const units = name ? (SPEC_TYPES[name] ?? []) : [];

  function addSpec(list = specs) {
    if (!name || !value.trim()) {
      toast.error('Selecione a especificação e informe o valor');
      return null;
    }
    const next = [...list, { name, unit: unit || null, value: value.trim() }];
    setSpecs(next);
    setName(''); setUnit(''); setValue('');
    return next;
  }

  async function save() {
    if (!title.trim()) {
      toast.error('Digite o título da ficha técnica');
      document.getElementById(`${uid}-title`)?.focus();
      return false;
    }
    let list = specs;
    if (name || value.trim()) { const n = addSpec(); if (!n) return false; list = n; }

    const r = await api<{ progress: Progress }>(`/api/products/${product.id}/technical`, 'PUT', {
      title, description, material, dimensions, weight: weight || null, specs: list,
    });
    if (!r.ok) return void toast.error(r.error), false;
    onProgress(r.data.progress);
    toast.success('Informações técnicas salvas.');
    return true;
  }

  useImperativeHandle(ref, () => ({ save }));

  return (
    <div className={styles.stack}>
      <p className={styles.requiredNote}>Campos com * são obrigatórios. Ao adicionar uma especificação, informe o tipo e o valor.</p>
      <div className={styles.field}>
        <label htmlFor={`${uid}-title`}>Título da ficha técnica *</label>
        <input id={`${uid}-title`} className={styles.input} placeholder="ex.: Especificações do produto" value={title} maxLength={160} required aria-required="true" onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-desc`}>Descrição</label>
        <textarea id={`${uid}-desc`} className={styles.textarea} placeholder="Descrição da ficha técnica..." value={description} maxLength={2000} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className={styles.row3}>
        <div className={styles.field}><label htmlFor={`${uid}-mat`}>Material</label><input id={`${uid}-mat`} className={styles.input} placeholder="ex.: Aço" value={material} maxLength={120} onChange={(e) => setMaterial(e.target.value)} /></div>
        <div className={styles.field}><label htmlFor={`${uid}-dim`}>Dimensões</label><input id={`${uid}-dim`} className={styles.input} placeholder="C x L x A (ex.: 30 x 10 x 25 cm)" value={dimensions} maxLength={120} onChange={(e) => setDimensions(e.target.value)} /></div>
        <div className={styles.field}><label htmlFor={`${uid}-w`}>Peso</label><input id={`${uid}-w`} className={styles.input} placeholder="ex.: 1,8 kg" value={weight} maxLength={40} onChange={(e) => setWeight(e.target.value)} /></div>
      </div>

      <section className={styles.builder} aria-label="Especificações adicionadas">
        <div className={styles.sectionHead}>
          <h3 className={styles.addedTitle}>Especificações adicionadas</h3>
          <button type="button" className={styles.pillBtn} onClick={() => addSpec()}><Plus size={13} aria-hidden /> Adicionar</button>
        </div>
        <div className={styles.row3}>
          <div className={styles.field}>
            <label htmlFor={`${uid}-sn`}>Especificação *</label>
            <select id={`${uid}-sn`} className={styles.select} value={name} onChange={(e) => { setName(e.target.value); setUnit(''); }}>
              <option value="">Selecione a especificação</option>
              {Object.keys(SPEC_TYPES).map((n) => <option key={n} value={n}>{specTypeLabel(n)}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${uid}-su`}>Unidade</label>
            <select id={`${uid}-su`} className={styles.select} value={unit} disabled={!name || units.length === 0} onChange={(e) => setUnit(e.target.value)}>
              <option value="">{name && units.length === 0 ? 'Sem unidade' : 'Selecione a unidade'}</option>
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${uid}-sv`}>Valor *</label>
            <input id={`${uid}-sv`} className={styles.input} placeholder="ex.: 220" value={value} maxLength={80} onChange={(e) => setValue(e.target.value)} />
          </div>
        </div>

        {specs.length > 0 && (
          <ul className={styles.addedList}>
            {specs.map((s, i) => (
              <li key={i}>
                <span className={styles.addedText}><span>{specTypeLabel(s.name)}</span><small>{s.value}{s.unit ? ` ${s.unit}` : ''}</small></span>
                <button type="button" className={styles.iconBtn} aria-label={`Remover ${specTypeLabel(s.name)}`} onClick={() => setSpecs(specs.filter((_, k) => k !== i))}><Trash2 size={14} aria-hidden /></button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
