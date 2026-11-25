import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import styles from "@/_styles/cssProductPage/ProductView.module.css";
import { getAssembly } from "@/_data/getAssembly";
import AssemblyViewer from "@/_components/productComponents/AssemblyViewer";
import LuccaLoader from "@/_components/global/LuccaLoader";

interface PageProps {
  params: Promise<{ productId: string }>;
}
export const instant = false;
export const metadata: Metadata = {
  title: "Instruções de montagem | Manual digital",
  description: "Passo a passo ilustrado para montar a ferramenta.",
};

export default function MountingPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LuccaLoader />}>
      <MountingContent params={params} />
    </Suspense>
  );
}

async function MountingContent({ params }: PageProps) {
  const { productId } = await params;
  const assembly = await getAssembly(productId);
  if (!assembly || assembly.steps.length === 0) notFound();

  return (
    <section className={styles["product-view"]}>
      <div className={styles["product-view__container"]}>
        <AssemblyViewer assembly={assembly} />
      </div>
    </section>
  );
}
