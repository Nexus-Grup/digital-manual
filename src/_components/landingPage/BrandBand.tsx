import styles from "@/_styles/landingPage/BrandBand.module.css";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Full-width dark band: blurred brand-color haze behind a dark frosted-glass panel with gradient text.
export default function BrandBand({ t }: { t: Dictionary["brandBand"] }) {
    return (
        <section className={styles["brand-band"]} aria-label={t.aria}>
            <span className={`${styles["brand-band__blob"]} ${styles["brand-band__blob--green"]}`} aria-hidden="true"></span>
            <span className={`${styles["brand-band__blob"]} ${styles["brand-band__blob--blue"]}`} aria-hidden="true"></span>
            <div className={styles["brand-band__container"]}>
                <div className={styles["brand-band__glass"]}>
                    <p className={styles["brand-band__text"]}>
                        {t.text}
                    </p>
                </div>
            </div>
        </section>
    );
}
