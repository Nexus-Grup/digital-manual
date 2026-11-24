import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/_i18n/config";
import { getDictionary } from "@/_i18n/getDictionary";
import LandingPageView from "@/_components/landingPage/LandingPageView";

// Landing page (pt-BR). Other languages: automatic translation from the header language menu.
export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    return {
        title: dict.meta.title,
        description: dict.meta.description,
    };
}

export default async function LandingPage() {
    const dict = await getDictionary();
    return <LandingPageView locale={DEFAULT_LOCALE} dict={dict} />;
}
