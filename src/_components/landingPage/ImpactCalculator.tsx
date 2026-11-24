"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/_styles/landingPage/ImpactCalculator.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaCalculator from "@/_assets/image/lucca/lucca-calculator.png";
import { format } from "@/_i18n/config";
import type { Locale } from "@/_i18n/config";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Research assumptions (Time Nexus benchmark): 75 g/m² paper, A4 sheet = 4.68 g, ream = 500 sheets.
const A4_SHEET_GRAMS = 4.68;
const SHEETS_PER_REAM = 500;

// Option values (grams per manual / printed share), in the same order as t.manualTypes and t.shares.
const MANUAL_TYPE_VALUES = ["80", "18.72", "1.5"];
const PRINTED_SHARE_VALUES = ["0.7", "0.8", "0.9"];

type CalculatorState = {
    products: number;
    grams: number;
    share: number;
};

type ValueElement = HTMLElement & {
    value?: string;
};

const INITIAL_STATE: CalculatorState = {
    products: 100000,
    grams: 80,
    share: 0.8,
};


function toNumber(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return value !== undefined && value !== "" && Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

type ImpactCalculatorProps = {
    t: Dictionary["calculator"];
    /** Drives number formatting (1.367.521 in pt-BR, 1,367,521 in en...). */
    locale: Locale;
};

export default function ImpactCalculator({ t, locale }: ImpactCalculatorProps) {
    const integerFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    const decimalFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
    const productsRef = useRef<HTMLElement>(null);
    const gramsRef = useRef<HTMLElement>(null);
    const shareRef = useRef<HTMLElement>(null);

    // Material web components emit native "input"/"change" events; read their values directly.
    useEffect(() => {
        const fields = [productsRef.current, gramsRef.current, shareRef.current];
        const read = () => {
            setState({
                products: toNumber((productsRef.current as ValueElement | null)?.value, 0),
                grams: toNumber((gramsRef.current as ValueElement | null)?.value, INITIAL_STATE.grams),
                share: toNumber((shareRef.current as ValueElement | null)?.value, INITIAL_STATE.share),
            });
        };

        fields.forEach((field) => {
            field?.addEventListener("input", read);
            field?.addEventListener("change", read);
        });

        return () => {
            fields.forEach((field) => {
                field?.removeEventListener("input", read);
                field?.removeEventListener("change", read);
            });
        };
    }, []);

    const manuals = state.products * state.share;
    const totalGrams = manuals * state.grams;
    const tons = totalGrams / 1_000_000;
    const sheets = totalGrams / A4_SHEET_GRAMS;
    const reams = sheets / SHEETS_PER_REAM;

    // Main figure with the unit spelled out ("6,4 toneladas", not "6,4 t"); below 1 ton, kilograms read better.
    const plural = new Intl.PluralRules(locale);
    const useKilos = tons < 1;
    const weightAmount = useKilos ? totalGrams / 1000 : tons;
    const weightValue =
        weightAmount < 10 && !useKilos ? decimalFormat.format(weightAmount) : integerFormat.format(weightAmount);
    const isOne = plural.select(weightAmount) === "one";
    const weightUnit = useKilos
        ? isOne ? t.units.kgOne : t.units.kgOther
        : isOne ? t.units.tonOne : t.units.tonOther;

    const details = [
        { value: integerFormat.format(sheets), label: t.results[1] },
        { value: integerFormat.format(reams), label: t.results[2] },
    ];

    return (
        <section className={styles["impact-calculator"]} id="calculadora" aria-labelledby="calculator-title">
            <div className={styles["impact-calculator__container"]}>
                <div className={styles["impact-calculator__intro"]}>
                    <SectionHeading
                        id="calculator-title"
                        lucca={luccaCalculator}
                        eyebrow={t.eyebrow}
                        title={t.title}
                        text={t.text}
                    />
                    <form className={styles["impact-calculator__form"]} onSubmit={(event) => event.preventDefault()}>
                        <md-outlined-text-field
                            ref={productsRef}
                            className={styles["impact-calculator__field"]}
                            label={t.productsLabel}
                            type="number"
                            min="0"
                            step="1000"
                            value={String(INITIAL_STATE.products)}
                            inputmode="numeric"
                        ></md-outlined-text-field>
                        <md-outlined-select
                            ref={gramsRef}
                            className={styles["impact-calculator__field"]}
                            label={t.manualTypeLabel}
                        >
                            {MANUAL_TYPE_VALUES.map((value, index) => (
                                <md-select-option
                                    key={value}
                                    value={value}
                                    selected={value === String(INITIAL_STATE.grams) ? "" : undefined}
                                >
                                    <div slot="headline">{t.manualTypes[index]}</div>
                                </md-select-option>
                            ))}
                        </md-outlined-select>
                        <md-outlined-select
                            ref={shareRef}
                            className={styles["impact-calculator__field"]}
                            label={t.shareLabel}
                        >
                            {PRINTED_SHARE_VALUES.map((value, index) => (
                                <md-select-option
                                    key={value}
                                    value={value}
                                    selected={value === String(INITIAL_STATE.share) ? "" : undefined}
                                >
                                    <div slot="headline">{t.shares[index]}</div>
                                </md-select-option>
                            ))}
                        </md-outlined-select>
                    </form>
                </div>
                <div className={styles["impact-calculator__results"]} aria-live="polite">
                    <p className={styles["impact-calculator__results-title"]}>
                        {format(t.resultsTitle, { count: integerFormat.format(manuals) })}
                    </p>
                    {/* main result: paper weight, spelled out */}
                    <div className={styles["impact-calculator__highlight"]}>
                        <p className={styles["impact-calculator__highlight-value"]}>
                            {weightValue}{" "}
                            <span className={styles["impact-calculator__highlight-unit"]}>{weightUnit}</span>
                        </p>
                        <p className={styles["impact-calculator__highlight-label"]}>{t.results[0]}</p>
                    </div>
                    {/* equivalences, side by side */}
                    <ul className={styles["impact-calculator__list"]}>
                        {details.map((detail) => (
                            <li className={styles["impact-calculator__item"]} key={detail.label}>
                                <p className={styles["impact-calculator__value"]}>{detail.value}</p>
                                <p className={styles["impact-calculator__label"]}>{detail.label}</p>
                            </li>
                        ))}
                    </ul>
                    <p className={styles["impact-calculator__note"]}>{t.note}</p>
                </div>
            </div>
        </section>
    );
}
