'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import page from '@/_styles/cssUserPanelPage/Profile.module.css';
import { request } from '@/lib/request';

// Ajuste se a rota tiver outro nome
const PASSWORD_URL = '/api/profile/password';
// Tem que ser a mesma regra do servidor (zod)
const MIN_LENGTH = 8;
const MAX_LENGTH = 72; // limite do bcrypt

type Values = { currentPassword: string; newPassword: string; confirmPassword: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { currentPassword: '', newPassword: '', confirmPassword: '' };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.currentPassword) e.currentPassword = 'Digite sua senha atual.';
  if (!v.newPassword) e.newPassword = 'Digite a nova senha.';
  else if (v.newPassword.length < MIN_LENGTH) e.newPassword = `Use pelo menos ${MIN_LENGTH} caracteres.`;
  else if (v.newPassword.length > MAX_LENGTH) e.newPassword = `Use no máximo ${MAX_LENGTH} caracteres.`;
  else if (v.newPassword === v.currentPassword) e.newPassword = 'A nova senha precisa ser diferente da atual.';
  if (!v.confirmPassword) e.confirmPassword = 'Repita a nova senha.';
  else if (v.confirmPassword !== v.newPassword) e.confirmPassword = 'As senhas não coincidem.';
  return e;
}

export function PasswordForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  function set(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    const err = await request(PASSWORD_URL, 'POST', {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    setBusy(false);

    if (err) {
      toast.error(err);
      return;
    }
    toast.success('Senha alterada.');
    setValues(EMPTY);
  }

  const fields: { id: keyof Values; label: string; placeholder: string; autoComplete: string }[] = [
    { id: 'currentPassword', label: 'Senha atual', placeholder: 'Senha atual', autoComplete: 'current-password' },
    { id: 'newPassword', label: 'Nova senha', placeholder: 'Nova senha', autoComplete: 'new-password' },
    { id: 'confirmPassword', label: 'Confirmar nova senha', placeholder: 'Repita a nova senha', autoComplete: 'new-password' },
  ];

  return (
    <section className={page.card} aria-label="Segurança">
      <header className={page.cardHead}>
        <div>
          <h2 className={page.cardTitle}>Segurança</h2>
          <p className={page.cardSub}>Altere a senha que você usa para entrar.</p>
        </div>
      </header>

      <form className={page.form} onSubmit={onSubmit} noValidate>
        {fields.map((f) => (
          <div key={f.id} className={page.field}>
            <label htmlFor={f.id} className={page.label}>{f.label}*</label>
            <input
              id={f.id}
              name={f.id}
              type="password"
              className={page.input}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
              value={values[f.id]}
              aria-invalid={!!errors[f.id]}
              aria-describedby={errors[f.id] ? `${f.id}-error` : undefined}
              onChange={(e) => set(f.id, e.target.value)}
            />
            {errors[f.id] && <p id={`${f.id}-error`} className={page.error}>{errors[f.id]}</p>}
          </div>
        ))}

        <div className={page.formActions}>
          <button type="submit" className={page.primaryBtn} disabled={busy}>
            {busy ? 'Alterando...' : 'Alterar senha'}
          </button>
        </div>
      </form>
    </section>
  );
}