import { CreateUserAdmin } from "../CreateUserAdmin";
import styles from "@/_styles/cssUserPanelPage/UsersPage.module.css";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo usuário" };

export default function NewUserPage() {
  return (
    <main id="conteudo" className={styles.container_main}>
      <CreateUserAdmin />
    </main>
  );
}