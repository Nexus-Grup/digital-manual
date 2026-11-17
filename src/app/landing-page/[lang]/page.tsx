import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALE_INFO, LOCALES, languageAlternates, localeFromSlug } from "@/_i18n/config";
import { getDictionary } from "@/_i18n/getDictionary";
import LandingPageView from "@/_components/landingPage/LandingPageView";

type LangPageProps = {
    params: Promise<{ lang: string }>;
};

// The whole page depends on the locale, so there is no URL-independent shell to prefetch: navigating into
// another language is allowed to block until it renders (direct visits are still prerendered/static).
// Without this, Next reports "URL data outside of Suspense" (docs: instant-shell-url-data).
export const instant = false;

// Prerender every non-default locale (/landing-page/en, /es, /fr, /de, /pt-pt, /it).
// With cacheComponents this must return at least one param.
export function generateStaticParams() {
    return LOCALES.flatMap((locale) => {
        const slug = LOCALE_INFO[locale].slug;
        return slug ? [{ lang: slug }] : [];
    });
}

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
    const locale = localeFromSlug((await params).lang);
    if (!locale) return {};
    const dict = await getDictionary(locale);
    return {
        title: dict.meta.title,
        description: dict.meta.description,
        alternates: { languages: languageAlternates() },
    };
}

export default async function LocalizedLandingPage({ params }: LangPageProps) {
    // Unknown slugs 404; the default locale has no slug, so /landing-page/pt-br also 404s (no duplicate content).
    const locale = localeFromSlug((await params).lang);
    if (!locale) notFound();
    const dict = await getDictionary(locale);
    return <LandingPageView locale={locale} dict={dict} />;
}
