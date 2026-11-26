"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import styles from "@/_styles/landingPage/Catalog.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaMagnifier from "@/_assets/image/lucca/lucca-magnifier.png";
import SnapCarousel from "@/_components/landingPage/SnapCarousel";
import ProductCard from "@/_components/productSearch/ProductCard";
import type { ProductSummary, ShowcaseCategory } from "@/_data/products";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

type Filter = "all" | ShowcaseCategory;

const ORDER: ShowcaseCategory[] = ["appliances", "furniture", "tools", "electronics", "other"];

/** Cards shown on the landing page; the full list lives at /products ("Ver todos os manuais"). */
const MAX_CARDS = 8;

type CatalogProps = {
    t: Dictionary["catalog"];
    carousel: Dictionary["carousel"];
    /** published products (same list as /products); a product without a photo shows its category icon */
    products: ProductSummary[];
};

export default function Catalog({ t, carousel, products }: CatalogProps) {
    const [active, setActive] = useState<Filter>("all");

    // only the categories that have products get a chip
    const filters: Filter[] = ["all", ...ORDER.filter((c) => products.some((p) => p.category === c))];
    const visible = (active === "all" ? products : products.filter((p) => p.category === active)).slice(0, MAX_CARDS);

    // Filter chips toggle themselves on click; keep exactly one selected (single-select filter).
    const handleChipClick = (filter: Filter) => (event: MouseEvent<HTMLElement>) => {
        (event.currentTarget as HTMLElement & { selected?: boolean }).selected = true;
        setActive(filter);
    };

    return (
        <section className={styles["catalog"]} id="catalogo" aria-labelledby="catalog-title">
            <div className={styles["catalog__container"]}>
                <SectionHeading
                    id="catalog-title"
                    lucca={luccaMagnifier}
                    eyebrow={t.eyebrow}
                    title={t.title}
                    text={t.text}
                />
                {filters.length > 2 ? (
                    <md-chip-set className={styles["catalog__filters"]} aria-label={t.filterAria}>
                        {filters.map((filter) => (
                            <md-filter-chip
                                key={filter}
                                label={t.categories[filter]}
                                selected={active === filter}
                                onClick={handleChipClick(filter)}
                            ></md-filter-chip>
                        ))}
                    </md-chip-set>
                ) : null}
                <SnapCarousel label={t.carouselLabel} goToLabel={carousel.goTo} count={visible.length} resetKey={active}>
                    <ul className={styles["catalog__grid"]} aria-live="polite">
                        {visible.map((product) => (
                            <li className={styles["catalog__item"]} key={product.id}>
                                <ProductCard
                                    product={product}
                                    categoryLabel={t.categories[product.category]}
                                    openLabel={t.openManual}
                                />
                            </li>
                        ))}
                    </ul>
                </SnapCarousel>
                <div className={styles["catalog__more"]}>
                    <md-filled-tonal-button className={buttonStyles["md-button"]} href="/products">
                        {t.viewAll}
                    </md-filled-tonal-button>
                </div>
            </div>
        </section>
    );
}
