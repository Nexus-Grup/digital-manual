import { Suspense } from "react";
import styles from '@/_styles/cssProductPage/InformationPage.module.css'
interface PageProps {
  params: Promise<{ productId: string }>;
}

// 1. Componente principal que define a fronteira de Suspense
export default function InformationPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <InformationContent params={params} />
    </Suspense>
  );
}

// 2. Componente interno que resolve os parâmetros de forma segura
async function InformationContent({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.productId;

  return (
    <main className={styles.container}>
      <h1>Informações do Produto: {productId}</h1>
      <p>Esta é uma página gerada dinamicamente para o ID do produto acima.</p>
    </main>
  );
}
