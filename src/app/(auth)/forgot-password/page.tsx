import type { Metadata } from 'next';
import ForgotPasswordForm from '@/_components/authComponents/ForgotPasswordForm';
import styles from '@/_styles/cssAuthPage/ForgotPage.module.css';

export const metadata: Metadata = { title: 'Forgot password | Manual digital' };

export default function ForgotPasswordPage() {
  return (
    <main className={styles.page}>
      <ForgotPasswordForm />
    </main>
  );
}