// Copie a estrutura (wrapper/layout) da sua página /forgot-password
// e ajuste o caminho do import abaixo para onde está o ResetPasswordForm.
import ResetPasswordForm from '@/_components/authComponents/ResetPasswordForm';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <ResetPasswordForm initialEmail={email ?? ''} />;
}
