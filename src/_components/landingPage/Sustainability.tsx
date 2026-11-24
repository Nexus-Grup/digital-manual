import Image from "next/image";
import styles from "@/_styles/landingPage/Sustainability.module.css";
import mascot from "@/_assets/image/lucca/lucca-celebrate.png";
import luccaPlant from "@/_assets/image/lucca/lucca-plant.png";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import { BoltIcon, DropletIcon, TreeIcon, TruckIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Icons in the same order as t.resources.
const RESOURCE_ICONS = [<TreeIcon key="tree" />, <DropletIcon key="droplet" />, <BoltIcon key="bolt" />, <TruckIcon key="truck" />];

export default function Sustainability({ t }: { t: Dictionary["sustainability"] }) {
    return (
        <section className={styles["sustainability"]} id="sustentabilidade" aria-labelledby="sustainability-title">
            <div className={styles["sustainability__container"]}>
                <SectionHeading
                    id="sustainability-title"
                    lucca={luccaPlant}
                    eyebrow={t.eyebrow}
                    title={t.title}
                    text={t.text}
                />
                <ul className={styles["sustainability__list"]}>
                    {t.resources.map((resource, index) => (
                        <li className={styles["sustainability__item"]} key={resource.title}>
                            <span className={styles["sustainability__item-icon"]}>{RESOURCE_ICONS[index]}</span>
                            <div className={styles["sustainability__item-content"]}>
                                <h3 className={styles["sustainability__item-title"]}>{resource.title}</h3>
                                <p className={styles["sustainability__item-text"]}>{resource.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className={styles["sustainability__transition"]}>
                    <Image
                        className={styles["sustainability__mascot"]}
                        src={mascot}
                        alt=""
                        sizes="120px"
                    />
                    <div className={styles["sustainability__transition-content"]}>
                        <h3 className={styles["sustainability__transition-title"]}>{t.transitionTitle}</h3>
                        <p className={styles["sustainability__transition-text"]}>{t.transitionText}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
