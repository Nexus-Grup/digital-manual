'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Lock } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/CompanyForm.module.css';
import { LogoField } from '../utils_panel/LogoField';
import { toast } from "sonner";

const BASE = '/painel/empresas';

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

function CompanyFormInner({ mode, company, children, onReset }: Props & { onReset: () => void }) {
  const router = useRouter();
  const formId = useId();
  const isEdit = mode === 'edit' && !!company;

  const [name, setName] = useState(company?.name ?? '');
  const [companyId, setCompanyId] = useState(company?.id ?? '');
  const [description, setDescription] = useState(company?.description ?? '');
  const [website, setWebsite] = useState(company?.website ?? '');
  const [logoUrl, setLogoUrl] = useState<string | null>(company?.logoUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (uploading) return;
    setNameInvalid(false);

    if (name.trim().length < 2) {
      setNameInvalid(true); // só marca o campo; a mensagem vai no toast
      toast.error('Digite o nome da empresa');
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
        toast.error(data.error ?? 'Não foi possível salvar a empresa');
        return;
      }
      if (isEdit) {
        toast.success('Alterações salvas.');
      } else {
        toast.success('Empresa criada.');
        onReset(); // zera o form: o Next guarda o estado da tela ao sair dela
        // depois de criar, vai para a edição para adicionar usuários
        router.push(`${BASE}/${data.company.id}/editar`);
      }
      router.refresh(); // atualiza a lista da sidebar
    } catch {
      toast.error('Erro de conexão. Tente de novo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{isEdit ? 'Editar empresa' : 'Nova empresa'}</h1>
          <p className={styles.subtitle}>
            {isEdit ? 'Informações da empresa' : 'Cadastre uma nova empresa na plataforma.'}
          </p>
        </div>
        <div>
          {isEdit && (
            <span className={`${styles.badge} ${company.isActive ? styles.badgeActive : styles.badgeInactive}`}>
              {company.isActive ? 'active' : 'inactive'}
            </span>
          )}
          <p style={{fontSize:'14px'}}>id ( {companyId} )</p>          
        </div>
      </header>

      {/* o <form> envolve só os campos: a seção de usuários tem formulários próprios */}
      <form id={formId} className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor={`${formId}-name`} className={styles.label}>Nome da empresa*</label>
          <input
            id={`${formId}-name`}
            className={styles.input}
            placeholder="ex.: Robert Bosch Ltda."
            value={name}
            maxLength={120}
            aria-invalid={nameInvalid}
            onChange={(e) => {
              setName(e.target.value);
              setNameInvalid(false);
            }}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-desc`} className={styles.label}>Descrição</label>
          <textarea
            id={`${formId}-desc`}
            className={styles.textarea}
            placeholder="Descreva a empresa..."
            value={description}
            maxLength={2000}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-site`} className={styles.label}>Site</label>
          <input
            id={`${formId}-site`}
            type="url"
            className={styles.input}
            placeholder="https://www.company.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <LogoField
          value={logoUrl}
          onChange={setLogoUrl}
          onBusyChange={setUploading}
          onError={(msg) => {
            if (msg) toast.error(msg);
          }}
        />
      </form>

      {isEdit ? (
        children
      ) : (
        <div className={styles.note}>
          <span className={styles.noteTitle}><Lock size={12} aria-hidden /> Proprietário</span>
          <span className={styles.noteText}>Você se tornará automaticamente o proprietário desta empresa.</span>
        </div>
      )}

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => {
            onReset(); // descarta o que foi digitado
            router.push(BASE);
          }}
          disabled={saving}
        >
          Cancelar
        </button>
        <button type="submit" form={formId} className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving || uploading}>
          <Check size={15} aria-hidden />
          {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar empresa'}
        </button>
      </footer>
    </div>
  );
}

/**
 * A `key` recria o formulário (campos e logo voltam ao início) quando:
 *  - muda a empresa, ou se vai de "edit" para "new";
 *  - o formulário pede o reset (`onReset`): ao criar com sucesso e ao clicar em Cancel.
 */
export function CompanyForm(props: Props) {
  const [resets, setResets] = useState(0);
  return (
    <CompanyFormInner
      key={`${props.company?.id ?? 'new'}-${resets}`}
      {...props}
      onReset={() => setResets((n) => n + 1)}
    />
  );
}