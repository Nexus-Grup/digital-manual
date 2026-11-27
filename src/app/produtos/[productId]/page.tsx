import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import LuccaLoader from '@/_components/global/LuccaLoader';
import ProductHome from '@/_components/productComponents/home/ProductHome';
import { getPublicProduct } from '@/_data/publicProduct';
import { getAssembly } from '@/_data/getAssembly';

export const instant = false;

export const metadata: Metadata = {
  title: 'Início | Manual digital',
  description: 'Conheça a ferramenta: destaques, ficha técnica, montagem ilustrada, manual e vídeos em um só lugar.',
};

type PageProps = { params: Promise<{ productId: string }> };

// The database read stays inside <Suspense> (Cache Components).
export default function ProductHomePage({ params }: PageProps) {
  return (
    <Suspense fallback={<LuccaLoader />}>
      <ProductHomeContent params={params} />
    </Suspense>
  );
}

async function ProductHomeContent({ params }: PageProps) {
  const { productId } = await params;
  const [product, assembly] = await Promise.all([getPublicProduct(productId), getAssembly(productId)]);
  if (!product) notFound();

  return <ProductHome product={product} assembly={assembly} />;
}
