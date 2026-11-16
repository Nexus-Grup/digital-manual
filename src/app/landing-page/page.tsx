import type { Metadata } from "next";
import { DEFAULT_LOCALE, languageAlternates } from "@/_i18n/config";
import { getDictionary } from "@/_i18n/getDictionary";
import LandingPageView from "@/_components/landingPage/LandingPageView";

// Default locale (pt-BR) at /landing-page. Other locales live at /landing-page/[lang].
export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary(DEFAULT_LOCALE);
    return {
        title: dict.meta.title,
        description: dict.meta.description,
        alternates: { languages: languageAlternates() },
    };
}

export default async function LandingPage() {
    const dict = await getDictionary(DEFAULT_LOCALE);
    return <LandingPageView locale={DEFAULT_LOCALE} dict={dict} />;
}
