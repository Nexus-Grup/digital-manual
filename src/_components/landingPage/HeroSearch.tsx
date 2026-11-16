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
};

// Manual search for end users: name, model or product code.
export default function HeroSearch({ t }: HeroSearchProps) {
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
        router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
    };

    return (
        <form className={styles["hero__search"]} role="search" onSubmit={handleSubmit}>
            <label className={styles["hero__search-label"]} htmlFor="hero-search">
                {t.label}
            </label>
            <div className={styles["hero__search-row"]}>
                <md-outlined-text-field
                    id="hero-search"
                    className={styles["hero__search-field"]}
                    name="q"
                    type="search"
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
