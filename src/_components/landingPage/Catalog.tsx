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

type Filter = "all" | ShowcaseCategory;

const ORDER: ShowcaseCategory[] = ["appliances", "furniture", "tools", "electronics", "other"];

const CATEGORY_LABELS: Record<Filter, string> = {
    all: "Todos",
    appliances: "Eletrodomésticos",
    furniture: "Móveis",
    tools: "Ferramentas",
    electronics: "Eletrônicos",
    other: "Outros",
};

/** Cards shown on the landing page; the full list lives at /products ("Ver todos os manuais"). */
const MAX_CARDS = 8;

type CatalogProps = {
    /** published products (same list as /products); a product without a photo shows its category icon */
    products: ProductSummary[];
};

export default function Catalog({ products }: CatalogProps) {
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
                    eyebrow="Para quem monta"
                    title="Explore manuais já digitalizados."
                    text="Escolha uma categoria e abra o manual digital: montagem ilustrada, vídeos e recursos de acessibilidade."
                />
                {filters.length > 2 ? (
                    <md-chip-set className={styles["catalog__filters"]} aria-label="Filtrar por categoria">
                        {filters.map((filter) => (
                            <md-filter-chip
                                key={filter}
                                label={CATEGORY_LABELS[filter]}
                                selected={active === filter}
                                onClick={handleChipClick(filter)}
                            ></md-filter-chip>
                        ))}
                    </md-chip-set>
                ) : null}
                <SnapCarousel label="Manuais digitalizados" count={visible.length} resetKey={active}>
                    <ul className={styles["catalog__grid"]} aria-live="polite">
                        {visible.map((product) => (
                            <li className={styles["catalog__item"]} key={product.id}>
                                <ProductCard
                                    product={product}
                                    categoryLabel={CATEGORY_LABELS[product.category]}
                                    openLabel="Abrir manual"
                                />
                            </li>
                        ))}
                    </ul>
                </SnapCarousel>
                <div className={styles["catalog__more"]}>
                    <md-outlined-button suppressHydrationWarning className={buttonStyles["md-button"]} href="/produtos">
                        Ver todos os manuais
                    </md-outlined-button>
                </div>
            </div>
        </section>
    );
}
