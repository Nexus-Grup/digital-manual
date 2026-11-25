// The site is written in pt-BR only. Other languages come from automatic translation in the browser
// (see src/_lib/pageTranslator.ts), so there are no per-language dictionaries or routes.
// Safe to import from server and client components.

export type Locale = "pt-BR";

export const DEFAULT_LOCALE: Locale = "pt-BR";

/** Replaces {name} placeholders: format("Passo {current} de {total}", { current: 1, total: 3 }). */
export function format(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
