'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import page from '@/_styles/cssUserPanelPage/Profile.module.css';
import { request } from '@/lib/request';

// Ajuste se a rota tiver outro nome
const PROFILE_URL = '/api/profile';

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
};

type Field = keyof PersonalInfo;
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9._-]+$/; // o servidor converte para minúsculas

function validate(v: PersonalInfo): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = 'O nome é obrigatório.';
  if (!v.lastName.trim()) e.lastName = 'O sobrenome é obrigatório.';
  if (!v.userName.trim()) e.userName = 'O nome de usuário é obrigatório.';
  else if (v.userName.trim().length < 3) e.userName = 'Use pelo menos 3 caracteres.';
  else if (!USERNAME_RE.test(v.userName.trim())) e.userName = 'Use apenas letras, números, pontos, hifens e sublinhados.';
  if (!v.email.trim()) e.email = 'O e-mail é obrigatório.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Digite um e-mail válido.';
  return e;
}

function TextField({
  id,
  label,
  value,
  error,
  type = 'text',
  autoComplete,
  onChange,
}: {
  id: Field;
  label: string;
  value: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={page.field}>
      <label htmlFor={id} className={page.label}>{label}*</label>
      <input
        id={id}
        name={id}
        type={type}
        className={page.input}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p id={`${id}-error`} className={page.error}>{error}</p>}
    </div>
  );
}

function PersonalInfoFormInner({ user }: { user: PersonalInfo }) {
  const router = useRouter();
  const [form, setForm] = useState<PersonalInfo>(user);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const dirty =
    form.firstName !== user.firstName ||
    form.lastName !== user.lastName ||
    form.userName !== user.userName ||
    form.email !== user.email;

  function set(field: Field, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function reset() {
    setForm(user);
    setErrors({});
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    const err = await request(PROFILE_URL, 'PATCH', {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      userName: form.userName.trim(),
      email: form.email.trim(),
    });
    setBusy(false);

    if (err) {
      toast.error(err);
      return;
    }
    toast.success('Perfil atualizado.');
    router.refresh();
  }

  return (
    <section className={page.card} aria-label="Informações pessoais">
      <header className={page.cardHead}>
        <div>
          <h2 className={page.cardTitle}>Informações pessoais</h2>
          <p className={page.cardSub}>Campos marcados com * são obrigatórios.</p>
        </div>
      </header>

      <form className={page.form} onSubmit={onSubmit} noValidate>
        <div className={page.grid2}>
          <TextField id="firstName" label="Nome" value={form.firstName} error={errors.firstName} autoComplete="given-name" onChange={(v) => set('firstName', v)} />
          <TextField id="lastName" label="Sobrenome" value={form.lastName} error={errors.lastName} autoComplete="family-name" onChange={(v) => set('lastName', v)} />
        </div>
        <TextField id="userName" label="Nome de usuário" value={form.userName} error={errors.userName} autoComplete="username" onChange={(v) => set('userName', v)} />
        <TextField id="email" label="Endereço de e-mail" type="email" value={form.email} error={errors.email} autoComplete="email" onChange={(v) => set('email', v)} />

        <div className={page.formActions}>
          <button type="button" className={page.secondaryBtn} onClick={reset} disabled={!dirty || busy}>
            Cancelar
          </button>
          <button type="submit" className={page.primaryBtn} disabled={!dirty || busy}>
            {busy ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </section>
  );
}

/**
 * Depois do router.refresh() os dados novos chegam por props. Em vez de copiar
 * props para o estado dentro de um useEffect, a `key` remonta o formulário
 * com os valores atualizados.
 */
export function PersonalInfoForm({ user }: { user: PersonalInfo }) {
  const key = [user.firstName, user.lastName, user.userName, user.email].join('|');
  return <PersonalInfoFormInner key={key} user={user} />;
}