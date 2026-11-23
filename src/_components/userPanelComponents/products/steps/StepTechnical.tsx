'use client';

import { useId, useImperativeHandle, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import { SPEC_TYPES } from '@/_lib/productConstants';
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
      toast.error('Select the specification and enter its value');
      return null;
    }
    const next = [...list, { name, unit: unit || null, value: value.trim() }];
    setSpecs(next);
    setName(''); setUnit(''); setValue('');
    return next;
  }

  async function save() {
    if (!title.trim()) {
      toast.error('Enter the technical sheet title');
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
    toast.success('Technical information saved.');
    return true;
  }

  useImperativeHandle(ref, () => ({ save }));

  return (
    <div className={styles.stack}>
      <div className={styles.field}>
        <label htmlFor={`${uid}-title`}>Technical Sheet Title</label>
        <input id={`${uid}-title`} className={styles.input} placeholder="e.g. Product Specifications" value={title} maxLength={160} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-desc`}>Description</label>
        <textarea id={`${uid}-desc`} className={styles.textarea} placeholder="Technical sheet description ...." value={description} maxLength={2000} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className={styles.row3}>
        <div className={styles.field}><label htmlFor={`${uid}-mat`}>Material</label><input id={`${uid}-mat`} className={styles.input} placeholder="e.g. Steel" value={material} maxLength={120} onChange={(e) => setMaterial(e.target.value)} /></div>
        <div className={styles.field}><label htmlFor={`${uid}-dim`}>Dimensions</label><input id={`${uid}-dim`} className={styles.input} placeholder="L x W x H" value={dimensions} maxLength={120} onChange={(e) => setDimensions(e.target.value)} /></div>
        <div className={styles.field}><label htmlFor={`${uid}-w`}>Weight</label><input id={`${uid}-w`} className={styles.input} placeholder="e.g. 1.8 kg" value={weight} maxLength={40} onChange={(e) => setWeight(e.target.value)} /></div>
      </div>

      <section className={styles.builder} aria-label="Added Specifications">
        <div className={styles.sectionHead}>
          <h3 className={styles.addedTitle}>Added Specifications</h3>
          <button type="button" className={styles.pillBtn} onClick={() => addSpec()}><Plus size={13} aria-hidden /> Add</button>
        </div>
        <div className={styles.row3}>
          <div className={styles.field}>
            <label htmlFor={`${uid}-sn`}>Specification Name</label>
            <select id={`${uid}-sn`} className={styles.select} value={name} onChange={(e) => { setName(e.target.value); setUnit(''); }}>
              <option value="">Select type specification</option>
              {Object.keys(SPEC_TYPES).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${uid}-su`}>Unit</label>
            <select id={`${uid}-su`} className={styles.select} value={unit} disabled={!name || units.length === 0} onChange={(e) => setUnit(e.target.value)}>
              <option value="">{name && units.length === 0 ? 'No unit' : 'Select type Unit'}</option>
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${uid}-sv`}>Value</label>
            <input id={`${uid}-sv`} className={styles.input} placeholder="e.g. 220" value={value} maxLength={80} onChange={(e) => setValue(e.target.value)} />
          </div>
        </div>

        {specs.length > 0 && (
          <ul className={styles.addedList}>
            {specs.map((s, i) => (
              <li key={i}>
                <span className={styles.addedText}><span>{s.name}</span><small>{s.value}{s.unit ? ` ${s.unit}` : ''}</small></span>
                <button type="button" className={styles.iconBtn} aria-label={`Remove ${s.name}`} onClick={() => setSpecs(specs.filter((_, k) => k !== i))}><Trash2 size={14} aria-hidden /></button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
