"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "@/_styles/productSearch/ProductSearch.module.css";
import { productSearchHref, type ShowcaseCategory, type ShowcaseSubcategory } from "@/_data/showcase";

type FilterOption = {
    /** null = "All" */
    value: string | null;
    label: string;
};

type ShowcaseFiltersProps = {
    /** "category" (first row) or "subcategory" (second row, shown once a category is chosen) */
    level: "category" | "subcategory";
    options: FilterOption[];
    active: string | null;
    /** current search term and category, kept in the URL when filtering */
    query: string;
    category: string | null;
    label: string;
};

// Filter chips (single select). The filters live in the URL (?categoria=&tipo=), so results are rendered
// on the server and the link can be shared. Changing the category resets the subcategory.
export default function ShowcaseFilters({ level, options, active, query, category, label }: ShowcaseFiltersProps) {
    const router = useRouter();

    const select = (value: string | null) => (event: MouseEvent<HTMLElement>) => {
        // filter chips toggle themselves on click; keep exactly one selected
        (event.currentTarget as HTMLElement & { selected?: boolean }).selected = true;
        const href =
            level === "category"
                ? productSearchHref({ query, category: value as ShowcaseCategory | null })
                : productSearchHref({
                      query,
                      category: category as ShowcaseCategory | null,
                      subcategory: value as ShowcaseSubcategory | null,
                  });
        router.push(href, { scroll: false });
    };

    const className =
        level === "subcategory"
            ? `${styles["showcase__filters"]} ${styles["showcase__filters--sub"]}`
            : styles["showcase__filters"];

    return (
        <md-chip-set suppressHydrationWarning className={className} aria-label={label}>
            {options.map((option) => (
                <md-filter-chip
                    suppressHydrationWarning
                    key={option.value ?? "all"}
                    label={option.label}
                    selected={active === option.value}
                    onClick={select(option.value)}
                ></md-filter-chip>
            ))}
        </md-chip-set>
    );
}
