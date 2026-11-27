// Exemplo para src/app/painel/(settings)/marcas/[brandId]/page.tsx
export default async function BrandPage({
  params,
}: {
  params: Promise<{ brandId: string }>;
}) {
  const { brandId } = await params;

  return <div>Marca: {brandId}</div>;
}