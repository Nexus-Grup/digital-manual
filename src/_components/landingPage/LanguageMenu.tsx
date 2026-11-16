"use client";

import type { MouseEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/_styles/landingPage/LanguageMenu.module.css";
import { LOCALE_INFO, LOCALES, format, localeHref } from "@/_i18n/config";
import type { Locale } from "@/_i18n/config";
import { CheckIcon, GlobeIcon } from "@/_components/landingPage/Icons";

type LanguageMenuProps = {
    locale: Locale;
    t: {
        /** "Idioma: {language}. Alterar idioma" */
        trigger: string;
        menu: string;
    };
};

// Header language switcher. Each option links to the localized URL (/landing-page, /landing-page/en...)
// and keeps the current section (#hash). Same open/close behavior as the contrast toggle.
export default function LanguageMenu({ locale, t }: LanguageMenuProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const wrapRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // While open: Escape and outside clicks close the menu.
    useEffect(() => {
        if (!open) return;

        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
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

    // Keep the section the visitor is reading when switching language.
    const switchTo = (target: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
        setOpen(false);
        const hash = window.location.hash;
        if (!hash) return;
        event.preventDefault();
        router.push(`${localeHref(target)}${hash}`);
    };

    const current = LOCALE_INFO[locale];

    return (
        <div className={styles["language-menu"]} ref={wrapRef}>
            <button
                ref={triggerRef}
                type="button"
                className={styles["language-menu__trigger"]}
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={format(t.trigger, { language: current.nativeName })}
                title={format(t.trigger, { language: current.nativeName })}
                onClick={() => setOpen((value) => !value)}
            >
                <GlobeIcon size={20} />
                <span className={styles["language-menu__code"]} aria-hidden="true">
                    {current.short}
                </span>
            </button>
            {open ? (
                <nav id={menuId} className={styles["language-menu__panel"]} aria-label={t.menu}>
                    <ul className={styles["language-menu__list"]}>
                        {LOCALES.map((item) => {
                            const active = item === locale;
                            return (
                                <li key={item}>
                                    <Link
                                        className={`${styles["language-menu__option"]} ${active ? styles["language-menu__option--active"] : ""}`}
                                        href={localeHref(item)}
                                        hrefLang={item}
                                        lang={item}
                                        aria-current={active ? "page" : undefined}
                                        onClick={switchTo(item)}
                                    >
                                        <span className={styles["language-menu__name"]}>{LOCALE_INFO[item].nativeName}</span>
                                        {active ? <CheckIcon size={18} /> : null}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            ) : null}
        </div>
    );
}
