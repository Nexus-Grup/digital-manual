import styles from "@/_styles/landingPage/Brand.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import { EyeIcon, FlagIcon, TargetIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

export default function Brand({ t }: { t: Dictionary["brand"] }) {
    return (
        <section className={styles["brand"]} id="sobre" aria-labelledby="brand-title">
            <div className={styles["brand__container"]}>
                <SectionHeading
                    id="brand-title"
                    eyebrow={t.eyebrow}
                    title={t.title}
                    text={t.text}
                />
                <div className={styles["brand__purpose"]}>
                    <article className={`${styles["brand__card"]} ${styles["brand__card--mission"]}`}>
                        <span className={styles["brand__card-icon"]}>
                            <TargetIcon />
                        </span>
                        <h3 className={styles["brand__card-title"]}>{t.missionTitle}</h3>
                        <p className={styles["brand__card-text"]}>{t.missionText}</p>
                    </article>
                    <article className={`${styles["brand__card"]} ${styles["brand__card--vision"]}`}>
                        <span className={styles["brand__card-icon"]}>
                            <EyeIcon />
                        </span>
                        <h3 className={styles["brand__card-title"]}>{t.visionTitle}</h3>
                        <p className={styles["brand__card-text"]}>{t.visionText}</p>
                    </article>
                </div>
                <div className={styles["brand__values"]}>
                    <h3 className={styles["brand__subtitle"]}>{t.valuesTitle}</h3>
                    <ol className={styles["brand__values-list"]}>
                        {t.values.map((value, index) => (
                            <li className={styles["brand__value"]} key={value.title}>
                                <span className={styles["brand__value-number"]} aria-hidden="true">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h4 className={styles["brand__value-title"]}>{value.title}</h4>
                                <p className={styles["brand__value-text"]}>{value.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
                <md-divider></md-divider>
                <div className={styles["brand__bottom"]}>
                    <article className={styles["brand__legacy"]}>
                        <span className={styles["brand__legacy-icon"]}>
                            <FlagIcon />
                        </span>
                        <h3 className={styles["brand__subtitle"]}>{t.legacyTitle}</h3>
                        <p className={styles["brand__legacy-text"]}>{t.legacyText}</p>
                    </article>
                    <div className={styles["brand__positioning"]}>
                        <h3 className={styles["brand__subtitle"]}>{t.positioningTitle}</h3>
                        <ul className={styles["brand__positioning-list"]}>
                            {t.positioning.map((item) => (
                                <li className={styles["brand__positioning-item"]} key={item.audience}>
                                    <h4 className={styles["brand__positioning-audience"]}>{item.audience}</h4>
                                    <p className={styles["brand__positioning-text"]}>{item.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
