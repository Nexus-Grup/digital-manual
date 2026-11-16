import styles from "@/_styles/landingPage/BrandBand.module.css";

// Full-width smoky band (blurred brand-color blobs) with the tagline on a frosted-glass panel.
export default function BrandBand() {
    return (
        <section className={styles["brand-band"]} aria-label="Assinatura da marca">
            <span className={`${styles["brand-band__blob"]} ${styles["brand-band__blob--green"]}`} aria-hidden="true"></span>
            <span className={`${styles["brand-band__blob"]} ${styles["brand-band__blob--blue"]}`} aria-hidden="true"></span>
            <span className={`${styles["brand-band__blob"]} ${styles["brand-band__blob--yellow"]}`} aria-hidden="true"></span>
            <div className={styles["brand-band__container"]}>
                <div className={styles["brand-band__glass"]}>
                    <p className={styles["brand-band__text"]}>
                        O manual do futuro. Interativo para quem monta, acessível para todos, sustentável para o planeta.
                    </p>
                </div>
            </div>
        </section>
    );
}
