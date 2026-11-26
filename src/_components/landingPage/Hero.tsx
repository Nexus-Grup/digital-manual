import Image from "next/image";
import styles from "@/_styles/landingPage/Hero.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import mascot from "@/_assets/image/lucca/lucca-qrcode.png";
import HeroSearch from "@/_components/landingPage/HeroSearch";
import { ArrowRightIcon, CubeIcon, HandIcon, LeafIcon, QrCodeIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Icons in the same order as t.highlights.
const HIGHLIGHT_ICONS = [<QrCodeIcon key="qr" size={20} />, <CubeIcon key="cube" size={20} />, <HandIcon key="hand" size={20} />];

export default function Hero({ t }: { t: Dictionary["hero"] }) {
    return (
        <section className={styles["hero"]} id="inicio" aria-labelledby="hero-title">
            <div className={styles["hero__container"]}>
                <div className={styles["hero__content"]}>
                    <p className={styles["hero__tag"]}>
                        <LeafIcon size={18} />
                        {t.tag}
                    </p>
                    <div className={styles["hero__heading"]}>
                        <h1 className={styles["hero__title"]} id="hero-title">
                            {t.titleStart}{" "}
                            <span className={styles["hero__title-highlight"]}>{t.titleHighlight}</span>
                            {t.titleEnd}
                        </h1>
                        <p className={styles["hero__text"]}>
                            {t.text}
                        </p>
                    </div>
                    <HeroSearch
                        pulse
                        t={{
                            label: t.searchLabel,
                            placeholder: t.searchPlaceholder,
                            aria: t.searchAria,
                            button: t.searchButton,
                        }}
                    />
                    <div className={styles["hero__b2b"]}>
                        <p className={styles["hero__b2b-text"]}>{t.b2bText}</p>
                        <md-outlined-button
                            suppressHydrationWarning
                            className={`${buttonStyles["md-button--trailing-icon"]} ${styles["hero__b2b-button"]}`}
                            href="#contato"
                            trailing-icon=""
                        >
                            {t.b2bButton}
                            <ArrowRightIcon slot="icon" size={18} />
                        </md-outlined-button>
                    </div>
                    <ul className={styles["hero__highlights"]}>
                        {t.highlights.map((label, index) => (
                            <li className={styles["hero__highlight"]} key={label}>
                                <span className={styles["hero__highlight-icon"]}>{HIGHLIGHT_ICONS[index]}</span>
                                {label}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles["hero__visual"]}>
                    <div className={styles["hero__blob"]} aria-hidden="true"></div>
                    <Image
                        className={styles["hero__mascot"]}
                        src={mascot}
                        alt={t.mascotAlt}
                        sizes="(min-width: 1200px) 400px, (min-width: 768px) 340px, 260px"
                        loading="eager"
                        fetchPriority="high"
                    />
                    <p className={`${styles["hero__badge"]} ${styles["hero__badge--top"]}`}>
                        <CubeIcon size={18} />
                        {t.badge3d}
                    </p>
                    <p className={`${styles["hero__badge"]} ${styles["hero__badge--bottom"]}`}>
                        <span className={styles["hero__badge-icon--eco"]}>
                            <LeafIcon size={18} />
                        </span>
                        {t.badgeEco}
                    </p>
                </div>
            </div>
        </section>
    );
}
