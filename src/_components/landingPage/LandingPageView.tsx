import { Inter } from "next/font/google";
import styles from "@/_styles/landingPage/LandingPage.module.css";
import type { Locale } from "@/_i18n/config";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";
import MaterialRegistry from "@/_components/landingPage/MaterialRegistry";
import LpHeader from "@/_components/landingPage/LpHeader";
import Hero from "@/_components/landingPage/Hero";
import Problem from "@/_components/landingPage/Problem";
import ImpactCalculator from "@/_components/landingPage/ImpactCalculator";
import Solution from "@/_components/landingPage/Solution";
import Accessibility from "@/_components/landingPage/Accessibility";
import Brand from "@/_components/landingPage/Brand";
import Sustainability from "@/_components/landingPage/Sustainability";
import Business from "@/_components/landingPage/Business";
import HowItWorks from "@/_components/landingPage/HowItWorks";
import Catalog from "@/_components/landingPage/Catalog";
import Contact from "@/_components/landingPage/Contact";
import LpFooter from "@/_components/landingPage/LpFooter";
import WaveDivider from "@/_components/landingPage/WaveDivider";
import BrandBand from "@/_components/landingPage/BrandBand";
import LogoMarquee from "@/_components/landingPage/LogoMarquee";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-lp",
});

type LandingPageViewProps = {
    locale: Locale;
    dict: Dictionary;
};

// Whole landing page for one locale. Server Component: the dictionary stays on the server and
// client components only receive the strings they render.
export default function LandingPageView({ locale, dict }: LandingPageViewProps) {
    return (
        // lang on the wrapper so screen readers switch pronunciation (the root <html> stays pt-BR).
        <div className={`${inter.variable} ${styles["landing"]}`} lang={locale}>
            <MaterialRegistry />
            <LpHeader locale={locale} t={dict.header} menu={dict.mobileMenu} />
            <main className={styles["landing__main"]}>
                <Hero t={dict.hero} />
                <WaveDivider from="var(--lp-surface)" to="var(--lp-bg)" />
                <Problem t={dict.problem} />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface)" flip />
                <ImpactCalculator t={dict.calculator} locale={locale} />
                <WaveDivider from="var(--lp-surface)" to="var(--lp-bg)" />
                <Solution t={dict.solution} />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface-dark)" accent="var(--lp-brand-blue)" flip />
                <Accessibility t={dict.accessibility} carousel={dict.carousel} />
                <WaveDivider from="var(--lp-surface-dark)" to="var(--lp-bg)" accent="var(--lp-brand-blue)" />
                <Brand t={dict.brand} />
                <BrandBand t={dict.brandBand} />
                <LogoMarquee t={dict.marquee} />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface)" flip />
                <Sustainability t={dict.sustainability} />
                <WaveDivider from="var(--lp-surface)" to="var(--lp-bg)" />
                <Business t={dict.business} />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface)" flip />
                <HowItWorks t={dict.howItWorks} />
                <WaveDivider from="var(--lp-surface)" to="var(--lp-bg)" />
                <Catalog t={dict.catalog} carousel={dict.carousel} />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface-dark)" accent="var(--lp-brand-blue)" flip />
                <Contact t={dict.contact} />
            </main>
            <LpFooter t={dict.footer} />
        </div>
    );
}
