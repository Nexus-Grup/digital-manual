import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "@/_styles/landingPage/LandingPage.module.css";
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

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-lp",
});

export const metadata: Metadata = {
    title: "Manual digital | O manual do futuro: interativo, acessível e sustentável",
    description:
        "Troque manuais de papel confusos por manuais digitais em 3D, acessíveis e via QR Code. Para quem monta, um guia intuitivo; para marcas, menos custo, metas ESG e menos chamados no SAC.",
};

export default function LandingPage() {
    return (
        <div className={`${inter.variable} ${styles["landing"]}`}>
            <MaterialRegistry />
            <LpHeader />
            <main className={styles["landing__main"]}>
                <Hero />
                <WaveDivider from="var(--lp-surface-blue)" to="var(--lp-bg)" />
                <Problem />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface-green)" flip />
                <ImpactCalculator />
                <WaveDivider from="var(--lp-surface-green)" to="var(--lp-bg)" />
                <Solution />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface-dark)" flip />
                <Accessibility />
                <WaveDivider from="var(--lp-surface-dark)" to="var(--lp-bg)" />
                <Brand />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface-green)" flip />
                <Sustainability />
                <WaveDivider from="var(--lp-surface-green)" to="var(--lp-bg)" />
                <Business />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-surface)" flip />
                <HowItWorks />
                <WaveDivider from="var(--lp-surface)" to="var(--lp-bg)" />
                <Catalog />
                <WaveDivider from="var(--lp-bg)" to="var(--lp-contact-start)" flip />
                <Contact />
            </main>
            <LpFooter />
        </div>
    );
}
