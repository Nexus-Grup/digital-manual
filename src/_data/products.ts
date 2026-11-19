// Product catalog for the public search page (/products). Server-only.
import { cacheLife } from "next/cache";
import type { ProductCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeText } from "@/lib/text";

/** Showcase categories (strategy: appliances, furniture, tools, electronics) plus a catch-all. */
export const SHOWCASE_CATEGORIES = ["appliances", "furniture", "tools", "electronics"] as const;
type MainCategory = (typeof SHOWCASE_CATEGORIES)[number];
export type ShowcaseCategory = MainCategory | "other";

/** Second filter level: product types inside each category (e.g. Tools › Drills). */
export const SUBCATEGORIES = {
    appliances: ["refrigerator", "washer", "microwave"],
    furniture: ["wardrobe", "tvStand", "desk"],
    tools: ["screwdriver", "drill", "sander"],
    electronics: ["tv", "speaker", "headphones"],
} as const satisfies Record<MainCategory, readonly string[]>;
export type ShowcaseSubcategory = (typeof SUBCATEGORIES)[MainCategory][number];

export type ProductSummary = {
    id: string;
    name: string;
    model: string | null;
    code: string;
    brand: string;
    category: ShowcaseCategory;
    subcategory: ShowcaseSubcategory | null;
    imgUrl: string | null;
};

type DemoRow = Omit<ProductSummary, "imgUrl">;

// Demo catalog shown while the database has no products: one product per subcategory.
// Ids 8 and 9 already have videos/audio on their product pages (see app/api/products/[productId]);
// brands are fictitious.
const DEMO_PRODUCTS: ProductSummary[] = (
    [
        { id: "1", name: "Geladeira Frost Free 450 L", model: "FF450", code: "MD-GEL-450", brand: "Nexus Home", category: "appliances", subcategory: "refrigerator" },
        { id: "2", name: "Lavadora 12 kg", model: "LV12", code: "MD-LAV-12", brand: "Nexus Home", category: "appliances", subcategory: "washer" },
        { id: "10", name: "Micro-ondas 30 L", model: "MO30", code: "MD-MIC-30", brand: "Nexus Home", category: "appliances", subcategory: "microwave" },
        { id: "3", name: "Guarda-roupa 6 portas", model: "GR6P", code: "MD-GRP-6", brand: "Casa Viva", category: "furniture", subcategory: "wardrobe" },
        { id: "4", name: "Rack para TV R-120", model: "R-120", code: "MD-RCK-120", brand: "Casa Viva", category: "furniture", subcategory: "tvStand" },
        { id: "11", name: "Escrivaninha com gavetas", model: "ES-90", code: "MD-ESC-90", brand: "Casa Viva", category: "furniture", subcategory: "desk" },
        { id: "8", name: "Parafusadeira GSR 120-LI", model: "GSR 120-LI", code: "MD-PAR-120", brand: "Obra Forte", category: "tools", subcategory: "screwdriver" },
        { id: "12", name: "Furadeira de impacto 650 W", model: "FI-650", code: "MD-FUR-650", brand: "Obra Forte", category: "tools", subcategory: "drill" },
        { id: "9", name: "Lixadeira orbital", model: "LX-250", code: "MD-LIX-250", brand: "Obra Forte", category: "tools", subcategory: "sander" },
        { id: "5", name: "Smart TV 55 polegadas", model: "TV55-4K", code: "MD-TV-55", brand: "Pulso Tech", category: "electronics", subcategory: "tv" },
        { id: "6", name: "Caixa de som Bluetooth", model: "BX-200", code: "MD-CXS-200", brand: "Pulso Tech", category: "electronics", subcategory: "speaker" },
        { id: "7", name: "Fone de ouvido Bluetooth", model: "FN-300", code: "MD-FON-300", brand: "Pulso Tech", category: "electronics", subcategory: "headphones" },
    ] satisfies DemoRow[]
).map((row) => ({ ...row, imgUrl: null }));

