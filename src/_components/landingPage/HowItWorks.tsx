import styles from "@/_styles/landingPage/HowItWorks.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaWrench from "@/_assets/image/lucca/lucca-wrench.png";
import { RocketIcon, SparkleIcon, UploadIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Icons in the same order as t.steps.
const STEP_ICONS = [<UploadIcon key="upload" size={26} />, <SparkleIcon key="sparkle" size={26} />, <RocketIcon key="rocket" size={26} />];

export default function HowItWorks({ t }: { t: Dictionary["howItWorks"] }) {
    return (
        <section className={styles["how-it-works"]} id="como-funciona" aria-labelledby="how-it-works-title">
            <div className={styles["how-it-works__container"]}>
                <SectionHeading
                    id="how-it-works-title"
                    lucca={luccaWrench}
                    eyebrow={t.eyebrow}
                    title={t.title}
                    text={t.text}
                    centered
                />
                <ol className={styles["how-it-works__list"]}>
                    {t.steps.map((step, index) => (
                        <li className={styles["how-it-works__step"]} key={step.title}>
                            <div className={styles["how-it-works__step-header"]}>
                                <span className={styles["how-it-works__number"]}>{index + 1}</span>
                                <span className={styles["how-it-works__icon"]}>{STEP_ICONS[index]}</span>
                            </div>
                            <h3 className={styles["how-it-works__title"]}>{step.title}</h3>
                            <p className={styles["how-it-works__text"]}>{step.text}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
