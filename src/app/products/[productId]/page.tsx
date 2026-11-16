interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProdutoPage({ params }: PageProps) {
  // Aguarda a resolução dos parâmetros da URL
  const resolvedParams = await params;
  const productId = resolvedParams.productId;

  return (
    <div className="p-6">
      <h1>Produto: <span className="font-bold">{productId}</span></h1>
      <p>Esta é uma página gerada dinamicamente para o ID do produto acima.</p>
    </div>
  );
}