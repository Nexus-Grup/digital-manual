import type { Metadata } from "next";
import { Suspense } from "react";
// Same root as the landing page: colors and Material 3 theme tokens (the brand font comes from <body>).
import landingStyles from "@/_styles/landingPage/LandingPage.module.css";
import MaterialRegistry from "@/_components/landingPage/MaterialRegistry";
import ProductHeader, { ProductHeaderFallback } from "@/_components/productComponents/ProductHeader";
import ProductSearchView, { ProductSearchFallback } from "@/_components/productSearch/ProductSearchView";

export const metadata: Metadata = {
    title: "Encontre o manual do seu produto | Manual digital",
    description:
        "Pesquise pelo nome, modelo ou código e abra o manual digital do seu produto, com vídeos, Libras e leitura em voz alta.",
};

// Public product search: besides the QR Code on the box, users can find any manual here.
export default function ProductsPage({ searchParams }: PageProps<"/products">) {
    return (
        <div className={landingStyles["landing"]}>
            <MaterialRegistry />
            <Suspense fallback={<ProductHeaderFallback />}>
                <ProductHeader />
            </Suspense>
            <main className={landingStyles["landing__main"]}>
                <Suspense fallback={<ProductSearchFallback />}>
                    <ProductSearchView searchParams={searchParams} />
                </Suspense>
            </main>
        </div>
    );
}
