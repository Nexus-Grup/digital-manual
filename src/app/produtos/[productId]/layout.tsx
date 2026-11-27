import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import ProductHeader, { ProductHeaderFallback } from "@/_components/productComponents/ProductHeader";
import HubButton from "@/_components/productComponents/hubButton";
import VideoShell from "@/_components/productComponents/VideoShell";
import { VideosProvider } from "@/_components/productComponents/VideosContext";
import { getVideos } from "@/_data/getVideos";
import { getAudios } from "@/_data/geAudios";
import { getProductSections } from "@/_data/productSections";
import ReadAloud from "@/_components/productComponents/ReadAloud";
import ProductTracker from "@/_components/productComponents/ProductTracker";
import styles from "@/_styles/cssProductPage/ProductLayout.module.css";

export const metadata: Metadata = {
  title: "Manual Digital",
  description: "Manual digital do produto: montagem passo a passo, manual com busca, informações e vídeos.",
};

export const instant = false;

async function VideosLoader({
  params,
  children,
}: {
  params: Promise<{ productId: string }>;
  children: ReactNode;
}) {
  const { productId } = await params;
  const [videos, audio] = await Promise.all([
    getVideos(productId),
    getAudios(productId),
  ]);

  return (
    <VideoShell
      videos={videos}
      audioUrl={audio?.url ?? null}
      productName={audio?.productName}
      productId={productId}
    >
      {children}
    </VideoShell>
  );
}

// Header and hub bar only link to the pages this product has content for (no 404 from the menu).
async function ProductHeaderLoader({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  return <ProductHeader sections={await getProductSections(productId)} />;
}

async function HubLoader({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  return <HubButton sections={await getProductSections(productId)} />;
}

export default function RootLayout({
  children,
  params,
}: LayoutProps<"/produtos/[productId]">) {
  return (
    <main id="conteudo" className={`container-global ${styles.app}`}>
      <VideosProvider>
        <Suspense fallback={<ProductHeaderFallback />}>
          <ProductHeaderLoader params={params} />
        </Suspense>
        <div className={styles.stage}>
          <Suspense fallback={null}>
            <VideosLoader params={params}>{children}</VideosLoader>
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <HubLoader params={params} />
        </Suspense>
        <ReadAloud lang="pt-BR" />
        {/* counts visits for the panel indicators (renders nothing) */}
        <ProductTracker />
      </VideosProvider>
    </main>
  );
}