import styles from "@/_styles/landingPage/Problem.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaPaper from "@/_assets/image/lucca/lucca-paper.png";
import { GlobeIcon, HandIcon, PaperIcon, ScaleIcon, SearchIcon, TreeIcon, TruckIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Icons in the same order as t.stats and t.pains.
const STAT_ICONS = [<TreeIcon key="tree" />, <ScaleIcon key="scale" />, <PaperIcon key="paper" />];
const PAIN_ICONS = [<SearchIcon key="search" />, <TruckIcon key="truck" />, <HandIcon key="hand" />, <GlobeIcon key="globe" />];

export default function Problem({ t }: { t: Dictionary["problem"] }) {
    return (
        <section className={styles["problem"]} id="problema" aria-labelledby="problem-title">
            <div className={styles["problem__container"]}>
                <SectionHeading
                    id="problem-title"
                    lucca={luccaPaper}
                    eyebrow={t.eyebrow}
                    title={t.title}
                    text={t.text}
                />
                <div className={styles["problem__grid"]}>
                    <div className={styles["problem__industry"]}>
                        <h3 className={styles["problem__subtitle"]}>{t.industryTitle}</h3>
                        <ul className={styles["problem__stats"]}>
                            {t.stats.map((stat, index) => (
                                <li className={styles["problem__stat"]} key={stat.value}>
                                    <span className={styles["problem__stat-icon"]}>{STAT_ICONS[index]}</span>
                                    <div className={styles["problem__stat-content"]}>
                                        <p className={styles["problem__stat-value"]}>
                                            {stat.value} <span className={styles["problem__stat-label"]}>{stat.label}</span>
                                        </p>
                                        <p className={styles["problem__stat-text"]}>{stat.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles["problem__users"]}>
                        <h3 className={styles["problem__subtitle"]}>{t.usersTitle}</h3>
                        <ul className={styles["problem__pains"]}>
                            {t.pains.map((pain, index) => (
                                <li className={styles["problem__pain"]} key={pain}>
                                    <span className={styles["problem__pain-icon"]}>{PAIN_ICONS[index]}</span>
                                    <p className={styles["problem__pain-text"]}>{pain}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <p className={styles["problem__note"]}>{t.note}</p>
            </div>
        </section>
    );
}
