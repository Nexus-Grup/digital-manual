"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import styles from "@/_styles/landingPage/LanguageMenu.module.css";
import { CheckIcon, GlobeIcon } from "@/_components/landingPage/Icons";
import {
    LANGUAGES,
    getServerState,
    getState,
    restoreSavedLanguage,
    subscribe,
    translatePage,
} from "@/_lib/pageTranslator";

// Header language switcher: automatic translation of the whole page (texts, product data, manual,
// chat answers) by the browser's own translator, or Google Translate where the browser has none.
// The menu itself is marked translate="no" so the language names stay readable.
export default function LanguageMenu() {
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const wrapRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const state = useSyncExternalStore(subscribe, getState, getServerState);

    // a language chosen on a previous visit comes back automatically
    useEffect(() => {
        restoreSavedLanguage();
    }, []);

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

    const choose = (code: string) => {
        setOpen(false);
        triggerRef.current?.focus();
        if (code !== state.lang) translatePage(code);
    };

    const current = LANGUAGES.find((l) => l.code === state.lang) ?? LANGUAGES[0];
    const triggerLabel = `Idioma: ${current.name}. Alterar idioma`;
    const busy = state.status === "downloading" || state.status === "translating";
    const statusText =
        state.status === "downloading"
            ? `Baixando o idioma… ${Math.round(state.progress * 100)}%`
            : state.status === "translating"
              ? "Traduzindo a página…"
              : state.status === "error"
                ? "Não foi possível traduzir agora."
                : "";

    return (
        <div className={styles["language-menu"]} ref={wrapRef} translate="no">
            <button
                ref={triggerRef}
                type="button"
                className={styles["language-menu__trigger"]}
                aria-expanded={open}
                aria-controls={menuId}
                aria-busy={busy}
                aria-label={triggerLabel}
                title={triggerLabel}
                onClick={() => setOpen((value) => !value)}
            >
                <GlobeIcon size={20} />
                <span className={styles["language-menu__code"]} aria-hidden="true">
                    {current.short}
                </span>
            </button>

            {/* progress of the translation, announced to screen readers */}
            <span className={styles["language-menu__sr-only"]} role="status">
                {statusText}
            </span>

            {open ? (
                <nav id={menuId} className={styles["language-menu__panel"]} aria-label="Escolher idioma">
                    <ul className={styles["language-menu__list"]}>
                        {LANGUAGES.map((item) => {
                            const active = item.code === state.lang;
                            return (
                                <li key={item.code}>
                                    <button
                                        type="button"
                                        className={`${styles["language-menu__option"]} ${styles["language-menu__option--button"]} ${active ? styles["language-menu__option--active"] : ""}`}
                                        lang={item.code}
                                        aria-current={active ? "true" : undefined}
                                        onClick={() => choose(item.code)}
                                        disabled={busy}
                                    >
                                        <span className={styles["language-menu__name"]}>{item.name}</span>
                                        {active ? <CheckIcon size={18} /> : null}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <p className={styles["language-menu__note"]}>
                        {statusText || "Tradução automática. Pode haver pequenas diferenças do texto original."}
                    </p>
                </nav>
            ) : null}
        </div>
    );
}
