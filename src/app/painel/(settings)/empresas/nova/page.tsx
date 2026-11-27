import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { canAccessCompanyArea } from '@/lib/companyAccess';
import { CompanyForm } from '@/_components/userPanelComponents/companies/CompanyForm';
import styles from "@/_styles/cssUserPanelPage/EditCompanies.module.css"

export const instant = false;

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nova empresa" };

export default async function NewCompanyPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/entrar');

  // Membro comum (sem ser ADMIN nem OWNER) não cria empresa
  if (!(await canAccessCompanyArea(user))) notFound();

  return (
    <div className={styles.container_main_page}>
        <CompanyForm mode="create" />
    </div>
  );
}