"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "@/_styles/landingPage/Hero.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import { SearchIcon } from "@/_components/landingPage/Icons";
import { productSearchHref, type ShowcaseCategory, type ShowcaseSubcategory } from "@/_data/showcase";

type HeroSearchProps = {
    t: {
        label: string;
        placeholder: string;
        aria: string;
        button: string;
    };
    /** Field id (the landing hero and the /products page each have their own). */
    id?: string;
    /** Current search term, so the field keeps it on the results page. */
    defaultValue?: string;
    /** Active category and subcategory filters on /products, kept when searching again. */
    category?: string;
    subcategory?: string;
    /** Soft pulsing halo around the field to draw attention (landing hero only). */
    pulse?: boolean;
};

// Manual search for end users: name, model or product code. Results live at /produtos?busca=...
export default function HeroSearch({
    t,
    id = "hero-search",
    defaultValue,
    category,
    subcategory,
    pulse = false,
}: HeroSearchProps) {
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = String(new FormData(event.currentTarget).get("busca") ?? "");
        // results page: /produtos?busca=...&categoria=...&tipo=... (keeps the active filters on /produtos)
        router.push(
            productSearchHref({
                query,
                category: (category ?? null) as ShowcaseCategory | null,
                subcategory: (subcategory ?? null) as ShowcaseSubcategory | null,
            }),
        );
    };

    return (
        <form className={styles["hero__search"]} role="search" onSubmit={handleSubmit}>
            <label className={styles["hero__search-label"]} htmlFor={id}>
                {t.label}
            </label>
            <div className={styles["hero__search-row"]}>
                <div
                    className={
                        pulse
                            ? `${styles["hero__search-field-wrap"]} ${styles["hero__search-field-wrap--pulse"]}`
                            : styles["hero__search-field-wrap"]
                    }
                >
                    <md-outlined-text-field
                        id={id}
                        suppressHydrationWarning
                        className={styles["hero__search-field"]}
                        name="busca"
                        type="search"
                        value={defaultValue}
                        placeholder={t.placeholder}
                        aria-label={t.aria}
                    >
                        <SearchIcon slot="leading-icon" />
                    </md-outlined-text-field>
                </div>
                <md-filled-button suppressHydrationWarning className={`${buttonStyles["md-button"]} ${styles["hero__search-button"]}`} type="submit">
                    {t.button}
                </md-filled-button>
            </div>
        </form>
    );
}
