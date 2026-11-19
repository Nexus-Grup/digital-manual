"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "@/_styles/landingPage/Hero.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import { SearchIcon } from "@/_components/landingPage/Icons";

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
    /** Active category filter on /products, kept when searching again. */
    category?: string;
};

// Manual search for end users: name, model or product code. Results live at /products?q=...
export default function HeroSearch({ t, id = "hero-search", defaultValue, category }: HeroSearchProps) {
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (category) params.set("category", category);
        const search = params.toString();
        router.push(search ? `/products?${search}` : "/products");
    };

    return (
        <form className={styles["hero__search"]} role="search" onSubmit={handleSubmit}>
            <label className={styles["hero__search-label"]} htmlFor={id}>
                {t.label}
            </label>
            <div className={styles["hero__search-row"]}>
                <md-outlined-text-field
                    id={id}
                    className={styles["hero__search-field"]}
                    name="q"
                    type="search"
                    value={defaultValue}
                    placeholder={t.placeholder}
                    aria-label={t.aria}
                >
                    <SearchIcon slot="leading-icon" />
                </md-outlined-text-field>
                <md-filled-button className={`${buttonStyles["md-button"]} ${styles["hero__search-button"]}`} type="submit">
                    {t.button}
                </md-filled-button>
            </div>
        </form>
    );
}
