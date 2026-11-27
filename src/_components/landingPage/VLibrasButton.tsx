"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "@/_styles/landingPage/VLibrasButton.module.css";
import { HandIcon } from "@/_components/landingPage/Icons";

/*
 * Header button for VLibras, the official Brazilian government widget that translates pt-BR content
 * into Libras (Brazilian Sign Language) with a 3D avatar.
 *
 * - Nothing is downloaded until the first click: the avatar app weighs several MB and must not
 *   affect page load. External service: requests go to vlibras.gov.br / its CDN; no personal data is sent.
 * - VLibras 7.x loader API: the script exposes window.VLibrasWidget.open(), injects its own floating
 *   button (#vlibras-access-wrapper, hidden here because this header button replaces it) and renders
 *   the avatar in #vlibras-app-root, shown while data-active="true".
 */

const SCRIPT_SRC = "https://vlibras.gov.br/app/vlibras-plugin.js";
const APP_ROOT_ID = "vlibras-app-root";
const FLOATING_BUTTON_ID = "vlibras-access-wrapper";

type VLibrasWidgetApi = {
    open?: () => void;
};

declare global {
    interface Window {
        VLibrasWidget?: VLibrasWidgetApi;
    }
}

type Status = "idle" | "loading" | "ready" | "error";

let loader: Promise<VLibrasWidgetApi> | null = null;

function hideFloatingButton() {
    const floating = document.getElementById(FLOATING_BUTTON_ID);
    if (floating) floating.style.display = "none";
}

// Loads the VLibras script once and resolves when its API (initialized ~50ms after load) is available.
function loadVLibras(): Promise<VLibrasWidgetApi> {
    if (loader) return loader;

    loader = new Promise<VLibrasWidgetApi>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.onerror = () => reject(new Error("VLibras script failed to load"));
        script.onload = () => {
            const startedAt = Date.now();
            const waitForApi = () => {
                const api = window.VLibrasWidget;
                if (api?.open) {
                    hideFloatingButton();
                    resolve(api);
                } else if (Date.now() - startedAt > 10000) {
                    reject(new Error("VLibras API not available"));
                } else {
                    window.setTimeout(waitForApi, 50);
                }
            };
            waitForApi();
        };
        document.body.appendChild(script);
    }).catch((error: unknown) => {
        loader = null; // allow a retry after a network failure
        throw error;
    });

    return loader;
}

// Source of truth for "avatar visible": the app persists { state: { isOpen } } in localStorage (the VLibras
// loader itself reads this key). data-active on #vlibras-app-root stays "true" after closing, so it can't be used.
const STORAGE_KEY = "@vlibras-widget";

function isAppOpen() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved)?.state?.isOpen === true : false;
    } catch {
        return false; // storage blocked: assume closed
    }
}

// The app keeps its own open state, so close it through its own "Fechar" button (inside its shadow root).
function closeApp() {
    if (!isAppOpen()) return;
    const root = document.getElementById(APP_ROOT_ID);
    root?.shadowRoot?.querySelector<HTMLButtonElement>('button[aria-label="Fechar"]')?.click();
}

// First open: api.open() loads the app. Reopen after closing: the root already has data-active="true",
// so toggle the attribute to make the app react again.
function openApp(api: VLibrasWidgetApi) {
    const root = document.getElementById(APP_ROOT_ID);
    if (root && root.dataset.active === "true") {
        root.dataset.active = "false";
        window.requestAnimationFrame(() => {
            root.dataset.active = "true";
        });
        return;
    }
    api.open?.();
}

export default function VLibrasButton() {
    const [status, setStatus] = useState<Status>("idle");
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // The avatar lives in <body>, outside React. Next keeps previous pages mounted but hidden (<Activity>),
    // so when this page is hidden (e.g. navigating away from /inicio) the cleanup closes the avatar.
    // useLayoutEffect runs the cleanup synchronously before hiding (Next "preserving UI state" guide).
    useLayoutEffect(() => closeApp, []);

    // Keep the button in sync with the avatar (also when it is closed from its own "X").
    // The app renders in a shadow root, which a MutationObserver on <body> can't see, so once the app root
    // exists we also observe its shadow root.
    useEffect(() => {
        if (status !== "ready") return;

        const sync = () => {
            hideFloatingButton();
            // While the avatar app is still downloading there is nothing to sync yet (keep the "open" state).
            if (!document.getElementById(APP_ROOT_ID)?.shadowRoot) return;
            // The app saves isOpen right after its own UI update; read it on the next frame.
            window.requestAnimationFrame(() => setOpen(isAppOpen()));
        };
        const shadowObserver = new MutationObserver(sync);
        let observedShadow: ShadowRoot | null = null;

        const watchShadowRoot = () => {
            const shadow = document.getElementById(APP_ROOT_ID)?.shadowRoot ?? null;
            if (shadow && shadow !== observedShadow) {
                observedShadow = shadow;
                shadowObserver.observe(shadow, { subtree: true, attributes: true, attributeFilter: ["class"] });
            }
            sync();
        };
        const bodyObserver = new MutationObserver(watchShadowRoot);
        bodyObserver.observe(document.body, { childList: true, attributes: true, subtree: false });
        watchShadowRoot();

        return () => {
            bodyObserver.disconnect();
            shadowObserver.disconnect();
        };
    }, [status]);

    // While the avatar is open, VLibras captures every page click on <body> (its "click a text to translate"
    // mode) and stops propagation, so this button's React onClick never fires. Listening on `document` in the
    // capture phase runs before VLibras: handle the close here and keep VLibras from "translating" the button.
    useEffect(() => {
        if (!open) return;

        const onCaptureClick = (event: MouseEvent) => {
            if (!buttonRef.current?.contains(event.target as Node)) return;
            event.stopPropagation();
            closeApp();
            setOpen(false);
        };
        document.addEventListener("click", onCaptureClick, true);
        return () => document.removeEventListener("click", onCaptureClick, true);
    }, [open]);

    const handleClick = async () => {
        if (status === "loading") return;

        if (open) {
            closeApp();
            setOpen(false);
            return;
        }

        try {
            setStatus("loading");
            const api = await loadVLibras();
            openApp(api);
            setOpen(true);
            setStatus("ready");
        } catch {
            setStatus("error");
        }
    };

    const label = status === "loading"
            ? "Carregando a tradução em Libras…"
            : open
              ? "Fechar tradução em Libras"
              : "Abrir tradução em Libras";

    return (
        <div className={styles["vlibras-button"]}>
            <button
                ref={buttonRef}
                type="button"
                className={`${styles["vlibras-button__trigger"]} ${open ? styles["vlibras-button__trigger--active"] : ""}`}
                aria-pressed={open}
                aria-busy={status === "loading"}
                aria-label={label}
                title={label}
                onClick={handleClick}
            >
                {status === "loading" ? (
                    <span className={styles["vlibras-button__spinner"]} aria-hidden="true"></span>
                ) : (
                    <HandIcon size={22} />
                )}
            </button>
            {status === "error" ? (
                <p className={styles["vlibras-button__error"]} role="alert">
                    Não foi possível carregar o VLibras. Verifique a conexão e tente de novo.
                </p>
            ) : null}
        </div>
    );
}
