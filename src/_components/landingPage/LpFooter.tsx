import Image from "next/image";
import Link from "next/link";
import styles from "@/_styles/landingPage/LpFooter.module.css";
import headerLogo from "@/_assets/image/header_logo.svg";

const COLUMNS = [
    {
        title: "Navegação",
        links: [
            { href: "#problema", label: "O problema" },
            { href: "#solucao", label: "A solução" },
            { href: "#sustentabilidade", label: "Sustentabilidade" },
            { href: "#sobre", label: "Quem somos" },
        ],
    },
    {
        title: "Para você",
        links: [
            { href: "/products", label: "Buscar um manual" },
            { href: "#catalogo", label: "Manuais digitalizados" },
            { href: "#acessibilidade", label: "Recursos de acessibilidade" },
        ],
    },
    {
        title: "Para empresas",
        links: [
            { href: "#empresas", label: "Vantagens" },
            { href: "#como-funciona", label: "Como funciona" },
            { href: "#calculadora", label: "Calculadora de impacto" },
            { href: "#contato", label: "Fale conosco" },
        ],
    },
];

export default function LpFooter() {
    return (
        <footer className={styles["lp-footer"]}>
            <div className={styles["lp-footer__container"]}>
                <div className={styles["lp-footer__top"]}>
                    <div className={styles["lp-footer__brand"]}>
                        <Image className={styles["lp-footer__logo"]} src={headerLogo} alt="Manual digital" width={160} height={27} />
                        <p className={styles["lp-footer__tagline"]}>
                            O manual do futuro. Interativo para quem monta, acessível para todos, sustentável para o
                            planeta.
                        </p>
                    </div>
                    <nav className={styles["lp-footer__nav"]} aria-label="Links do rodapé">
                        {COLUMNS.map((column) => (
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
                    <h2 className={styles["lp-footer__title"]}>Compromisso de acessibilidade</h2>
                    <p className={styles["lp-footer__text"]}>
                        Seguimos as diretrizes WCAG, com estrutura compatível com leitores de tela, alto contraste, Libras
                        via VLibras e tradução de idioma. Encontrou alguma barreira? Fale com a gente.
                    </p>
                </div>
                <div className={styles["lp-footer__bottom"]}>
                    <p className={styles["lp-footer__copy"]}>© 2026 Manual digital. Todos os direitos reservados.</p>
                    <p className={styles["lp-footer__team"]}>
                        Feito pelo Time Nexus: Danilo, Stephany, Thaiza e Bianca.
                    </p>
                </div>
            </div>
        </footer>
    );
}
