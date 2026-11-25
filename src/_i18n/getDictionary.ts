// The site texts (pt-BR). Only Server Components import this, so the dictionary never reaches the
// client bundle; client components receive just the strings they need as props.
import ptBR from "@/_i18n/dictionaries/pt-BR";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

export async function getDictionary(): Promise<Dictionary> {
    return ptBR;
}
