import Link from "next/link";
import styles from "@/_styles/productSearch/ProductSearch.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import heroStyles from "@/_styles/landingPage/Hero.module.css";
import {
    SHOWCASE_CATEGORIES,
    filterProducts,
    getProducts,
    parseProductSearch,
    subcategoriesOf,
} from "@/_data/products";
import type { ShowcaseCategory, ShowcaseSubcategory } from "@/_data/products";
import HeroSearch from "@/_components/landingPage/HeroSearch";
import ReadAloud from "@/_components/productComponents/ReadAloud";
import ShowcaseFilters from "@/_components/productSearch/ShowcaseFilters";
import ProductCard from "@/_components/productSearch/ProductCard";
import SnapCarousel from "@/_components/landingPage/SnapCarousel";
import { LeafIcon } from "@/_components/landingPage/Icons";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const CATEGORY_LABELS: Record<ShowcaseCategory, string> = {
    appliances: "Eletrodomésticos",
    furniture: "Móveis",
    tools: "Ferramentas",
    electronics: "Eletrônicos",
    other: "Outros",
};

const SUBCATEGORY_LABELS: Record<ShowcaseSubcategory, string> = {
    refrigerator: "Geladeiras",
    washer: "Lavadoras",
    microwave: "Micro-ondas",
    wardrobe: "Guarda-roupas",
    tvStand: "Racks e painéis",
    desk: "Escrivaninhas",
    screwdriver: "Parafusadeiras",
    drill: "Furadeiras",
    sander: "Lixadeiras",
    tv: "TVs",
    speaker: "Caixas de som",
    headphones: "Fones de ouvido",
};

const SEARCH_LABELS = {
    label: "Nome, modelo ou código",
    placeholder: "Ex.: parafusadeira, GSR 120-LI",
    aria: "Buscar manual por nome, modelo ou código",
    button: "Buscar",
};


