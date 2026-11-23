import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import InformationView from '@/_components/productComponents/InformationView';
import { getPublicProduct } from '@/_data/publicProduct';

export const instant = false;

export const metadata: Metadata = {
  title: 'Informações do produto | Manual digital',
  description: 'Descrição, fotos e principais recursos da ferramenta.',
};

type PageProps = { params: Promise<{ productId: string }> };

// A leitura do banco fica dentro do <Suspense>: com Cache Components, acessar dados
// sem cache fora dele dá erro ("Uncached data was accessed outside of <Suspense>").
export default function InformationPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <InformationContent params={params} />
    </Suspense>
  );
}

async function InformationContent({ params }: PageProps) {
  const { productId } = await params;
  const product = await getPublicProduct(productId);
  if (!product) notFound();

  // imagem principal primeiro, depois a galeria (sem repetidas)
  const images = [...new Set([product.imgUrl, ...product.gallery].filter((u): u is string => Boolean(u)))];

  return (
    <InformationView
      productName={product.name}
      title={product.information?.title ?? null}
      description={product.information?.description ?? product.description}
      cards={product.information?.cards ?? []}
      model3dUrl={product.model3dUrl}
      images={images}
    />
  );
}