// Landing page locales. Safe to import from server and client components.

export const LOCALES = ["pt-BR", "en", "es", "fr", "de", "pt-PT", "it"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-BR";

/** Cookie that stores the chosen locale on routes without a locale segment (product pages). */
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined): value is Locale {
    return LOCALES.includes(value as Locale);
}

type LocaleInfo = {
    /** URL segment after /landing-page (null = default locale, served at /landing-page). */
    slug: string | null;
    /** Language name in its own language (shown in the language menu). */
    nativeName: string;
    /** Short code shown on the header button. */
    short: string;
};

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
    "pt-BR": { slug: null, nativeName: "Português (Brasil)", short: "PT-BR" },
    en: { slug: "en", nativeName: "English", short: "EN" },
    es: { slug: "es", nativeName: "Español", short: "ES" },
    fr: { slug: "fr", nativeName: "Français", short: "FR" },
    de: { slug: "de", nativeName: "Deutsch", short: "DE" },
    "pt-PT": { slug: "pt-pt", nativeName: "Português (Portugal)", short: "PT-PT" },
    it: { slug: "it", nativeName: "Italiano", short: "IT" },
};

const BASE_PATH = "/landing-page";

export function localeHref(locale: Locale): string {
    const slug = LOCALE_INFO[locale].slug;
    return slug ? `${BASE_PATH}/${slug}` : BASE_PATH;
}

/**
 * Non-default locale for a URL segment, or null when the segment is unknown.
 * Exact match only (no lowercasing), so /landing-page/EN 404s instead of duplicating /landing-page/en.
 */
export function localeFromSlug(slug: string): Locale | null {
    const match = LOCALES.find((locale) => LOCALE_INFO[locale].slug === slug);
    return match ?? null;
}

/** hreflang map for <link rel="alternate">, used by the page metadata. */
export function languageAlternates(): Record<string, string> {
    const entries = LOCALES.map((locale) => [locale, localeHref(locale)]);
    return { ...Object.fromEntries(entries), "x-default": localeHref(DEFAULT_LOCALE) };
}

/** Replaces {name} placeholders: format("Passo {current} de {total}", { current: 1, total: 3 }). */
export function format(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
