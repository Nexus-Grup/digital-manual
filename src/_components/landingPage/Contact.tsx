"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import styles from "@/_styles/landingPage/Contact.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import { CheckIcon } from "@/_components/landingPage/Icons";
import type { Dictionary } from "@/_i18n/dictionaries/pt-BR";

// Option values, in the same order as t.volumes.
const VOLUME_VALUES = ["up-to-10k", "10k-100k", "100k-1m", "over-1m"];

// B2B lead form. Material fields are form-associated, so native validation blocks invalid submits.
// TODO: send the lead to a backend (API route or CRM) once it exists.
export default function Contact({ t }: { t: Dictionary["contact"] }) {
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
                        eyebrow={t.eyebrow}
                        title={t.title}
                        text={t.text}
                        inverse
                    />
                </div>
                <div className={styles["contact__panel"]} aria-live="polite">
                    {sent ? (
                        <div className={styles["contact__success"]}>
                            <span className={styles["contact__success-icon"]}>
                                <CheckIcon size={32} />
                            </span>
                            <h3 className={styles["contact__success-title"]}>{t.successTitle}</h3>
                            <p className={styles["contact__success-text"]}>{t.successText}</p>
                            <md-text-button className={buttonStyles["md-button--text"]} onClick={() => setSent(false)}>
                                {t.sendAnother}
                            </md-text-button>
                        </div>
                    ) : (
                        <form className={styles["contact__form"]} onSubmit={handleSubmit} noValidate>
                            <md-outlined-text-field
                                className={styles["contact__field"]}
                                label={t.name}
                                name="name"
                                autocomplete="name"
                                required
                            ></md-outlined-text-field>
                            <md-outlined-text-field
                                className={styles["contact__field"]}
                                label={t.company}
                                name="company"
                                autocomplete="organization"
                                required
                            ></md-outlined-text-field>
                            <md-outlined-text-field
                                className={styles["contact__field"]}
                                label={t.email}
                                name="email"
                                type="email"
                                autocomplete="email"
                                required
                            ></md-outlined-text-field>
                            <md-outlined-select
                                className={styles["contact__field"]}
                                label={t.volume}
                                name="volume"
                                required
                            >
                                {VOLUME_VALUES.map((value, index) => (
                                    <md-select-option key={value} value={value}>
                                        <div slot="headline">{t.volumes[index]}</div>
                                    </md-select-option>
                                ))}
                            </md-outlined-select>
                            <md-filled-button className={`${buttonStyles["md-button"]} ${styles["contact__submit"]}`} type="submit">
                                {t.submit}
                            </md-filled-button>
                            <p className={styles["contact__privacy"]}>{t.privacy}</p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
