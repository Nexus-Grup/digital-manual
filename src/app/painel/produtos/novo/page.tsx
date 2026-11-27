import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { editableBrands } from "@/lib/productQueries";
import { ProductWizard } from "@/_components/userPanelComponents/products/ProductWizard";
import styles from "@/_styles/cssUserPanelPage/products/Products.module.css";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo produto" };

export const instant = false;

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  // só quem pode criar produto em alguma marca (OWNER, MANAGER, ADMIN ou EDITOR da marca)
  const brands = await editableBrands(user);
  if (brands.length === 0) redirect("/painel/produtos");

  return (
    <main id="conteudo" className={styles.container_main}>
      <ProductWizard product={null} brands={brands} initialStep={1} />
    </main>
  );
}