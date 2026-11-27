import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { brandAccess } from "@/lib/productAccess";
import { getProductFull } from "@/lib/productQueries";
import { prisma } from "@/lib/prisma";
import { ProductWizard } from "@/_components/userPanelComponents/products/ProductWizard";
import styles from '@/_styles/cssUserPanelPage/products/Products.module.css'

export const instant = false;

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Editar produto" };

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ etapa?: string }>;
}) {

  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const id = Number((await params).productId);
  if (!Number.isInteger(id) || id <= 0) notFound();


  const row = await prisma.product.findUnique({ where: { id }, select: { brandId: true } });

  if (!row) notFound();

  const access = await brandAccess(user, row.brandId);
  if (!access.canView) notFound();
  // VIEWER só visualiza: nunca edita
  if (!access.canEdit) redirect("/painel/produtos");

  const product = await getProductFull(id, true);
  const step = Math.min(Math.max(Number((await searchParams).etapa) || 1, 1), 7);

  return (
    <main id="conteudo" className={styles.container_main}>
      <ProductWizard product={product} brands={[]} initialStep={step} />;
    </main>
  )
}