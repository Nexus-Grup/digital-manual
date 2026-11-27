import Image from "next/image";
import Link from "next/link";
import styles from "@/_styles/landingPage/LpHeader.module.css";
import headerLogo from "@/_assets/image/header_logo.svg";
import ContrastToggle from "@/_components/productComponents/ContrastToggle";
import SiteMenu from "@/_components/productComponents/SiteMenu";
import LanguageMenu from "@/_components/landingPage/LanguageMenu";
import VLibrasButton from "@/_components/landingPage/VLibrasButton";
import type { ProductSections } from "@/_data/productSections";

const HOME_HREF = "/produtos";

function Logo() {
    return <Image className={styles["lp-header__logo"]} src={headerLogo} alt="Manual digital" width={150} height={25} />;
}

// Product pages header: same structure and styles as the landing page header (LpHeader).
// Other languages come from automatic translation (LanguageMenu).
/** sections: on a product page, hides menu links to pages the product has no content for. */
export default function ProductHeader({ sections }: { sections?: ProductSections }) {
    return (
        <header className={styles["lp-header"]}>
            <div className={styles["lp-header__bar"]} aria-hidden="true"></div>
            <div className={styles["lp-header__container"]}>
                <Link className={styles["lp-header__brand"]} href={HOME_HREF} aria-label="Manual digital, ver todos os produtos">
                    <Logo />
                </Link>
                <div className={styles["lp-header__actions"]}>
                    <ContrastToggle />
                    <LanguageMenu />
                    <VLibrasButton />
                    <SiteMenu sections={sections} />
                </div>
            </div>
        </header>
    );
}

// Static shell shown while the header renders: same bar and height, so there is no layout shift.
export function ProductHeaderFallback() {
    return (
        <header className={styles["lp-header"]}>
            <div className={styles["lp-header__bar"]} aria-hidden="true"></div>
            <div className={styles["lp-header__container"]}>
                <Link className={styles["lp-header__brand"]} href={HOME_HREF}>
                    <Logo />
                </Link>
            </div>
        </header>
    );
}
