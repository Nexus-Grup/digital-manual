"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "@/_styles/productSearch/ProductSearch.module.css";

type FilterOption = {
    /** null = "All" */
    value: string | null;
    label: string;
};

type ShowcaseFiltersProps = {
    options: FilterOption[];
    active: string | null;
    /** current search term, kept when switching category */
    query: string;
    label: string;
};

// Category chips (single select). The filter lives in the URL (?category=), so results are
// rendered on the server and the link can be shared.
export default function ShowcaseFilters({ options, active, query, label }: ShowcaseFiltersProps) {
    const router = useRouter();

    const select = (value: string | null) => (event: MouseEvent<HTMLElement>) => {
        // filter chips toggle themselves on click; keep exactly one selected
        (event.currentTarget as HTMLElement & { selected?: boolean }).selected = true;
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (value) params.set("category", value);
        const search = params.toString();
        router.push(search ? `/products?${search}` : "/products", { scroll: false });
    };

    return (
        <md-chip-set className={styles["showcase__filters"]} aria-label={label}>
            {options.map((option) => (
                <md-filter-chip
                    key={option.value ?? "all"}
                    label={option.label}
                    selected={active === option.value}
                    onClick={select(option.value)}
                ></md-filter-chip>
            ))}
        </md-chip-set>
    );
}
