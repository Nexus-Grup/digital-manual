import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "@/_styles/cssProductPage/ProductInfo.module.css";
import { getInformation } from "@/_data/getInformation";
import InfoFeatureList from "@/_components/productComponents/InfoFeatureList";
import ImagePlaceholder from "@/_components/productComponents/ImagePlaceholder";
import ProductTextCard from "@/_components/productComponents/ProductTextCard";
import { Rotate360Icon } from "@/_components/productComponents/TabIcons";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export const metadata: Metadata = {
  title: "Informações do produto | Manual digital",
  description: "Descrição, foto e principais recursos da ferramenta.",
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

        <div className={styles["product-info__showcase"]}>
          <div className={styles["product-info__media"]}>
            {info.imageUrl ? (
              <Image
                className={styles["product-info__image"]}
                src={info.imageUrl}
                alt={info.imageAlt}
                fill
                sizes="(min-width: 1200px) 300px, (min-width: 768px) 40vw, 70vw"
                fetchPriority="high"
              />
            ) : (
              <ImagePlaceholder alt={info.imageAlt} caption="Imagem do produto" />
            )}
            {/* anchored to the image's right edge so it doesn't push the image off center */}
            <span className={styles["product-info__360"]}>
              <Rotate360Icon />
            </span>
          </div>
        </div>

        {info.features.length > 0 && <InfoFeatureList features={info.features} />}
      </div>
    </section>
  );
}
