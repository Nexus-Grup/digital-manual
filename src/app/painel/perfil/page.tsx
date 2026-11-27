import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getProfileData } from '@/lib/profileData';
import { ProfileView } from '@/_components/userPanelComponents/profile/ProfileView';
import styles from '@/_styles/cssUserPanelPage/Profile.module.css'

// Mesmo padrão dos layouts do painel
export const instant = false;

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Meu perfil" };

export default async function ProfilePage() {
  const me = await getCurrentUser();
  if (!me) redirect('/entrar');

  const data = await getProfileData(me.id);
  return (
    <main id="conteudo" className={styles.container_main}>
      <ProfileView {...data} />
    </main>
  )
}