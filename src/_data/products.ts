// Product catalog for the public search page (/products). Server-only.
import { cacheLife } from "next/cache";
import type { ProductCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeText } from "@/lib/text";

/** Showcase categories (strategy: appliances, furniture, tools, electronics) plus a catch-all. */
export const SHOWCASE_CATEGORIES = ["appliances", "furniture", "tools", "electronics"] as const;
export type ShowcaseCategory = (typeof SHOWCASE_CATEGORIES)[number] | "other";

export type ProductSummary = {
    id: string;
    name: string;
    model: string | null;
    code: string;
    brand: string;
    category: ShowcaseCategory;
    imgUrl: string | null;
};

// Demo catalog shown while the database has no products. Ids 8 and 9 already have videos/audio
// on their product pages (see app/api/products/[productId]); brands are fictitious.
const DEMO_PRODUCTS: ProductSummary[] = [
    { id: "1", name: "Geladeira Frost Free 450 L", model: "FF450", code: "MD-GEL-450", brand: "Nexus Home", category: "appliances", imgUrl: null },
    { id: "2", name: "Lavadora 12 kg", model: "LV12", code: "MD-LAV-12", brand: "Nexus Home", category: "appliances", imgUrl: null },
    { id: "3", name: "Guarda-roupa 6 portas", model: "GR6P", code: "MD-GRP-6", brand: "Casa Viva", category: "furniture", imgUrl: null },
    { id: "4", name: "Rack para TV R-120", model: "R-120", code: "MD-RCK-120", brand: "Casa Viva", category: "furniture", imgUrl: null },
    { id: "8", name: "Parafusadeira GSR 120-LI", model: "GSR 120-LI", code: "MD-PAR-120", brand: "Obra Forte", category: "tools", imgUrl: null },
    { id: "9", name: "Lixadeira orbital", model: "LX-250", code: "MD-LIX-250", brand: "Obra Forte", category: "tools", imgUrl: null },
    { id: "5", name: "Smart TV 55 polegadas", model: "TV55-4K", code: "MD-TV-55", brand: "Pulso Tech", category: "electronics", imgUrl: null },
    { id: "6", name: "Caixa de som Bluetooth", model: "BX-200", code: "MD-CXS-200", brand: "Pulso Tech", category: "electronics", imgUrl: null },
];

// The Prisma enum has no appliances/tools values yet: those fall into "other".
const CATEGORY_FROM_DB: Partial<Record<ProductCategory, ShowcaseCategory>> = {
    ELECTRONICS: "electronics",
    FURNITURE: "furniture",
};

export type ProductCatalog = {
    products: ProductSummary[];
    /** true while the database is empty and the demo catalog is shown */
    isDemo: boolean;
};

export async function getProducts(): Promise<ProductCatalog> {
    "use cache";
    cacheLife("minutes");

    try {
        const rows = await prisma.product.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                model: true,
                code: true,
                imgUrl: true,
                category: true,
                brand: { select: { name: true } },
            },
        });
        if (!rows.length) return { products: DEMO_PRODUCTS, isDemo: true };

        const products = rows.map((row): ProductSummary => ({
            id: String(row.id),
            name: row.name,
            model: row.model,
            code: row.code,
            brand: row.brand.name,
            category: CATEGORY_FROM_DB[row.category] ?? "other",
            imgUrl: row.imgUrl,
        }));
        return { products, isDemo: false };
    } catch (error) {
        console.error("getProducts failed, showing the demo catalog:", error);
        return { products: DEMO_PRODUCTS, isDemo: true };
    }
}

export function isShowcaseCategory(value: string | undefined): value is ShowcaseCategory {
    return value === "other" || SHOWCASE_CATEGORIES.includes(value as (typeof SHOWCASE_CATEGORIES)[number]);
}

type Filter = {
    query: string;
    category: ShowcaseCategory | null;
    /** localized category names, so "ferramentas" also finds the tools */
    categoryLabels: Record<ShowcaseCategory, string>;
};

/** Accent/case-insensitive search: every typed word must appear in name, model, code, brand or category. */
export function filterProducts(products: ProductSummary[], { query, category, categoryLabels }: Filter) {
    const words = normalizeText(query).split(/\s+/).filter(Boolean);
    return products.filter((product) => {
        if (category && product.category !== category) return false;
        if (!words.length) return true;
        const haystack = normalizeText(
            [product.name, product.model, product.code, product.brand, categoryLabels[product.category]].join(" "),
        );
        return words.every((word) => haystack.includes(word));
    });
}
