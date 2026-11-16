"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import styles from "@/_styles/landingPage/Contact.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import { CheckIcon } from "@/_components/landingPage/Icons";

const VOLUME_OPTIONS = [
    { value: "up-to-10k", label: "Até 10 mil produtos/ano" },
    { value: "10k-100k", label: "De 10 mil a 100 mil produtos/ano" },
    { value: "100k-1m", label: "De 100 mil a 1 milhão de produtos/ano" },
    { value: "over-1m", label: "Mais de 1 milhão de produtos/ano" },
];

// B2B lead form. Material fields are form-associated, so native validation blocks invalid submits.
// TODO: send the lead to a backend (API route or CRM) once it exists.
export default function Contact() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!event.currentTarget.reportValidity()) return;
        setSent(true);
    };

    return (
        <section className={styles["contact"]} id="contato" aria-labelledby="contact-title">
            <div className={styles["contact__container"]}>
                <div className={styles["contact__intro"]}>
                    <SectionHeading
                        id="contact-title"
                        eyebrow="Fale com a gente"
                        title="Pronto para modernizar a embalagem e o pós-venda dos seus produtos?"
                        text="Conte um pouco sobre a sua operação. Nosso time prepara uma demonstração com um manual da sua linha de produtos."
                        inverse
                    />
                </div>
                <div className={styles["contact__panel"]} aria-live="polite">
                    {sent ? (
                        <div className={styles["contact__success"]}>
                            <span className={styles["contact__success-icon"]}>
                                <CheckIcon size={32} />
                            </span>
                            <h3 className={styles["contact__success-title"]}>Recebemos seu contato!</h3>
                            <p className={styles["contact__success-text"]}>
                                Em breve o Time Nexus fala com você pelo e-mail informado.
                            </p>
                            <md-text-button className={buttonStyles["md-button--text"]} onClick={() => setSent(false)}>Enviar outro contato</md-text-button>
                        </div>
                    ) : (
                        <form className={styles["contact__form"]} onSubmit={handleSubmit} noValidate>
                            <md-outlined-text-field
                                className={styles["contact__field"]}
                                label="Nome"
                                name="name"
                                autocomplete="name"
                                required
                            ></md-outlined-text-field>
                            <md-outlined-text-field
                                className={styles["contact__field"]}
                                label="Empresa"
                                name="company"
                                autocomplete="organization"
                                required
                            ></md-outlined-text-field>
                            <md-outlined-text-field
                                className={styles["contact__field"]}
                                label="E-mail corporativo"
                                name="email"
                                type="email"
                                autocomplete="email"
                                required
                            ></md-outlined-text-field>
                            <md-outlined-select
                                className={styles["contact__field"]}
                                label="Volume aproximado de produtos por ano"
                                name="volume"
                                required
                            >
                                {VOLUME_OPTIONS.map((option) => (
                                    <md-select-option key={option.value} value={option.value}>
                                        <div slot="headline">{option.label}</div>
                                    </md-select-option>
                                ))}
                            </md-outlined-select>
                            <md-filled-button className={`${buttonStyles["md-button"]} ${styles["contact__submit"]}`} type="submit">
                                Quero uma demonstração
                            </md-filled-button>
                            <p className={styles["contact__privacy"]}>
                                Usamos seus dados apenas para retornar este contato.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
