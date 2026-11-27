import type { Metadata } from "next";
import LandingPageView from "@/_components/landingPage/LandingPageView";
import { getProducts } from "@/_data/products";

// Landing page (pt-BR). Other languages: automatic translation from the header language menu.
export const metadata: Metadata = {
    title: "Manual digital | O manual do futuro: interativo, acessível e sustentável",
    description:
        "Troque manuais de papel confusos por manuais digitais em 3D, acessíveis e via QR Code. Para quem monta, um guia intuitivo; para marcas, menos custo, metas ESG e menos chamados no SAC.",
};

export default async function LandingPage() {
    // catalog section: published products (cached for a few minutes, same as /products)
    const catalog = await getProducts();
    return <LandingPageView products={catalog.products} />;
}
