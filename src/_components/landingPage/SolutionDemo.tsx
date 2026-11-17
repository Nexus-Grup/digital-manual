"use client";

import { useState } from "react";
import styles from "@/_styles/landingPage/SolutionDemo.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import { format } from "@/_i18n/config";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

const CUBE_FACES = ["front", "back", "right", "left", "top", "bottom"] as const;

// Lightweight preview of the product page: rotating 3D part, exploded view and step checklist.
export default function SolutionDemo({ t }: { t: Dictionary["solution"]["demo"] }) {
    const steps = t.steps;
    const [exploded, setExploded] = useState(false);
    const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));

    const completed = done.filter(Boolean).length;
    const progress = completed / steps.length;

    const toggleStep = (index: number) => {
        setDone((current) => current.map((value, i) => (i === index ? !value : value)));
    };

    return (
        <div className={styles["solution-demo"]}>
            <div className={styles["solution-demo__header"]}>
                <p className={styles["solution-demo__product"]}>{t.product}</p>
                <p className={styles["solution-demo__step"]}>
                    {format(t.step, { current: Math.min(completed + 1, steps.length), total: steps.length })}
                </p>
            </div>
            <div className={styles["solution-demo__stage"]}>
                <div
                    className={`${styles["solution-demo__cube"]} ${exploded ? styles["solution-demo__cube--exploded"] : ""}`}
                    role="img"
                    aria-label={exploded ? t.cubeExploded : t.cubeSpinning}
                >
                    {CUBE_FACES.map((face) => (
                        <span
                            key={face}
                            className={`${styles["solution-demo__face"]} ${styles[`solution-demo__face--${face}`]}`}
                        ></span>
                    ))}
                </div>
            </div>
            <md-filled-tonal-button
                className={`${buttonStyles["md-button"]} ${styles["solution-demo__toggle"]}`}
                onClick={() => setExploded((value) => !value)}
                aria-pressed={exploded}
            >
                {exploded ? t.assemble : t.explode}
            </md-filled-tonal-button>
            <div className={styles["solution-demo__checklist"]}>
                <div
                    className={styles["solution-demo__progress"]}
                    role="progressbar"
                    aria-label={t.progress}
                    aria-valuemin={0}
                    aria-valuemax={steps.length}
                    aria-valuenow={completed}
                >
                    <span
                        className={styles["solution-demo__progress-bar"]}
                        style={{ transform: `scaleX(${progress})` }}
                    ></span>
                </div>
                <ul className={styles["solution-demo__list"]}>
                    {steps.map((step, index) => (
                        <li key={step}>
                            <label className={styles["solution-demo__item"]}>
                                <md-checkbox
                                    touch-target="wrapper"
                                    checked={done[index]}
                                    onClick={() => toggleStep(index)}
                                ></md-checkbox>
                                <span
                                    className={`${styles["solution-demo__item-text"]} ${done[index] ? styles["solution-demo__item-text--done"] : ""}`}
                                >
                                    {step}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
