import { Suspense } from "react";

interface PageProps {
  params: Promise<{ productId: string }>;
}

// 1. O componente principal apenas renderiza o Suspense e repassa a Promise
export default function MountingPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MountingContent params={params} />
    </Suspense>
  );
}

// 2. O componente interno resolve a Promise de forma segura
async function MountingContent({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.productId;

  return (
    <main> 
      <h1>Montagem do Produto: {productId}</h1>
      <p>Esta é uma página gerada dinamicamente para o ID do produto acima.</p>
    </main>
  );
}
