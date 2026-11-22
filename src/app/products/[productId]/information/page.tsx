import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import styles from "@/_styles/cssProductPage/ProductInfo.module.css";
import { getInformation } from "@/_data/getInformation";
import InfoFeatureList from "@/_components/productComponents/InfoFeatureList";
import ProductGallery from "@/_components/productComponents/ProductGallery";
import ProductTextCard from "@/_components/productComponents/ProductTextCard";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export const metadata: Metadata = {
  title: "Informações do produto | Manual digital",
  description: "Descrição, fotos e principais recursos da ferramenta.",
};

export default function InformationPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <InformationContent params={params} />
    </Suspense>
  );
}

async function InformationContent({ params }: PageProps) {
  const { productId } = await params;
  const info = await getInformation(productId);
  if (!info) notFound();

  return (
    <section className={styles["product-info"]}>
      <div className={styles["product-info__container"]}>
        <ProductTextCard
          title={info.title}
          productName={info.productName}
          description={info.description}
        />

        <div className={styles["product-info__body"]}>
          <ProductGallery images={info.gallery} />
          {info.features.length > 0 && <InfoFeatureList features={info.features} />}
        </div>
      </div>
    </section>
  );
}
