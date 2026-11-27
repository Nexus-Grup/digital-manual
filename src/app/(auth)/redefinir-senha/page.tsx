import ResetPasswordForm from '@/_components/authComponents/ResetPasswordForm';
import styles from '@/_styles/cssAuthPage/ForgotPage.module.css';

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Redefinir senha | Manual digital" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  // same wrapper as /esqueci-a-senha
  return (
    <main id="conteudo" className={styles.page}>
      <ResetPasswordForm initialEmail={email ?? ''} />
    </main>
  );
}
