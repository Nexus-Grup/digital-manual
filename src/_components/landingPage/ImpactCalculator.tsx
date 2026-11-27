"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/_styles/landingPage/ImpactCalculator.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaCalculator from "@/_assets/image/lucca/lucca-calculator.png";

// Research assumptions (Time Nexus benchmark): 75 g/m² paper, A4 sheet = 4.68 g, ream = 500 sheets.
const A4_SHEET_GRAMS = 4.68;
const SHEETS_PER_REAM = 500;

// Option values: grams per manual and printed share.
const MANUAL_TYPES = [
    { value: "80", label: "Eletrodoméstico (34 páginas, 80 g)" },
    { value: "18.72", label: "Manual compacto (16 páginas, 18,72 g)" },
    { value: "1.5", label: "Smartphone (folheto, 1,5 g)" },
];
const PRINTED_SHARES = [
    { value: "0.7", label: "70% dos produtos" },
    { value: "0.8", label: "80% dos produtos" },
    { value: "0.9", label: "90% dos produtos" },
];

const integerFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const plural = new Intl.PluralRules("pt-BR");

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

export default function ImpactCalculator() {
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
    const useKilos = tons < 1;
    const weightAmount = useKilos ? totalGrams / 1000 : tons;
    const weightValue =
        weightAmount < 10 && !useKilos ? decimalFormat.format(weightAmount) : integerFormat.format(weightAmount);
    const isOne = plural.select(weightAmount) === "one";
    const weightUnit = useKilos
        ? isOne ? "quilo" : "quilos"
        : isOne ? "tonelada" : "toneladas";

    const details = [
        { value: integerFormat.format(sheets), label: "folhas A4 equivalentes" },
        { value: integerFormat.format(reams), label: "resmas de 500 folhas" },
    ];

    return (
        <section className={styles["impact-calculator"]} id="calculadora" aria-labelledby="calculator-title">
            <div className={styles["impact-calculator__container"]}>
                <div className={styles["impact-calculator__intro"]}>
                    <SectionHeading
                        id="calculator-title"
                        lucca={luccaCalculator}
                        eyebrow="Calculadora de impacto"
                        title="Quanto papel a sua empresa deixaria de imprimir?"
                        text="Informe quantos produtos você vende por ano e veja, com as premissas da nossa pesquisa, o impacto de migrar para o Manual digital."
                    />
                    <form className={styles["impact-calculator__form"]} onSubmit={(event) => event.preventDefault()}>
                        <md-outlined-text-field
                            suppressHydrationWarning
                            ref={productsRef}
                            className={styles["impact-calculator__field"]}
                            label="Produtos vendidos por ano"
                            type="number"
                            min="0"
                            step="1000"
                            value={String(INITIAL_STATE.products)}
                            inputmode="numeric"
                        ></md-outlined-text-field>
                        <md-outlined-select
                            ref={gramsRef}
                            className={styles["impact-calculator__field"]}
                            label="Tipo de manual"
                        >
                            {MANUAL_TYPES.map(({ value, label }) => (
                                <md-select-option
                                    key={value}
                                    value={value}
                                    selected={value === String(INITIAL_STATE.grams) ? "" : undefined}
                                >
                                    <div slot="headline">{label}</div>
                                </md-select-option>
                            ))}
                        </md-outlined-select>
                        <md-outlined-select
                            ref={shareRef}
                            className={styles["impact-calculator__field"]}
                            label="Produtos que hoje vão com manual impresso"
                        >
                            {PRINTED_SHARES.map(({ value, label }) => (
                                <md-select-option
                                    key={value}
                                    value={value}
                                    selected={value === String(INITIAL_STATE.share) ? "" : undefined}
                                >
                                    <div slot="headline">{label}</div>
                                </md-select-option>
                            ))}
                        </md-outlined-select>
                    </form>
                </div>
                <div className={styles["impact-calculator__results"]} aria-live="polite">
                    <p className={styles["impact-calculator__results-title"]}>
                        {integerFormat.format(manuals)} manuais impressos a menos por ano significam:
                    </p>
                    {/* main result: paper weight, spelled out */}
                    <div className={styles["impact-calculator__highlight"]}>
                        <p className={styles["impact-calculator__highlight-value"]}>
                            {weightValue}{" "}
                            <span className={styles["impact-calculator__highlight-unit"]}>{weightUnit}</span>
                        </p>
                        <p className={styles["impact-calculator__highlight-label"]}>de papel a menos por ano</p>
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
                    <p className={styles["impact-calculator__note"]}>
                        Premissas: papel 75 g/m², folha A4 de 4,68 g e manual de 18,72 g a 80 g, conforme o estudo do
                        Time Nexus. Sem contar capa, perdas de impressão e frete.
                    </p>
                </div>
            </div>
        </section>
    );
}
