'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/CompanyForm.module.css';
import usersStyles from '@/_styles/cssUserPanelPage/CompanyUsers.module.css';
import extra from '@/_styles/cssUserPanelPage/Brand.module.css';
import { LogoField } from '../utils_panel/LogoField';
import { Modal } from '../utils_panel/Modal';

const BASE = '/painel/marcas';

export type BrandData = {
  id: number;
  name: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
};

export type CompanyOption = { id: number; name: string };

type Props = {
  mode: 'create' | 'edit';
  /** Modo edit: dados atuais da marca */
  brand?: BrandData;
  /** Modo create: empresas onde o usuário é OWNER */
  companies?: CompanyOption[];
  defaultCompanyId?: number;
  /** Modo edit: seção de usuários da marca */
  children?: ReactNode;
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function BrandFormInner({
  mode,
  brand,
  companies = [],
  defaultCompanyId,
  children,
  onReset,
}: Props & { onReset: () => void }) {
  const router = useRouter();
  const formId = useId();
  const isEdit = mode === 'edit' && !!brand;

  const [name, setName] = useState(brand?.name ?? '');
  const [description, setDescription] = useState(brand?.description ?? '');
  const [logoUrl, setLogoUrl] = useState<string | null>(brand?.logoUrl ?? null);
  const [companyId, setCompanyId] = useState<number | ''>(
    defaultCompanyId ?? companies[0]?.id ?? '',
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (uploading) return;
    setNameInvalid(false);

    if (name.trim().length < 2) {
      setNameInvalid(true);
      toast.error('Digite o nome da marca');
      return;
    }
    if (!isEdit && companyId === '') {
      toast.error('Selecione uma empresa');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/brands/${brand.id}` : '/api/brands', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(
          isEdit ? { name, description, logoUrl } : { name, description, logoUrl, companyId },
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? 'Não foi possível salvar a marca');
        return;
      }
      if (isEdit) {
        toast.success('Alterações salvas.');
      } else {
        toast.success('Marca criada.');
        onReset(); // zera o form: o Next guarda o estado da tela ao sair dela
        // depois de criar, vai para a edição para adicionar usuários
        router.push(`${BASE}/${data.brand.id}/editar`);
      }
      router.refresh(); // atualiza a lista da sidebar
    } catch {
      toast.error('Erro de conexão. Tente de novo.');
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(isActive: boolean) {
    if (!brand) return;
    setStatusBusy(true);
    try {
      const res = await fetch(`/api/brands/${brand.id}`, {
        method: 'PATCH',
        headers: JSON_HEADERS,
        body: JSON.stringify({ isActive }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? 'Não foi possível atualizar a marca');
        return;
      }
      toast.success(isActive ? 'Marca ativada.' : 'Marca desativada.');
      setConfirmOpen(false);
      router.push(BASE);
      router.refresh();
    } catch {
      toast.error('Erro de conexão. Tente de novo.');
    } finally {
      setStatusBusy(false);
    }
  }

  const selectedCompany = companies.find((c) => c.id === companyId);

  return (
    <>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{isEdit ? 'Editar marca' : 'Nova marca'}</h1>
            <p className={styles.subtitle}>
              {isEdit ? 'Gerencie as informações e os acessos da marca.' : 'Cadastre uma nova marca na sua empresa.'}
            </p>
          </div>
          {isEdit && (
            <span className={`${styles.badge} ${brand.isActive ? styles.badgeActive : styles.badgeInactive}`}>
              {brand.isActive ? 'active' : 'inactive'}
            </span>
          )}
        </header>

        {/* o <form> envolve só os campos: a seção de usuários tem ações próprias */}
        <form id={formId} className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor={`${formId}-name`} className={styles.label}>Nome da marca*</label>
            <input
              id={`${formId}-name`}
              className={styles.input}
              placeholder="ex.: Bosch"
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
              placeholder="Descreva a marca..."
              value={description}
              maxLength={2000}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <LogoField
            label="Logo da marca"
            value={logoUrl}
            onChange={setLogoUrl}
            onBusyChange={setUploading}
            onError={(msg) => {
              if (msg) toast.error(msg);
            }}
          />

          {!isEdit && (
            <div className={styles.field}>
              <label htmlFor={`${formId}-company`} className={styles.label}>Empresa</label>
              <div className={extra.companyBox}>
                <div className={extra.companyRow}>
                  <Building2 size={14} aria-hidden />
                  <select
                    id={`${formId}-company`}
                    className={extra.companySelect}
                    value={companyId}
                    onChange={(e) => setCompanyId(Number(e.target.value))}
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {selectedCompany && selectedCompany.id === defaultCompanyId && (
                    <span className={extra.currentBadge}>Empresa atual</span>
                  )}
                  <ChevronDown size={16} aria-hidden />
                </div>
                <span className={extra.companyHint}>
                  The brand will be registered under this company.
                </span>
              </div>
            </div>
          )}
        </form>

        {isEdit && children}

        {isEdit ? (
          <footer className={`${styles.footer} ${extra.footerBetween}`}>
            {brand.isActive ? (
              <button
                type="button"
                className={extra.deactivate}
                onClick={() => setConfirmOpen(true)}
                disabled={saving}
              >
                Desativar marca
              </button>
            ) : (
              <button
                type="button"
                className={extra.activate}
                onClick={() => changeStatus(true)}
                disabled={statusBusy}
              >
                {statusBusy ? 'Ativando...' : 'Ativar marca'}
              </button>
            )}

            <button type="submit" form={formId} className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving || uploading}>
              <Check size={15} aria-hidden />
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </footer>
        ) : (
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
            <button
              type="submit"
              form={formId}
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={saving || uploading || companyId === ''}
            >
              <Check size={15} aria-hidden />
              {saving ? 'Salvando...' : 'Criar marca'}
            </button>
          </footer>
        )}
      </div>

      {confirmOpen && brand && (
        <Modal label="Desativar marca" onClose={() => setConfirmOpen(false)}>
          <h2 className={usersStyles.modalTitle}>Desativar marca?</h2>
          <p className={extra.confirmText}>
            <strong>{brand.name}</strong> will be hidden from the platform. Its users and
            content are kept, and you can activate it again later.
          </p>
          <div className={usersStyles.panelActions}>
            <button
              type="button"
              className={usersStyles.pillBtn}
              onClick={() => setConfirmOpen(false)}
              disabled={statusBusy}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={usersStyles.dangerBtn}
              onClick={() => changeStatus(false)}
              disabled={statusBusy}
            >
              {statusBusy ? 'Desativando...' : 'Desativar marca'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

/**
 * A `key` recria o formulário (campos e logo voltam ao início) quando:
 *  - muda a marca, ou se vai de "edit" para "new";
 *  - o formulário pede o reset (`onReset`): ao criar com sucesso e ao clicar em Cancel.
 */
export function BrandForm(props: Props) {
  const [resets, setResets] = useState(0);
  return (
    <BrandFormInner
      key={`${props.brand?.id ?? 'new'}-${resets}`}
      {...props}
      onReset={() => setResets((n) => n + 1)}
    />
  );
}