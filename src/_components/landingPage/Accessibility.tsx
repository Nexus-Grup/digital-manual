import styles from "@/_styles/landingPage/Accessibility.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import SnapCarousel from "@/_components/landingPage/SnapCarousel";
import { ContrastIcon, GlobeIcon, HandIcon, VolumeIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Icons in the same order as t.features.
const FEATURE_ICONS = [<HandIcon key="hand" />, <VolumeIcon key="volume" />, <ContrastIcon key="contrast" />, <GlobeIcon key="globe" />];

type AccessibilityProps = {
    t: Dictionary["accessibility"];
    carousel: Dictionary["carousel"];
};

export default function Accessibility({ t, carousel }: AccessibilityProps) {
    return (
        <section className={styles["accessibility"]} id="acessibilidade" aria-labelledby="accessibility-title">
            <div className={styles["accessibility__container"]}>
                <div className={styles["accessibility__top"]}>
                    <SectionHeading
                        id="accessibility-title"
                        eyebrow={t.eyebrow}
                        title={t.title}
                        text={t.text}
                        inverse
                    />
                    <blockquote className={styles["accessibility__quote"]}>
                        <p className={styles["accessibility__quote-text"]}>{t.quote}</p>
                        <p className={styles["accessibility__quote-hint"]}>{t.quoteHint}</p>
                    </blockquote>
                </div>
                <SnapCarousel label={t.carouselLabel} goToLabel={carousel.goTo} count={t.features.length} inverse>
                    <ul className={styles["accessibility__list"]}>
                        {t.features.map((feature, index) => (
                            <li className={styles["accessibility__card"]} key={feature.title}>
                                <span className={styles["accessibility__card-icon"]}>{FEATURE_ICONS[index]}</span>
                                <div className={styles["accessibility__card-content"]}>
                                    <h3 className={styles["accessibility__card-title"]}>{feature.title}</h3>
                                    <p className={styles["accessibility__card-text"]}>{feature.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </SnapCarousel>
            </div>
        </section>
    );
}
