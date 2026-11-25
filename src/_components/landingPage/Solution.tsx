import styles from "@/_styles/landingPage/Solution.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaPlay from "@/_assets/image/lucca/lucca-play.png";
import SolutionDemo from "@/_components/landingPage/SolutionDemo";
import { ChecklistIcon, CubeIcon, PlayIcon, QrCodeIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Icons in the same order as t.features.
const FEATURE_ICONS = [<CubeIcon key="cube" />, <ChecklistIcon key="checklist" />, <PlayIcon key="play" />, <QrCodeIcon key="qr" />];

export default function Solution({ t }: { t: Dictionary["solution"] }) {
    return (
        <section className={styles["solution"]} id="solucao" aria-labelledby="solution-title">
            <div className={styles["solution__container"]}>
                <SectionHeading
                    id="solution-title"
                    lucca={luccaPlay}
                    eyebrow={t.eyebrow}
                    title={t.title}
                    text={t.text}
                />
                <div className={styles["solution__grid"]}>
                    <SolutionDemo t={t.demo} />
                    <ul className={styles["solution__features"]}>
                        {t.features.map((feature, index) => (
                            <li className={styles["solution__card"]} key={feature.title}>
                                <span className={styles["solution__card-icon"]}>{FEATURE_ICONS[index]}</span>
                                <div className={styles["solution__card-content"]}>
                                    <h3 className={styles["solution__card-title"]}>{feature.title}</h3>
                                    <p className={styles["solution__card-text"]}>{feature.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
