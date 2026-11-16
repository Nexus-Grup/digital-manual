"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "@/_styles/landingPage/Hero.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import { SearchIcon } from "@/_components/landingPage/Icons";

// Manual search for end users: name, model or product code.
export default function HeroSearch() {
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = String(new FormData(event.currentTarget).get("q") ?? "").trim();
        router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
    };

    return (
        <form className={styles["hero__search"]} role="search" onSubmit={handleSubmit}>
            <label className={styles["hero__search-label"]} htmlFor="hero-search">
                Já tem um produto? Encontre o manual agora
            </label>
            <div className={styles["hero__search-row"]}>
                <md-outlined-text-field
                    id="hero-search"
                    className={styles["hero__search-field"]}
                    name="q"
                    type="search"
                    placeholder="Nome, modelo ou código do produto"
                    aria-label="Buscar manual por nome, modelo ou código do produto"
                >
                    <SearchIcon slot="leading-icon" />
                </md-outlined-text-field>
                <md-filled-button className={`${buttonStyles["md-button"]} ${styles["hero__search-button"]}`} type="submit">
                    Buscar manual
                </md-filled-button>
            </div>
        </form>
    );
}
