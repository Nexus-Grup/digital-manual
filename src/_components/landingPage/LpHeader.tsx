import Image from "next/image";
import styles from "@/_styles/landingPage/LpHeader.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import headerLogo from "@/_assets/image/header_logo.svg";
import type { Locale } from "@/_i18n/config";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";
import ContrastToggle from "@/_components/productComponents/ContrastToggle";
import LanguageMenu from "@/_components/landingPage/LanguageMenu";
import VLibrasButton from "@/_components/landingPage/VLibrasButton";
import LpMobileMenu from "@/_components/landingPage/LpMobileMenu";
import Link from "next/link";
import { User } from "lucide-react";

// Section anchors, in the same order as dict.header.nav.
const NAV_HREFS = ["#problema", "#solucao", "#acessibilidade", "#sobre", "#empresas"];

type LpHeaderProps = {
    locale: Locale;
    t: Dictionary["header"];
    menu: Dictionary["mobileMenu"];
};

export default function LpHeader({ locale, t, menu }: LpHeaderProps) {
    const links = NAV_HREFS.map((href, index) => ({ href, label: t.nav[index] }));

    return (
        <header className={styles["lp-header"]}>
            <div className={styles["lp-header__bar"]} aria-hidden="true"></div>
            <div className={styles["lp-header__container"]}>
                <a className={styles["lp-header__brand"]} href="#inicio" aria-label={t.homeAria}>
                    <Image className={styles["lp-header__logo"]} src={headerLogo} alt="Manual digital" width={150} height={25} />
                </a>
                <nav className={styles["lp-header__nav"]} aria-label={t.navAria}>
                    <ul className={styles["lp-header__list"]}>
                        {links.map((link) => (
                            <li key={link.href}>
                                <a className={styles["lp-header__link"]} href={link.href}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={styles["lp-header__actions"]}>
                    <ContrastToggle labels={t.contrast} />
                    <LanguageMenu locale={locale} t={t.language} />
                    {/* VLibras translates Brazilian Portuguese into Libras, so it only makes sense on pt-BR. */}
                    {locale === "pt-BR" ? <VLibrasButton t={t.libras} /> : null}
                    <md-filled-button className={`${buttonStyles["md-button"]} ${styles["lp-header__cta"]}`} href="#contato">
                        {t.contact}
                    </md-filled-button>
                    <LpMobileMenu links={links} contact={t.contact} t={menu} />
                    <Link href={'/login'} className={styles.user_button}><User/></Link>
                </div>
            </div>
        </header>
    );
}