// Public product search (Cadasio showcase layout adapted to the brand): hero with search, category
// chips, card grid and a B2B call to action. Reads the URL: render inside <Suspense>.
export default async function ProductSearchView({ searchParams }: { searchParams: SearchParams }) {
    const { query, category, subcategory } = parseProductSearch(await searchParams);

    const catalog = await getProducts();
    const categoryLabels = CATEGORY_LABELS;
    const subcategoryLabels = SUBCATEGORY_LABELS;

    const results = filterProducts(catalog.products, {
        query,
        category,
        subcategory,
        categoryLabels,
        subcategoryLabels,
    });

    // Second row (progressive disclosure): only after a category is chosen, and only types that have products
    const subcategoryOptions = category
        ? subcategoriesOf(category).filter((sub) =>
              catalog.products.some((product) => product.category === category && product.subcategory === sub),
          )
        : [];

    // Card eyebrow: "Tools › Drills"
    const pathLabel = (product: (typeof results)[number]) =>
        product.subcategory
            ? `${categoryLabels[product.category]} › ${subcategoryLabels[product.subcategory]}`
            : categoryLabels[product.category];

    // "Other" only appears when some product falls into it
    const hasOther = catalog.products.some((product) => product.category === "other");
    const filterOptions = [
        { value: null, label: "Todos" },
        ...SHOWCASE_CATEGORIES.map((value) => ({ value, label: categoryLabels[value] })),
        ...(hasOther ? [{ value: "other", label: CATEGORY_LABELS.other }] : []),
    ];

    const count = results.length;
    const countText = query
        ? count === 1
            ? `1 resultado para “${query}”`
            : `${count} resultados para “${query}”`
        : count === 1
          ? "1 manual disponível"
          : `${count} manuais disponíveis`;

    return (
        <div className={styles["product-search"]}>
            <section className={styles["showcase-hero"]} aria-labelledby="showcase-title">
                <div className={styles["showcase-hero__container"]}>
                    <div className={styles["showcase-hero__content"]}>
                        <h1 className={styles["showcase-hero__title"]} id="showcase-title">
                            Encontre o manual do seu produto
                        </h1>
                        <p className={styles["showcase-hero__text"]}>
                            Pesquise pelo nome, modelo ou código, ou aponte a câmera para o QR Code da embalagem.
                        </p>
                    </div>
                    <HeroSearch
                        id="products-search"
                        t={SEARCH_LABELS}
                        defaultValue={query}
                        category={category ?? undefined}
                        subcategory={subcategory ?? undefined}
                    />
                </div>
            </section>

            <section className={styles["showcase"]} aria-labelledby="showcase-count">
                <div className={styles["showcase__container"]}>
                    <div className={styles["showcase__toolbar"]}>
                        <div className={styles["showcase__filter-group"]}>
                            <ShowcaseFilters
                                level="category"
                                options={filterOptions}
                                active={category}
                                query={query}
                                category={category}
                                label="Filtrar por categoria"
                            />
                            {subcategoryOptions.length > 0 ? (
                                <ShowcaseFilters
                                    level="subcategory"
                                    options={[
                                        { value: null, label: "Todas" },
                                        ...subcategoryOptions.map((value) => ({ value, label: subcategoryLabels[value] })),
                                    ]}
                                    active={subcategory}
                                    query={query}
                                    category={category}
                                    label="Filtrar por tipo de produto"
                                />
                            ) : null}
                        </div>
                        <div className={styles["showcase__summary"]}>
                            <h2 className={styles["showcase__count"]} id="showcase-count" aria-live="polite">
                                {countText}
                            </h2>
                        </div>
                    </div>

                    {count > 0 ? (
                        // carousel on mobile/tablet, 4-column grid from 1200px
                        <SnapCarousel
                            label="Manuais encontrados"
                            count={count}
                            resetKey={`${query}|${category ?? ""}|${subcategory ?? ""}`}
                        >
                            <ul className={styles["showcase__grid"]}>
                                {results.map((product) => (
                                    <li className={styles["showcase__item"]} key={product.id}>
                                        <ProductCard
                                            product={product}
                                            categoryLabel={pathLabel(product)}
                                            openLabel="Abrir manual"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </SnapCarousel>
                    ) : (
                        <div className={styles["showcase__empty"]}>
                            <p className={styles["showcase__empty-title"]}>
                                {query ? `Não encontramos manuais para “${query}”` : "Ainda não há manuais nesta categoria"}
                            </p>
                            <p className={styles["showcase__empty-text"]}>Confira o nome ou o código na etiqueta ou na embalagem do produto e tente de novo.</p>
                            <md-outlined-button suppressHydrationWarning className={buttonStyles["md-button"]} href="/produtos">
                                Ver todos os manuais
                            </md-outlined-button>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles["showcase-cta"]} aria-labelledby="showcase-cta-title">
                <div className={styles["showcase-cta__container"]}>
                    <span className={styles["showcase-cta__icon"]} aria-hidden="true">
                        <LeafIcon size={28} />
                    </span>
                    <div className={styles["showcase-cta__content"]}>
                        <h2 className={styles["showcase-cta__title"]} id="showcase-cta-title">
                            É fabricante? Digitalize os manuais da sua marca.
                        </h2>
                        <p className={styles["showcase-cta__text"]}>Menos papel, menos chamados no SAC e um manual acessível para todos os seus clientes.</p>
                    </div>
                    <Link className={styles["showcase-cta__link"]} href="/inicio#contato">
                        Fale conosco
                    </Link>
                </div>
            </section>

            <ReadAloud lang="pt-BR" />
        </div>
    );
}

// Same shape and height as the real content while the URL is read (no layout shift).
export function ProductSearchFallback() {
    return (
        <div className={styles["product-search"]} aria-busy="true">
            <section className={styles["showcase-hero"]}>
                <div className={styles["showcase-hero__container"]}>
                    <div className={styles["showcase-hero__content"]}>
                        <span className={`${styles["skeleton"]} ${styles["skeleton--title"]}`}></span>
                        <span className={`${styles["skeleton"]} ${styles["skeleton--text"]}`}></span>
                    </div>
                    <span className={`${heroStyles["hero__search"]} ${styles["skeleton--search"]}`}></span>
                </div>
            </section>
            <section className={styles["showcase"]}>
                <div className={styles["showcase__container"]}>
                    <span className={`${styles["skeleton"]} ${styles["skeleton--chips"]}`}></span>
                    <div className={styles["showcase__grid"]}>
                        {Array.from({ length: 4 }, (_, index) => (
                            <span className={`${styles["skeleton"]} ${styles["skeleton--card"]}`} key={index}></span>
                        ))}
                    </div>
                    {/* room for the carousel dots (mobile/tablet only) */}
                    <span className={styles["skeleton--dots"]}></span>
                </div>
            </section>
        </div>
    );
}
