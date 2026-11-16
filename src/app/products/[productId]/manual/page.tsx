import { Suspense } from "react";

interface PageProps {
  params: Promise<{ productId: string }>;
}

// 1. Deixe o componente da página limpo e passe o params para o Suspense
export default function ManualPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ManualContent params={params} />
    </Suspense>
  );
}

// 2. Crie um componente interno para ler o ID de forma assíncrona
async function ManualContent({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.productId;

  return (
    <main>
      <h1>Manual do Produto: {productId}</h1>
      <p>Esta é uma página gerada dinamicamente para o ID do produto acima.</p>
    </main>
  );
}