import styles from "@/_styles/landingPage/LandingPage.module.css";
import type { ProductSummary } from "@/_data/products";
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
import ReadAloud from "@/_components/productComponents/ReadAloud";

type LandingPageViewProps = {
    /** published products for the catalog section (same list as /products) */
    products: ProductSummary[];
};

// Whole landing page (pt-BR). Each section holds its own texts.
export default function LandingPageView({ products }: LandingPageViewProps) {
    return (
        <div className={styles["landing"]}>
            <MaterialRegistry />
            <LpHeader />
            <main id="conteudo" className={styles["landing__main"]}>
                <Hero />
                <WaveDivider from="var(--lp-surface)" to="var(--lp-bg)" />
                <Problem />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface)" flip />
                <ImpactCalculator />
                <WaveDivider from="var(--lp-surface)" to="var(--lp-bg)" />
                <Solution />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface-dark)" accent="var(--lp-brand-blue)" flip />
                <Accessibility />
                <WaveDivider from="var(--lp-surface-dark)" to="var(--lp-bg)" accent="var(--lp-brand-blue)" />
                <Brand />
                <BrandBand />
                <LogoMarquee />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface)" flip />
                <Sustainability />
                <WaveDivider from="var(--lp-surface)" to="var(--lp-bg)" />
                <Business />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface)" flip />
                <HowItWorks />
                <WaveDivider from="var(--lp-surface)" to="var(--lp-bg)" />
                <Catalog products={products} />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface-dark)" accent="var(--lp-brand-blue)" flip />
                <Contact />
            </main>
            <LpFooter />
            {/* Select any text to get a speaker button that reads it aloud in the page language. */}
            <ReadAloud lang="pt-BR" />
        </div>
    );
}
