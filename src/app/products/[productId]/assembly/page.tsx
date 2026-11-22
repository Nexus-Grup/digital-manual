import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import styles from "@/_styles/cssProductPage/Assembly.module.css";
import { getAssembly } from "@/_data/getAssembly";
import AssemblyViewer from "@/_components/productComponents/AssemblyViewer";
import ProductTextCard from "@/_components/productComponents/ProductTextCard";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export const metadata: Metadata = {
  title: "Instruções de montagem | Manual digital",
  description: "Passo a passo ilustrado para montar a ferramenta.",
};

export default function MountingPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MountingContent params={params} />
    </Suspense>
  );
}

async function MountingContent({ params }: PageProps) {
  const { productId } = await params;
  const assembly = await getAssembly(productId);
  if (!assembly || assembly.steps.length === 0) notFound();

  return (
    <section className={styles["assembly"]}>
      <div className={styles["assembly__container"]}>
        <ProductTextCard
          title={assembly.title}
          productName={assembly.productName}
          description={assembly.description}
        />

        <AssemblyViewer steps={assembly.steps} />
      </div>
    </section>
  );
}
