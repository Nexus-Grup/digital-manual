import Image from "next/image";
import styles from "@/_styles/landingPage/LpHeader.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import headerLogo from "@/_assets/image/header_logo.svg";
import ContrastToggle from "@/_components/productComponents/ContrastToggle";
import LanguageMenu from "@/_components/landingPage/LanguageMenu";
import VLibrasButton from "@/_components/landingPage/VLibrasButton";
import LpMobileMenu from "@/_components/landingPage/LpMobileMenu";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";

// Section anchors of the landing page.
const NAV_LINKS = [
    { href: "#problema", label: "O problema" },
    { href: "#solucao", label: "Solução" },
    { href: "#acessibilidade", label: "Acessibilidade" },
    { href: "#sobre", label: "Sobre nós" },
    { href: "#empresas", label: "Para empresas" },
];

const CONTACT_LABEL = "Fale conosco";
const ACCOUNT_LABEL = "Entrar na sua conta";

export default function LpHeader() {
    return (
        <header className={styles["lp-header"]}>
            <div className={styles["lp-header__bar"]} aria-hidden="true"></div>
            <div className={styles["lp-header__container"]}>
                <a className={styles["lp-header__brand"]} href="#inicio" aria-label="Manual digital, voltar ao início">
                    <Image className={styles["lp-header__logo"]} src={headerLogo} alt="Manual digital" width={150} height={25} />
                </a>
                <nav className={styles["lp-header__nav"]} aria-label="Seções da página">
                    <ul className={styles["lp-header__list"]}>
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a className={styles["lp-header__link"]} href={link.href}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={styles["lp-header__actions"]}>
                    <ContrastToggle />
                    <LanguageMenu />
                    {/* VLibras translates Brazilian Portuguese into Libras, so it only makes sense on pt-BR. */}
                    <VLibrasButton />
                    <md-filled-button className={`${buttonStyles["md-button"]} ${styles["lp-header__cta"]}`} href="#contato">
                        {CONTACT_LABEL}
                    </md-filled-button>
                    <LpMobileMenu links={NAV_LINKS} contact={CONTACT_LABEL} />
                    <Link className={styles["lp-header__account"]} href="/entrar" aria-label={ACCOUNT_LABEL} title={ACCOUNT_LABEL}>
                        <CircleUserRound size={22} strokeWidth={1.75} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
