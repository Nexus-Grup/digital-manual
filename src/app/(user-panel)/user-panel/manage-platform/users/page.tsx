import { CreateUserAdmin } from "./CreateUserAdmin";
import styles from '@/_styles/cssUserPanelPage/UsersPage.module.css'

export default function UsersPage() {
  return (
  <main className={styles.container_main}>
        <CreateUserAdmin/>
  </main>
);
}