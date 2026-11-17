import type { ReactNode } from "react";
import styles from "@/_styles/landingPage/SectionHeading.module.css";

type SectionHeadingProps = {
    id?: string;
    eyebrow: string;
    title: ReactNode;
    text?: ReactNode;
    inverse?: boolean;
    centered?: boolean;
};

// Shared eyebrow + h2 + intro text used at the top of each section.
export default function SectionHeading({ id, eyebrow, title, text, inverse = false, centered = false }: SectionHeadingProps) {
    const blockClass = [
        styles["section-heading"],
        centered ? styles["section-heading--centered"] : "",
    ].join(" ");
    const eyebrowClass = [
        styles["section-heading__eyebrow"],
        inverse ? styles["section-heading__eyebrow--inverse"] : "",
    ].join(" ");
    const textGradientClass = [
        styles["section-heading__eyebrow-text"],
        inverse ? styles["section-heading__eyebrow-text--inverse"] : "",
    ].join(" ");
    const titleClass = [
        styles["section-heading__title"],
        inverse ? styles["section-heading__title--inverse"] : "",
    ].join(" ");
    const textClass = [
        styles["section-heading__text"],
        inverse ? styles["section-heading__text--inverse"] : "",
    ].join(" ");

    return (
        <div className={blockClass}>
            <p className={eyebrowClass}>
                <span className={textGradientClass}>{eyebrow}</span>
            </p>
            <h2 id={id} className={titleClass}>
                {title}
            </h2>
            {text ? <p className={textClass}>{text}</p> : null}
        </div>
    );
}
