import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { canAccessCompanyArea } from '@/lib/companyAccess';
import styles from "@/_styles/cssUserPanelPage/EditCompanies.module.css"

export const instant = false;

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Empresas" };

export default async function CompaniesIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/entrar');

  // Membro comum (sem ser ADMIN nem OWNER) não vê a área de empresas
  if (!(await canAccessCompanyArea(user))) notFound();

  return (
    <div className={styles.container_main}>
      <p>Selecione uma empresa à esquerda ou crie uma nova.</p>
    </div>
  );
}