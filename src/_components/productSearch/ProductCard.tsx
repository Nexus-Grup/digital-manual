import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/_styles/productSearch/ProductSearch.module.css";
import type { ProductSummary, ShowcaseCategory } from "@/_data/products";
import { ArrowRightIcon, CubeIcon, DevicesIcon, FridgeIcon, SofaIcon, WrenchIcon } from "@/_components/landingPage/Icons";

const CATEGORY_ICONS: Record<ShowcaseCategory, ReactNode> = {
    appliances: <FridgeIcon size={56} />,
    furniture: <SofaIcon size={56} />,
    tools: <WrenchIcon size={56} />,
    electronics: <DevicesIcon size={56} />,
    other: <CubeIcon size={56} />,
};

// Soft brand tone behind the icon, one per category (Brand Book support colors).
const MEDIA_MODIFIER: Record<ShowcaseCategory, string> = {
    appliances: "product-card__media--appliances",
    furniture: "product-card__media--furniture",
    tools: "product-card__media--tools",
    electronics: "product-card__media--electronics",
    other: "product-card__media--other",
};

type ProductCardProps = {
    product: ProductSummary;
    categoryLabel: string;
    openLabel: string;
};

// Whole card is one link to the product manual (/products/{id}).
export default function ProductCard({ product, categoryLabel, openLabel }: ProductCardProps) {
    const details = [product.brand, product.model].filter(Boolean).join(" · ");

    return (
        <Link className={styles["product-card"]} href={`/products/${product.id}`}>
            <div className={`${styles["product-card__media"]} ${styles[MEDIA_MODIFIER[product.category]]}`}>
                {product.imgUrl ? (
                    <Image
                        className={styles["product-card__image"]}
                        src={product.imgUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1200px) 270px, (min-width: 768px) 44vw, 92vw"
                    />
                ) : (
                    <span className={styles["product-card__icon"]} aria-hidden="true">
                        {CATEGORY_ICONS[product.category]}
                    </span>
                )}
            </div>
            <div className={styles["product-card__body"]}>
                <div className={styles["product-card__content"]}>
                    <p className={styles["product-card__category"]}>{categoryLabel}</p>
                    <h3 className={styles["product-card__title"]}>{product.name}</h3>
                    {details ? <p className={styles["product-card__details"]}>{details}</p> : null}
                </div>
                <span className={styles["product-card__link"]}>
                    {openLabel}
                    <ArrowRightIcon size={18} />
                </span>
            </div>
        </Link>
    );
}