// The Prisma enum has no appliances/tools values yet: those fall into "other".
const CATEGORY_FROM_DB: Partial<Record<ProductCategory, ShowcaseCategory>> = {
    ELECTRONICS: "electronics",
    FURNITURE: "furniture",
};

/**
 * next/image throws for hosts that are not in next.config.ts images.remotePatterns, which would break the
 * whole page. Only local files and public Supabase Storage URLs are used; anything else falls back to the icon.
 */
function isRenderableImage(url: string | null | undefined): url is string {
    if (!url) return false;
    if (url.startsWith("/") && !url.startsWith("//")) return true;
    try {
        const { protocol, hostname, pathname } = new URL(url);
        return (
            protocol === "https:" &&
            hostname.endsWith(".supabase.co") &&
            pathname.startsWith("/storage/v1/object/public/")
        );
    } catch {
        return false;
    }
}

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
                // product photo: active image galleries, each with its first image (lowest displayOrder)
                galleries: {
                    where: { isActive: true, mediaType: "IMAGE" },
                    orderBy: { id: "asc" },
                    take: 3,
                    select: {
                        mediaUrl: true,
                        images: { orderBy: { displayOrder: "asc" }, take: 1, select: { imageUrl: true } },
                    },
                },
            },
        });
        if (!rows.length) return { products: DEMO_PRODUCTS, isDemo: true };

        const products = rows.map((row): ProductSummary => {
            // first gallery image, then the gallery cover (mediaUrl), then Product.imgUrl; none = category icon
            const candidates = [
                ...row.galleries.flatMap((gallery) => [gallery.images[0]?.imageUrl, gallery.mediaUrl]),
                row.imgUrl,
            ];
            return {
                id: String(row.id),
                name: row.name,
                model: row.model,
                code: row.code,
                brand: row.brand.name,
                category: CATEGORY_FROM_DB[row.category] ?? "other",
                // the Product table has no subcategory column yet
                subcategory: null,
                imgUrl: candidates.find(isRenderableImage) ?? null,
            };
        });
        return { products, isDemo: false };
    } catch (error) {
        console.error("getProducts failed, showing the demo catalog:", error);
        return { products: DEMO_PRODUCTS, isDemo: true };
    }
}

export function isShowcaseCategory(value: string | undefined): value is ShowcaseCategory {
    return value === "other" || SHOWCASE_CATEGORIES.includes(value as MainCategory);
}

/** Subcategories of a category (none for "other"). */
export function subcategoriesOf(category: ShowcaseCategory): readonly ShowcaseSubcategory[] {
    return category === "other" ? [] : SUBCATEGORIES[category];
}

/** True only when `value` is a subcategory of `category` (e.g. ?category=furniture&sub=drill is rejected). */
export function isShowcaseSubcategory(category: ShowcaseCategory, value: string | undefined): value is ShowcaseSubcategory {
    return subcategoriesOf(category).includes(value as ShowcaseSubcategory);
}

type Filter = {
    query: string;
    category: ShowcaseCategory | null;
    subcategory: ShowcaseSubcategory | null;
    /** localized names, so "ferramentas" or "furadeira" also find the products */
    categoryLabels: Record<ShowcaseCategory, string>;
    subcategoryLabels: Record<ShowcaseSubcategory, string>;
};

/** Accent/case-insensitive search: every typed word must appear in name, model, code, brand, category or type. */
export function filterProducts(
    products: ProductSummary[],
    { query, category, subcategory, categoryLabels, subcategoryLabels }: Filter,
) {
    const words = normalizeText(query).split(/\s+/).filter(Boolean);
    return products.filter((product) => {
        if (category && product.category !== category) return false;
        if (subcategory && product.subcategory !== subcategory) return false;
        if (!words.length) return true;
        const haystack = normalizeText(
            [
                product.name,
                product.model,
                product.code,
                product.brand,
                categoryLabels[product.category],
                product.subcategory ? subcategoryLabels[product.subcategory] : "",
            ].join(" "),
        );
        return words.every((word) => haystack.includes(word));
    });
}
