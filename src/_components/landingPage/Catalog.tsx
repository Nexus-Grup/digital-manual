"use client";

import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import styles from "@/_styles/landingPage/Catalog.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import { ArrowRightIcon, DevicesIcon, FridgeIcon, SofaIcon, WrenchIcon } from "@/_components/landingPage/Icons";

type Category = "all" | "appliances" | "furniture" | "tools" | "electronics";

const CATEGORIES: { id: Category; label: string }[] = [
    { id: "all", label: "Todos" },
    { id: "appliances", label: "Eletrodomésticos" },
    { id: "furniture", label: "Móveis" },
    { id: "tools", label: "Ferramentas" },
    { id: "electronics", label: "Eletrônicos" },
];

const CATEGORY_ICONS: Record<Exclude<Category, "all">, ReactNode> = {
    appliances: <FridgeIcon />,
    furniture: <SofaIcon />,
    tools: <WrenchIcon />,
    electronics: <DevicesIcon />,
};

// Demo models used to showcase the experience; the real list comes from the product search.
const PRODUCTS: { name: string; category: Exclude<Category, "all">; features: string[] }[] = [
    { name: "Geladeira Frost Free 450 L", category: "appliances", features: ["3D 360°", "Vídeos", "Libras"] },
    { name: "Lavadora 12 kg", category: "appliances", features: ["Checklist", "Voz alta"] },
    { name: "Guarda-roupa 6 portas", category: "furniture", features: ["Vista explodida", "Checklist"] },
    { name: "Rack para TV R-120", category: "furniture", features: ["3D 360°", "Libras"] },
    { name: "Parafusadeira 12 V", category: "tools", features: ["Vídeos", "Segurança"] },
    { name: "Furadeira de impacto 650 W", category: "tools", features: ["3D 360°", "Voz alta"] },
    { name: "Smart TV 55 polegadas", category: "electronics", features: ["Configuração", "Libras"] },
    { name: "Caixa de som Bluetooth", category: "electronics", features: ["Vídeos", "Idiomas"] },
];

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((category) => [category.id, category.label]));

export default function Catalog() {
    const [active, setActive] = useState<Category>("all");

    const visibleProducts = active === "all" ? PRODUCTS : PRODUCTS.filter((product) => product.category === active);

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
                    eyebrow="Para quem monta"
                    title="Explore manuais já digitalizados."
                    text="Escolha uma categoria e teste na hora a experiência 3D e os recursos de acessibilidade. Modelos demonstrativos."
                />
                <md-chip-set className={styles["catalog__filters"]} aria-label="Filtrar por categoria">
                    {CATEGORIES.map((category) => (
                        <md-filter-chip
                            key={category.id}
                            label={category.label}
                            selected={active === category.id}
                            onClick={handleChipClick(category.id)}
                        ></md-filter-chip>
                    ))}
                </md-chip-set>
                <ul className={styles["catalog__grid"]} aria-live="polite">
                    {visibleProducts.map((product) => (
                        <li className={styles["catalog__card"]} key={product.name}>
                            <span className={styles["catalog__card-icon"]}>{CATEGORY_ICONS[product.category]}</span>
                            <div className={styles["catalog__card-content"]}>
                                <p className={styles["catalog__card-category"]}>{CATEGORY_LABELS[product.category]}</p>
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
                                Abrir manual
                                <ArrowRightIcon size={18} />
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className={styles["catalog__more"]}>
                    <md-filled-tonal-button className={buttonStyles["md-button"]} href="/products">Ver todos os manuais</md-filled-tonal-button>
                </div>
            </div>
        </section>
    );
}
