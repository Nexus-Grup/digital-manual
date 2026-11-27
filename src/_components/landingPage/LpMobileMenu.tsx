"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import styles from "@/_styles/landingPage/LpMobileMenu.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";

type NavLink = {
    href: string;
    label: string;
};

type LpMobileMenuProps = {
    links: NavLink[];
    /** "Fale conosco" button label. */
    contact: string;
};

// Hamburger menu for tablet and mobile (< 1200px). The panel drops down under the sticky header.
export default function LpMobileMenu({ links, contact }: LpMobileMenuProps) {
    const [open, setOpen] = useState(false);
    const panelId = useId();
    const wrapRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    // While open: Escape and outside clicks close the menu.
    useEffect(() => {
        if (!open) return;

        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                toggleRef.current?.focus();
            }
        };
        const onPointer = (event: PointerEvent) => {
            if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
        };

        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointer);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointer);
        };
    }, [open]);

    // Close when the viewport grows to desktop, where the inline nav takes over.
    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 1200px)");
        const onChange = (event: MediaQueryListEvent) => {
            if (event.matches) setOpen(false);
        };
        desktop.addEventListener("change", onChange);
        return () => desktop.removeEventListener("change", onChange);
    }, []);

    return (
        <div className={styles["lp-mobile-menu"]} ref={wrapRef}>
            <button
                ref={toggleRef}
                type="button"
                className={styles["lp-mobile-menu__toggle"]}
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                onClick={() => setOpen((value) => !value)}
            >
                <span
                    className={`${styles["lp-mobile-menu__line"]} ${open ? styles["lp-mobile-menu__line--top-open"] : ""}`}
                ></span>
                <span
                    className={`${styles["lp-mobile-menu__line"]} ${open ? styles["lp-mobile-menu__line--middle-open"] : ""}`}
                ></span>
                <span
                    className={`${styles["lp-mobile-menu__line"]} ${open ? styles["lp-mobile-menu__line--bottom-open"] : ""}`}
                ></span>
            </button>
            <nav
                id={panelId}
                className={`${styles["lp-mobile-menu__panel"]} ${open ? styles["lp-mobile-menu__panel--open"] : ""}`}
                aria-label="Menu principal"
            >
                <ul className={styles["lp-mobile-menu__list"]}>
                    {links.map((link) => (
                        <li key={link.href}>
                            <a className={styles["lp-mobile-menu__link"]} href={link.href} onClick={() => setOpen(false)}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                    {/* on phones the header has no room for the account icon: login lives here (always listed) */}
                    <li>
                        <Link className={styles["lp-mobile-menu__link"]} href="/entrar" onClick={() => setOpen(false)}>
                            Entrar na sua conta
                        </Link>
                    </li>
                </ul>
                <md-filled-button
                    className={`${buttonStyles["md-button"]} ${styles["lp-mobile-menu__cta"]}`}
                    href="#contato"
                    onClick={() => setOpen(false)}
                >
                    {contact}
                </md-filled-button>
            </nav>
        </div>
    );
}
