import styles from "@/_styles/landingPage/Business.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaBriefcase from "@/_assets/image/lucca/lucca-briefcase.png";
import { ArrowRightIcon, ChartIcon, CoinsIcon, HeadsetIcon, RefreshIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Icons in the same order as t.benefits.
const BENEFIT_ICONS = [<CoinsIcon key="coins" />, <ChartIcon key="chart" />, <RefreshIcon key="refresh" />, <HeadsetIcon key="headset" />];

export default function Business({ t }: { t: Dictionary["business"] }) {
    return (
        <section className={styles["business"]} id="empresas" aria-labelledby="business-title">
            <div className={styles["business__container"]}>
                <SectionHeading
                    id="business-title"
                    lucca={luccaBriefcase}
                    eyebrow={t.eyebrow}
                    title={t.title}
                    text={t.text}
                />
                <ul className={styles["business__list"]}>
                    {t.benefits.map((benefit, index) => (
                        <li className={styles["business__card"]} key={benefit.title}>
                            <span className={styles["business__card-icon"]}>{BENEFIT_ICONS[index]}</span>
                            <div className={styles["business__card-content"]}>
                                <h3 className={styles["business__card-title"]}>{benefit.title}</h3>
                                <p className={styles["business__card-text"]}>{benefit.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className={styles["business__cta"]}>
                    <p className={styles["business__cta-text"]}>{t.ctaText}</p>
                    <div className={styles["business__cta-actions"]}>
                        <md-filled-button suppressHydrationWarning className={buttonStyles["md-button--trailing-icon"]} href="#contato" trailing-icon="">
                            {t.ctaPrimary}
                            <ArrowRightIcon slot="icon" size={18} />
                        </md-filled-button>
                        <md-outlined-button suppressHydrationWarning className={buttonStyles["md-button"]} href="#calculadora">
                            {t.ctaSecondary}
                        </md-outlined-button>
                    </div>
                </div>
            </div>
        </section>
    );
}
