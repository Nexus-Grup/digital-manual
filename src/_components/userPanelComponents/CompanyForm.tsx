'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Lock } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/CompanyForm.module.css';
import { LogoField } from './LogoField';
import { toast } from "sonner";

const BASE = '/user-panel/companies';

export type CompanyData = {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  isActive: boolean;
};

type Props = {
  mode: 'create' | 'edit';
  company?: CompanyData;
  /** Seção extra entre o formulário e o rodapé (usuários da empresa) */
  children?: ReactNode;
};

export function CompanyForm({ mode, company, children }: Props) {
  const router = useRouter();
  const formId = useId();
  const isEdit = mode === 'edit' && !!company;

  const [name, setName] = useState(company?.name ?? '');
  const [description, setDescription] = useState(company?.description ?? '');
  const [website, setWebsite] = useState(company?.website ?? '');
  const [logoUrl, setLogoUrl] = useState<string | null>(company?.logoUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (uploading) return;
    setError('');
    setSaved(false);

    if (name.trim().length < 2) {
      setError('Enter the company name');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/companies/${company.id}` : '/api/companies', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, website, logoUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Could not save the company');
        return;
      }
      if (isEdit) {
        setSaved(true);
      } else {
        // depois de criar, vai para a edição para adicionar usuários
        router.push(`${BASE}/${data.company.id}/edit`);
      }
      router.refresh(); // atualiza a lista da sidebar
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{isEdit ? 'Edit Company' : 'New Company'}</h1>
          <p className={styles.subtitle}>
            {isEdit ? 'Company Information' : 'Register a new company in the platform.'}
          </p>
        </div>
        {isEdit && (
          <span className={`${styles.badge} ${company.isActive ? styles.badgeActive : styles.badgeInactive}`}>
            {company.isActive ? 'active' : 'inactive'}
          </span>
        )}
      </header>

      {/* o <form> envolve só os campos: a seção de usuários tem formulários próprios */}
      <form id={formId} className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor={`${formId}-name`} className={styles.label}>Company name*</label>
          <input
            id={`${formId}-name`}
            className={styles.input}
            placeholder="e.g. robert bosch gmbh"
            value={name}
            maxLength={120}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-desc`} className={styles.label}>Description</label>
          <textarea
            id={`${formId}-desc`}
            className={styles.textarea}
            placeholder="Describe the company ...."
            value={description}
            maxLength={2000}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-site`} className={styles.label}>Website</label>
          <input
            id={`${formId}-site`}
            type="url"
            className={styles.input}
            placeholder="https://www.company.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <LogoField value={logoUrl} onChange={setLogoUrl} onBusyChange={setUploading} onError={setError} />

        {error && <p className={styles.error} role="alert">{error}</p>}
        {saved && <p className={styles.success} role="status">Changes saved.</p>}
      </form>

      {isEdit ? (
        children
      ) : (
        <div className={styles.note}>
          <span className={styles.noteTitle}><Lock size={12} aria-hidden /> Owner assignment</span>
          <span className={styles.noteText}>You will automatically become the Owner of this company.</span>
        </div>
      )}

      <footer className={styles.footer}>
        <button type="button" className={styles.btn} onClick={() => router.push(BASE)} disabled={saving}>
          Cancel
        </button>
        <button type="submit" form={formId} className={styles.btn} disabled={saving || uploading}>
          <Check size={15} aria-hidden />
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create company'}
        </button>
      </footer>
    </div>
  );
}