'use client';

import { useId, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/_styles/cssAuthPage/Auth.module.css';
import AuthLogo from './AuthLogo';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return setError('Enter your email');
    if (!EMAIL_RE.test(email.trim())) return setError('Enter a valid email');
    setError('');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      await new Promise((r) => setTimeout(r, 600)); // simulação
      setSent(true);
    } catch {
      setError('Could not send the link. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <AuthLogo />

      <h1 className={styles.title}>Forgot your password?</h1>

      {sent ? (
        <div className={styles.success} role="status">
          <p>
            If an account exists for <strong>{email.trim()}</strong>, we sent a link to reset
            your password.
          </p>
        </div>
      ) : (
        <>
          <p className={styles.description}>
            Enter your email and we will send you a link to reset your password.
          </p>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor={`${id}-email`} className={styles.label}>Email</label>
              <input
                id={`${id}-email`}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-err` : undefined}
              />
              {error && <span id={`${id}-err`} className={styles.error} role="alert">{error}</span>}
            </div>

            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </>
      )}

      <Link href="/login" className={styles.back}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to sign in
      </Link>
    </div>
  );
}