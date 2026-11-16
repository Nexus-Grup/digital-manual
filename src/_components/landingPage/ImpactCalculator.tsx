"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/_styles/landingPage/ImpactCalculator.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import { PaperIcon, ScaleIcon, TreeIcon } from "@/_components/landingPage/Icons";

// Research assumptions (Time Nexus benchmark): 75 g/m² paper, A4 sheet = 4.68 g, ream = 500 sheets.
const A4_SHEET_GRAMS = 4.68;
const SHEETS_PER_REAM = 500;

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

const integerFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

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

    const results = [
        {
            icon: <ScaleIcon />,
            value: `${tons < 10 ? decimalFormat.format(tons) : integerFormat.format(tons)} t`,
            label: "de papel a menos por ano",
        },
        {
            icon: <PaperIcon />,
            value: integerFormat.format(sheets),
            label: "folhas A4 equivalentes",
        },
        {
            icon: <TreeIcon />,
            value: integerFormat.format(reams),
            label: "resmas de 500 folhas",
        },
    ];

    return (
        <section className={styles["impact-calculator"]} id="calculadora" aria-labelledby="calculator-title">
            <div className={styles["impact-calculator__container"]}>
                <div className={styles["impact-calculator__intro"]}>
                    <SectionHeading
                        id="calculator-title"
                        eyebrow="Calculadora de impacto"
                        title="Quanto papel a sua empresa deixaria de imprimir?"
                        text="Informe quantos produtos você vende por ano e veja, com as premissas da nossa pesquisa, o impacto de migrar para o Manual digital."
                    />
                    <form className={styles["impact-calculator__form"]} onSubmit={(event) => event.preventDefault()}>
                        <md-outlined-text-field
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
                            {MANUAL_TYPES.map((type) => (
                                <md-select-option
                                    key={type.value}
                                    value={type.value}
                                    selected={type.value === String(INITIAL_STATE.grams) ? "" : undefined}
                                >
                                    <div slot="headline">{type.label}</div>
                                </md-select-option>
                            ))}
                        </md-outlined-select>
                        <md-outlined-select
                            ref={shareRef}
                            className={styles["impact-calculator__field"]}
                            label="Produtos que hoje vão com manual impresso"
                        >
                            {PRINTED_SHARES.map((share) => (
                                <md-select-option
                                    key={share.value}
                                    value={share.value}
                                    selected={share.value === String(INITIAL_STATE.share) ? "" : undefined}
                                >
                                    <div slot="headline">{share.label}</div>
                                </md-select-option>
                            ))}
                        </md-outlined-select>
                    </form>
                </div>
                <div className={styles["impact-calculator__results"]} aria-live="polite">
                    <p className={styles["impact-calculator__results-title"]}>
                        {integerFormat.format(manuals)} manuais impressos a menos por ano significam:
                    </p>
                    <ul className={styles["impact-calculator__list"]}>
                        {results.map((result) => (
                            <li className={styles["impact-calculator__item"]} key={result.label}>
                                <span className={styles["impact-calculator__item-icon"]}>{result.icon}</span>
                                <div className={styles["impact-calculator__item-content"]}>
                                    <p className={styles["impact-calculator__value"]}>{result.value}</p>
                                    <p className={styles["impact-calculator__label"]}>{result.label}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className={styles["impact-calculator__note"]}>
                        Premissas: papel 75 g/m², folha A4 de 4,68 g e manual de 18,72 g a 80 g, conforme o estudo do Time
                        Nexus. Sem contar capa, perdas de impressão e frete.
                    </p>
                </div>
            </div>
        </section>
    );
}
