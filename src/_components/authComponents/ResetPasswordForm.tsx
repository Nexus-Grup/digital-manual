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

    if (!EMAIL_RE.test(email.trim())) return setError('Enter a valid email');
    if (!/^\d{6}$/.test(code)) return setError('Enter the 6-digit code');
    if (password.length < 8) return setError('Password must have at least 8 characters');
    if (password !== confirm) return setError('Passwords do not match');
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
        setError(typeof data?.error === 'string' ? data.error : 'Could not reset the password');
        return;
      }
      setDone(true);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <AuthLogo />

      <h1 className={styles.title}>Reset your password</h1>

      {done ? (
        <div className={styles.success} role="status">
          <p>Your password was changed. You can sign in with the new password.</p>
        </div>
      ) : (
        <>
          <p className={styles.description}>
            Enter the code we sent to your email and choose a new password.
          </p>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor={`${id}-email`} className={styles.label}>Email</label>
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-code`} className={styles.label}>Code</label>
              <input
                id={`${id}-code`}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6-digit code"
                className={styles.input}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-password`} className={styles.label}>New password</label>
              <input
                id={`${id}-password`}
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-confirm`} className={styles.label}>Confirm password</label>
              <input
                id={`${id}-confirm`}
                type="password"
                autoComplete="new-password"
                placeholder="Repeat the new password"
                className={styles.input}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && <p className={styles.formError} role="alert">{error}</p>}

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? 'Saving…' : 'Reset password'}
            </button>
          </form>

          <Link href="/forgot-password" className={styles.back}>Send a new code</Link>
        </>
      )}

      <Link href="/login" className={styles.back}>Back to sign in</Link>
    </div>
  );
}
