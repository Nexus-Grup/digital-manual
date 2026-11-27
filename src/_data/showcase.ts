// Showcase categories and the product search URL (pt-BR). No server code: safe in client components.

/** Showcase categories (strategy: appliances, furniture, tools, electronics) plus a catch-all. */
export const SHOWCASE_CATEGORIES = ["appliances", "furniture", "tools", "electronics"] as const;
export type MainCategory = (typeof SHOWCASE_CATEGORIES)[number];
export type ShowcaseCategory = MainCategory | "other";

/** Second filter level: product types inside each category (e.g. Tools › Drills). */
export const SUBCATEGORIES = {
    appliances: ["refrigerator", "washer", "microwave"],
    furniture: ["wardrobe", "tvStand", "desk"],
    tools: ["screwdriver", "drill", "sander"],
    electronics: ["tv", "speaker", "headphones"],
} as const satisfies Record<MainCategory, readonly string[]>;
export type ShowcaseSubcategory = (typeof SUBCATEGORIES)[MainCategory][number];

export function isShowcaseCategory(value: string | undefined): value is ShowcaseCategory {
    return value === "other" || SHOWCASE_CATEGORIES.includes(value as MainCategory);
}

/** Subcategories of a category (none for "other"). */
export function subcategoriesOf(category: ShowcaseCategory): readonly ShowcaseSubcategory[] {
    return category === "other" ? [] : SUBCATEGORIES[category];
}

/** True only when `value` is a subcategory of `category` (e.g. furniture + drill is rejected). */
export function isShowcaseSubcategory(category: ShowcaseCategory, value: string | undefined): value is ShowcaseSubcategory {
    return subcategoriesOf(category).includes(value as ShowcaseSubcategory);
}

// ===== Search URL (pt-BR): /produtos?busca=parafusadeira&categoria=ferramentas&tipo=furadeiras =====
// Internal values stay in English (code and data); only the URL is in Portuguese.

const CATEGORY_SLUGS: Record<ShowcaseCategory, string> = {
    appliances: "eletrodomesticos",
    furniture: "moveis",
    tools: "ferramentas",
    electronics: "eletronicos",
    other: "outros",
};

const SUBCATEGORY_SLUGS: Record<ShowcaseSubcategory, string> = {
    refrigerator: "geladeiras",
    washer: "lavadoras",
    microwave: "micro-ondas",
    wardrobe: "guarda-roupas",
    tvStand: "racks-e-paineis",
    desk: "escrivaninhas",
    screwdriver: "parafusadeiras",
    drill: "furadeiras",
    sander: "lixadeiras",
    tv: "tvs",
    speaker: "caixas-de-som",
    headphones: "fones-de-ouvido",
};

const fromSlug = <T extends string>(slugs: Record<T, string>, value: string) =>
    (Object.keys(slugs) as T[]).find((key) => slugs[key] === value) ?? value;

export type ProductSearch = {
    query: string;
    category: ShowcaseCategory | null;
    subcategory: ShowcaseSubcategory | null;
};

/** Link to the product search with the given filters (empty filters are left out). */
export function productSearchHref({ query = "", category = null, subcategory = null }: Partial<ProductSearch>): string {
    const params = new URLSearchParams();
    if (query.trim()) params.set("busca", query.trim());
    if (category) params.set("categoria", CATEGORY_SLUGS[category]);
    if (category && subcategory) params.set("tipo", SUBCATEGORY_SLUGS[subcategory]);
    const search = params.toString();
    return search ? `/produtos?${search}` : "/produtos";
}

/** Reads the search filters from the URL. Also accepts the old English links (?q=&category=&sub=). */
export function parseProductSearch(params: Record<string, string | string[] | undefined>): ProductSearch {
    const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
    const query = (first(params.busca) || first(params.q)).trim();
    const categoryValue = fromSlug(CATEGORY_SLUGS, first(params.categoria) || first(params.category));
    const category = isShowcaseCategory(categoryValue) ? categoryValue : null;
    // the type only counts when it belongs to the active category
    const subValue = fromSlug(SUBCATEGORY_SLUGS, first(params.tipo) || first(params.sub));
    const subcategory = category && isShowcaseSubcategory(category, subValue) ? subValue : null;
    return { query, category, subcategory };
}
