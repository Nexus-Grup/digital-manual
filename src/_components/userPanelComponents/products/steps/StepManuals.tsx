'use client';

import { useId, useImperativeHandle, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import { DOCUMENT_TYPES, LANGUAGES, labelOf } from '@/_lib/productConstants';
import type { ManualDTO, Progress } from '@/_lib/productTypes';
import { UploadBox } from '../UploadBox';
import { api, fileNameFromUrl } from '../productApi';
import type { StepProps } from './stepTypes';

export function StepManuals({ product, onProgress, ref }: StepProps) {
  const uid = useId();
  const [manuals, setManuals] = useState<ManualDTO[]>(product.manuals);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [language, setLanguage] = useState('');
  const [version, setVersion] = useState('');

  function add(list = manuals) {
    if (!fileUrl || !title.trim() || !documentType) {
      toast.error('Envie o PDF, digite o título e escolha o tipo de documento');
      return null;
    }
    const next = [...list, { title: title.trim(), fileUrl, documentType, language: language || null, version: version.trim() || null }];
    setManuals(next);
    setFileUrl(null); setTitle(''); setDocumentType(''); setLanguage(''); setVersion('');
    return next;
  }

  async function save() {
    let list = manuals;
    if (fileUrl || title.trim()) { const n = add(); if (!n) return false; list = n; }

    const r = await api<{ progress: Progress }>(`/api/products/${product.id}/manuals`, 'PUT', { manuals: list });
    if (!r.ok) return void toast.error(r.error), false;
    onProgress(r.data.progress);
    toast.success('Manuais e documentos salvos.');
    return true;
  }

  useImperativeHandle(ref, () => ({ save }));

  return (
    <div className={styles.stack}>
      <div className={styles.field}>
        <span className={styles.label}>Enviar manual em PDF</span>
        <UploadBox productId={product.id} kind="pdf" value={fileUrl} onChange={setFileUrl} title="Enviar manual em PDF" hint="Somente PDF · até 50 MB" />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-t`}>Título do manual *</label>
        <input id={`${uid}-t`} className={styles.input} placeholder="ex.: Manual do usuário" value={title} maxLength={160} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-d`}>Tipo de documento</label>
          <select id={`${uid}-d`} className={styles.select} value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
            <option value="">Selecione o tipo</option>
            {DOCUMENT_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-l`}>Idioma</label>
          <select id={`${uid}-l`} className={styles.select} value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">Selecione o idioma</option>
            {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor={`${uid}-v`}>Versão do manual</label>
        <input id={`${uid}-v`} className={styles.input} placeholder="e.g. 1.0" value={version} maxLength={40} onChange={(e) => setVersion(e.target.value)} />
      </div>
      <div className={styles.builderActions}><button type="button" className={styles.pillBtn} onClick={() => add()}><Plus size={13} aria-hidden /> Adicionar manual</button></div>

      {manuals.length > 0 && (
        <section className={styles.added} aria-label="Manuais adicionados">
          <h3 className={styles.addedTitle}>Manuais adicionados</h3>
          <ul>
            {manuals.map((m, i) => (
              <li key={i}>
                <span className={styles.addedText}>
                  <span>{m.title}{m.version ? ` · v${m.version}` : ''}</span>
                  <small>{labelOf(DOCUMENT_TYPES, m.documentType)}{m.language ? ` · ${labelOf(LANGUAGES, m.language)}` : ''} · {fileNameFromUrl(m.fileUrl)}</small>
                </span>
                <button type="button" className={styles.iconBtn} aria-label={`Remover ${m.title}`} onClick={() => setManuals(manuals.filter((_, k) => k !== i))}><Trash2 size={14} aria-hidden /></button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
