"use client";

import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import styles from "@/_styles/landingPage/Catalog.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import SnapCarousel from "@/_components/landingPage/SnapCarousel";
import { ArrowRightIcon, DevicesIcon, FridgeIcon, SofaIcon, WrenchIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

type Category = "all" | "appliances" | "furniture" | "tools" | "electronics";

const CATEGORIES: Category[] = ["all", "appliances", "furniture", "tools", "electronics"];

const CATEGORY_ICONS: Record<Exclude<Category, "all">, ReactNode> = {
    appliances: <FridgeIcon />,
    furniture: <SofaIcon />,
    tools: <WrenchIcon />,
    electronics: <DevicesIcon />,
};

// Demo models used to showcase the experience (names/features come from the dictionary, same order).
// The real list comes from the product search.
const PRODUCT_CATEGORIES: Exclude<Category, "all">[] = [
    "appliances",
    "appliances",
    "furniture",
    "furniture",
    "tools",
    "tools",
    "electronics",
    "electronics",
];

type CatalogProps = {
    t: Dictionary["catalog"];
    carousel: Dictionary["carousel"];
};

export default function Catalog({ t, carousel }: CatalogProps) {
    const [active, setActive] = useState<Category>("all");

    const products = t.products.map((product, index) => ({ ...product, category: PRODUCT_CATEGORIES[index] }));
    const visibleProducts = active === "all" ? products : products.filter((product) => product.category === active);

    // Filter chips toggle themselves on click; keep exactly one selected (single-select filter).
    const handleChipClick = (category: Category) => (event: MouseEvent<HTMLElement>) => {
        (event.currentTarget as HTMLElement & { selected?: boolean }).selected = true;
        setActive(category);
    };

    return (
        <section className={styles["catalog"]} id="catalogo" aria-labelledby="catalog-title">
            <div className={styles["catalog__container"]}>
                <SectionHeading
                    id="catalog-title"
                    eyebrow={t.eyebrow}
                    title={t.title}
                    text={t.text}
                />
                <md-chip-set className={styles["catalog__filters"]} aria-label={t.filterAria}>
                    {CATEGORIES.map((category) => (
                        <md-filter-chip
                            key={category}
                            label={t.categories[category]}
                            selected={active === category}
                            onClick={handleChipClick(category)}
                        ></md-filter-chip>
                    ))}
                </md-chip-set>
                <SnapCarousel label={t.carouselLabel} goToLabel={carousel.goTo} count={visibleProducts.length} resetKey={active}>
                    <ul className={styles["catalog__grid"]} aria-live="polite">
                        {visibleProducts.map((product) => (
                            <li className={styles["catalog__card"]} key={product.name}>
                                <span className={styles["catalog__card-icon"]}>{CATEGORY_ICONS[product.category]}</span>
                                <div className={styles["catalog__card-content"]}>
                                    <p className={styles["catalog__card-category"]}>{t.categories[product.category]}</p>
                                    <h3 className={styles["catalog__card-title"]}>{product.name}</h3>
                                </div>
                                <ul className={styles["catalog__tags"]}>
                                    {product.features.map((feature) => (
                                        <li className={styles["catalog__tag"]} key={feature}>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    className={styles["catalog__link"]}
                                    href={`/products?q=${encodeURIComponent(product.name)}`}
                                >
                                    {t.openManual}
                                    <ArrowRightIcon size={18} />
                                </Link>
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
