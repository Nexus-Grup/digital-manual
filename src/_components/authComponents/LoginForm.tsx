'use client';

import { useId, useState, type FormEvent } from 'react';
import Link from 'next/link';
import styles from '@/_styles/cssAuthPage/Auth.module.css';
import AuthLogo from './AuthLogo';

type Errors = { email?: string; password?: string; form?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}

export default function LoginForm() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!email.trim()) next.email = 'Enter your email';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email';
    if (!password) next.password = 'Enter your password';
    return next;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      // TODO: trocar pela sua autenticação (rota /api/auth/login, Server Action, etc.)
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: email.trim(), password, remember }),
      // });
      // if (!res.ok) throw new Error('Invalid email or password');
      // router.push('/');
      await new Promise((r) => setTimeout(r, 600)); // simulação
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Could not sign in' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <AuthLogo />

      <p className={styles.description}>
        Enter your email and password to access your account
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
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-err` : undefined}
          />
          {errors.email && (
            <span id={`${id}-email-err`} className={styles.error} role="alert">{errors.email}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor={`${id}-password`} className={styles.label}>Password</label>
          <div className={styles.inputWrap}>
            <input
              id={`${id}-password`}
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`${styles.input} ${styles.inputWithIcon}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? `${id}-password-err` : undefined}
            />
            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>
          {errors.password && (
            <span id={`${id}-password-err`} className={styles.error} role="alert">{errors.password}</span>
          )}
        </div>

        <div className={styles.row}>
          <label className={styles.check}>
            <input
              type="checkbox"
              name="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <Link href="/forgot-password" className={styles.link}>Forgot Password</Link>
        </div>

        {errors.form && <p className={styles.formError} role="alert">{errors.form}</p>}

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}