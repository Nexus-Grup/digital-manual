"use client";

import { useState } from "react";
import styles from "@/_styles/landingPage/SolutionDemo.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";

const STEPS = [
    "Separe as peças A, B e C",
    "Encaixe a lateral na base",
    "Fixe com 4 parafusos M6",
];

const CUBE_FACES = ["front", "back", "right", "left", "top", "bottom"] as const;

// Lightweight preview of the product page: rotating 3D part, exploded view and step checklist.
export default function SolutionDemo() {
    const [exploded, setExploded] = useState(false);
    const [done, setDone] = useState<boolean[]>(STEPS.map(() => false));

    const completed = done.filter(Boolean).length;
    const progress = completed / STEPS.length;

    const toggleStep = (index: number) => {
        setDone((current) => current.map((value, i) => (i === index ? !value : value)));
    };

    return (
        <div className={styles["solution-demo"]}>
            <div className={styles["solution-demo__header"]}>
                <p className={styles["solution-demo__product"]}>Rack para TV · Modelo R-120</p>
                <p className={styles["solution-demo__step"]}>
                    Passo {Math.min(completed + 1, STEPS.length)} de {STEPS.length}
                </p>
            </div>
            <div className={styles["solution-demo__stage"]}>
                <div
                    className={`${styles["solution-demo__cube"]} ${exploded ? styles["solution-demo__cube--exploded"] : ""}`}
                    role="img"
                    aria-label={exploded ? "Peça em vista explodida" : "Peça girando em 360 graus"}
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
                {exploded ? "Montar peça" : "Ver vista explodida"}
            </md-filled-tonal-button>
            <div className={styles["solution-demo__checklist"]}>
                <div
                    className={styles["solution-demo__progress"]}
                    role="progressbar"
                    aria-label="Progresso da montagem"
                    aria-valuemin={0}
                    aria-valuemax={STEPS.length}
                    aria-valuenow={completed}
                >
                    <span
                        className={styles["solution-demo__progress-bar"]}
                        style={{ transform: `scaleX(${progress})` }}
                    ></span>
                </div>
                <ul className={styles["solution-demo__list"]}>
                    {STEPS.map((step, index) => (
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
