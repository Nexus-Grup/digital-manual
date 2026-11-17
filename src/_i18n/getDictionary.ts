// Loads a locale dictionary on the server (pattern from the Next.js internationalization guide).
// Only Server Components import this, so dictionaries never reach the client bundle; client components
// receive just the strings they need as props.
import type { Locale } from "@/_i18n/config";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
    "pt-BR": () => import("@/_i18n/dictionaries/pt-BR").then((module) => module.default),
    en: () => import("@/_i18n/dictionaries/en").then((module) => module.default),
    es: () => import("@/_i18n/dictionaries/es").then((module) => module.default),
    fr: () => import("@/_i18n/dictionaries/fr").then((module) => module.default),
    de: () => import("@/_i18n/dictionaries/de").then((module) => module.default),
    "pt-PT": () => import("@/_i18n/dictionaries/pt-PT").then((module) => module.default),
    it: () => import("@/_i18n/dictionaries/it").then((module) => module.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
    return dictionaries[locale]();
}
