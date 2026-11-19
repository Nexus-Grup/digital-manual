import Link from "next/link";
import styles from "@/_styles/productSearch/ProductSearch.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import heroStyles from "@/_styles/landingPage/Hero.module.css";
import { getRequestLocale } from "@/_i18n/getRequestLocale";
import { getDictionary } from "@/_i18n/getDictionary";
import { format } from "@/_i18n/config";
import { SHOWCASE_CATEGORIES, filterProducts, getProducts, isShowcaseCategory } from "@/_data/products";
import type { ShowcaseCategory } from "@/_data/products";
import HeroSearch from "@/_components/landingPage/HeroSearch";
import ReadAloud from "@/_components/productComponents/ReadAloud";
import ShowcaseFilters from "@/_components/productSearch/ShowcaseFilters";
import ProductCard from "@/_components/productSearch/ProductCard";
import SnapCarousel from "@/_components/landingPage/SnapCarousel";
import { LeafIcon } from "@/_components/landingPage/Icons";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const firstValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

// Public product search (Cadasio showcase layout adapted to the brand): hero with search, category
// chips, card grid and a B2B call to action. Reads the URL and the locale cookie: render inside <Suspense>.
export default async function ProductSearchView({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const query = firstValue(params.q).trim();
    const categoryParam = firstValue(params.category);
    const category = isShowcaseCategory(categoryParam) ? categoryParam : null;

    const locale = await getRequestLocale();
    const [dict, catalog] = await Promise.all([getDictionary(locale), getProducts()]);
    const t = dict.productSearch;

    const categoryLabels: Record<ShowcaseCategory, string> = {
        appliances: dict.catalog.categories.appliances,
        furniture: dict.catalog.categories.furniture,
        tools: dict.catalog.categories.tools,
        electronics: dict.catalog.categories.electronics,
        other: t.other,
    };

    const results = filterProducts(catalog.products, { query, category, categoryLabels });

    // "Other" only appears when some product falls into it
    const hasOther = catalog.products.some((product) => product.category === "other");
    const filterOptions = [
        { value: null, label: dict.catalog.categories.all },
        ...SHOWCASE_CATEGORIES.map((value) => ({ value, label: categoryLabels[value] })),
        ...(hasOther ? [{ value: "other", label: t.other }] : []),
    ];

    const count = results.length;
    const countText = query
        ? format(count === 1 ? t.countQueryOne : t.countQuery, { count, query })
        : format(count === 1 ? t.countAllOne : t.countAll, { count });

    return (
        <div className={styles["product-search"]} lang={locale}>
            <section className={styles["showcase-hero"]} aria-labelledby="showcase-title">
                <div className={styles["showcase-hero__container"]}>
                    <div className={styles["showcase-hero__content"]}>
                        <h1 className={styles["showcase-hero__title"]} id="showcase-title">
                            {t.title}
                        </h1>
                        <p className={styles["showcase-hero__text"]}>{t.text}</p>
                    </div>
                    <HeroSearch
                        id="products-search"
                        t={t.search}
                        defaultValue={query}
                        category={category ?? undefined}
                    />
                </div>
            </section>

            <section className={styles["showcase"]} aria-labelledby="showcase-count">
                <div className={styles["showcase__container"]}>
                    <div className={styles["showcase__toolbar"]}>
                        <ShowcaseFilters options={filterOptions} active={category} query={query} label={t.filterAria} />
                        <div className={styles["showcase__summary"]}>
                            <h2 className={styles["showcase__count"]} id="showcase-count" aria-live="polite">
                                {countText}
                            </h2>
                            {catalog.isDemo ? <p className={styles["showcase__note"]}>{t.demoNote}</p> : null}
                        </div>
                    </div>

                    {count > 0 ? (
                        // carousel on mobile/tablet, 4-column grid from 1200px
                        <SnapCarousel
                            label={t.resultsAria}
                            goToLabel={dict.carousel.goTo}
                            count={count}
                            resetKey={`${query}|${category ?? ""}`}
                        >
                            <ul className={styles["showcase__grid"]}>
                                {results.map((product) => (
                                    <li className={styles["showcase__item"]} key={product.id}>
                                        <ProductCard
                                            product={product}
                                            categoryLabel={categoryLabels[product.category]}
                                            openLabel={t.openManual}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </SnapCarousel>
                    ) : (
                        <div className={styles["showcase__empty"]}>
                            <p className={styles["showcase__empty-title"]}>
                                {query ? format(t.emptyTitle, { query }) : t.emptyCategory}
                            </p>
                            <p className={styles["showcase__empty-text"]}>{t.emptyText}</p>
                            <md-filled-tonal-button className={buttonStyles["md-button"]} href="/products">
                                {t.clear}
                            </md-filled-tonal-button>
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
                            {t.cta.title}
                        </h2>
                        <p className={styles["showcase-cta__text"]}>{t.cta.text}</p>
                    </div>
                    <Link className={styles["showcase-cta__link"]} href="/landing-page#contato">
                        {t.cta.button}
                    </Link>
                </div>
            </section>

            <ReadAloud lang={locale} labels={dict.readAloud} />
        </div>
    );
}

// Same shape and height as the real content while the locale cookie and the URL are read (no layout shift).
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
