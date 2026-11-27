import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import InformationView from '@/_components/productComponents/InformationView';
import LuccaLoader from '@/_components/global/LuccaLoader';
import { getPublicProduct } from '@/_data/publicProduct';
import { toSpecs } from '@/_lib/productSpecs';

export const instant = false;

export const metadata: Metadata = {
  title: 'Informações do produto | Manual digital',
  description: 'Descrição, fotos e principais recursos da ferramenta.',
};

type PageProps = { params: Promise<{ productId: string }> };

const MAX_CHIPS = 4;

// The database read stays inside <Suspense>: with Cache Components, reading uncached data
// outside of it throws ("Uncached data was accessed outside of <Suspense>").
export default function InformationPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LuccaLoader />}>
      <InformationContent params={params} />
    </Suspense>
  );
}

async function InformationContent({ params }: PageProps) {
  const { productId } = await params;
  const product = await getPublicProduct(productId);
  if (!product) notFound();

  // main image first, then the gallery (no duplicates)
  const images = [...new Set([product.imgUrl, ...product.gallery].filter((u): u is string => Boolean(u)))];

  return (
    <InformationView
      productName={product.name}
      title={product.information?.title ?? null}
      description={product.information?.description ?? product.description}
      cards={product.information?.cards ?? []}
      chips={toSpecs(product.technical?.specs, MAX_CHIPS)}
      model3dUrl={product.model3dUrl}
      images={images}
    />
  );
}
