/** Lowercases and strips accents, so searches match "informacoes" with "Informações". */
export function normalizeText(value: string): string {
    return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
