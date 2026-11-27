'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import styles from '@/_styles/cssAuthPage/Auth.module.css';
import AuthLogo from './AuthLogo';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResetPasswordForm({ initialEmail = '' }: { initialEmail?: string }) {
  const id = useId();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!EMAIL_RE.test(email.trim())) return setError('Digite um e-mail válido');
    if (!/^\d{6}$/.test(code)) return setError('Digite o código de 6 dígitos');
    if (password.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres');
    if (password !== confirm) return setError('As senhas não coincidem');
    setError('');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code, password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Não foi possível redefinir a senha');
        return;
      }
      setDone(true);
    } catch {
      setError('Erro de conexão. Tente de novo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <AuthLogo />

      <h1 className={styles.title}>Redefina sua senha</h1>

      {done ? (
        <div className={styles.success} role="status">
          <p>Sua senha foi alterada. Você já pode entrar com a nova senha.</p>
        </div>
      ) : (
        <>
          <p className={styles.description}>
            Enter the code we sent to your email and choose a new password.
          </p>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor={`${id}-email`} className={styles.label}>E-mail</label>
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                placeholder="Digite seu e-mail"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-code`} className={styles.label}>Código</label>
              <input
                id={`${id}-code`}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="Código de 6 dígitos"
                className={styles.input}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-password`} className={styles.label}>Nova senha</label>
              <input
                id={`${id}-password`}
                type="password"
                autoComplete="new-password"
                placeholder="Pelo menos 8 caracteres"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-confirm`} className={styles.label}>Confirmar senha</label>
              <input
                id={`${id}-confirm`}
                type="password"
                autoComplete="new-password"
                placeholder="Repita a nova senha"
                className={styles.input}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && <p className={styles.formError} role="alert">{error}</p>}

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? 'Salvando…' : 'Redefinir senha'}
            </button>
          </form>

          <Link href="/esqueci-a-senha" className={styles.back}>Enviar novo código</Link>
        </>
      )}

      <Link href="/entrar" className={styles.back}>Voltar para o login</Link>
    </div>
  );
}
