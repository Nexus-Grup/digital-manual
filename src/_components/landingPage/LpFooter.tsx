import Image from "next/image";
import Link from "next/link";
import styles from "@/_styles/landingPage/LpFooter.module.css";
import headerLogo from "@/_assets/image/header_logo.svg";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Link targets per column, in the same order as t.columns[i].links.
const COLUMN_HREFS = [
    ["#problema", "#solucao", "#sustentabilidade", "#sobre"],
    ["/products", "#catalogo", "#acessibilidade"],
    ["#empresas", "#como-funciona", "#calculadora", "#contato"],
];

export default function LpFooter({ t }: { t: Dictionary["footer"] }) {
    const columns = t.columns.map((column, columnIndex) => ({
        title: column.title,
        links: column.links.map((label, linkIndex) => ({ label, href: COLUMN_HREFS[columnIndex][linkIndex] })),
    }));

    return (
        <footer className={styles["lp-footer"]}>
            <div className={styles["lp-footer__container"]}>
                <div className={styles["lp-footer__top"]}>
                    <div className={styles["lp-footer__brand"]}>
                        <Image className={styles["lp-footer__logo"]} src={headerLogo} alt="Manual digital" width={160} height={27} />
                        <p className={styles["lp-footer__tagline"]}>{t.tagline}</p>
                    </div>
                    <nav className={styles["lp-footer__nav"]} aria-label={t.navAria}>
                        {columns.map((column) => (
                            <div className={styles["lp-footer__column"]} key={column.title}>
                                <h2 className={styles["lp-footer__title"]}>{column.title}</h2>
                                <ul className={styles["lp-footer__list"]}>
                                    {column.links.map((link) => (
                                        <li key={link.href}>
                                            <Link className={styles["lp-footer__link"]} href={link.href}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
                <div className={styles["lp-footer__commitment"]}>
                    <h2 className={styles["lp-footer__title"]}>{t.commitmentTitle}</h2>
                    <p className={styles["lp-footer__text"]}>{t.commitmentText}</p>
                </div>
                <div className={styles["lp-footer__bottom"]}>
                    <p className={styles["lp-footer__copy"]}>{t.copyright}</p>
                    <p className={styles["lp-footer__team"]}>{t.team}</p>
                </div>
            </div>
        </footer>
    );
}
