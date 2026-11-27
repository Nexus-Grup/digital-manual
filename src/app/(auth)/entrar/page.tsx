import type { Metadata } from 'next';
import LoginForm from '@/_components/authComponents/LoginForm';
import styles from '@/_styles/cssAuthPage/LoginPage.module.css';

export const metadata: Metadata = { title: 'Entrar | Manual digital' };

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <svg
        className={styles.wave}
        style={{ position: 'absolute', left: 0, bottom: 0, width: '100%' }}
        viewBox="0 0 1366 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2f7fd4" />
            <stop offset="1" stopColor="#7bc67e" />
          </linearGradient>
        </defs>
        <path
          fill="url(#wave-grad)"
          d="M0 120 C40 80 100 50 150 55 C220 62 250 100 300 115 C350 125 380 90 420 55 C450 28 480 20 520 22 C600 25 680 50 760 52 C850 55 920 60 980 75 C1030 88 1070 90 1110 70 C1160 45 1200 10 1250 5 C1300 0 1330 60 1366 130 L1366 260 L0 260 Z"
        />
      </svg>
      <div className={styles.content}>
        <LoginForm />
      </div>
    </main>
  );
}