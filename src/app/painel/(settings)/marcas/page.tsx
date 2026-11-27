import type { Metadata } from "next";
import styles from "@/_styles/cssUserPanelPage/EditBrands.module.css";

export const metadata: Metadata = { title: "Marcas" };

export default function BrandsPage() {
  return (
    <div className={styles.container_main}>
      <p>Selecione uma marca à esquerda ou crie uma nova.</p>
    </div>
  );
}
