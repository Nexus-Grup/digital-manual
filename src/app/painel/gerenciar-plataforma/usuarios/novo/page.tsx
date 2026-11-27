import { CreateUserAdmin } from "../CreateUserAdmin";
import styles from "@/_styles/cssUserPanelPage/UsersPage.module.css";

export default function NewUserPage() {
  return (
    <section className={styles.container_main}>
      <CreateUserAdmin />
    </section>
  );
}