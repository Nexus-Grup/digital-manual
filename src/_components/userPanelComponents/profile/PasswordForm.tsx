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
  if (!v.currentPassword) e.currentPassword = 'Enter your current password.';
  if (!v.newPassword) e.newPassword = 'Enter a new password.';
  else if (v.newPassword.length < MIN_LENGTH) e.newPassword = `Use at least ${MIN_LENGTH} characters.`;
  else if (v.newPassword.length > MAX_LENGTH) e.newPassword = `Use at most ${MAX_LENGTH} characters.`;
  else if (v.newPassword === v.currentPassword) e.newPassword = 'The new password must be different from the current one.';
  if (!v.confirmPassword) e.confirmPassword = 'Repeat the new password.';
  else if (v.confirmPassword !== v.newPassword) e.confirmPassword = 'The passwords do not match.';
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
    toast.success('Password changed.');
    setValues(EMPTY);
  }

  const fields: { id: keyof Values; label: string; placeholder: string; autoComplete: string }[] = [
    { id: 'currentPassword', label: 'Current password', placeholder: 'Current password', autoComplete: 'current-password' },
    { id: 'newPassword', label: 'New password', placeholder: 'New password', autoComplete: 'new-password' },
    { id: 'confirmPassword', label: 'Confirm new password', placeholder: 'Repeat new password', autoComplete: 'new-password' },
  ];

  return (
    <section className={page.card} aria-label="Security">
      <header className={page.cardHead}>
        <div>
          <h2 className={page.cardTitle}>Security</h2>
          <p className={page.cardSub}>Change the password you use to sign in.</p>
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
            {busy ? 'Changing...' : 'Change password'}
          </button>
        </div>
      </form>
    </section>
  );
}