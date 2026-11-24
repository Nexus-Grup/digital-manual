import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import styles from "@/_styles/landingPage/SectionHeading.module.css";

type SectionHeadingProps = {
    id?: string;
    eyebrow: string;
    title: ReactNode;
    text?: ReactNode;
    inverse?: boolean;
    centered?: boolean;
    /** Lucca pose next to the heading (decorative: the heading already says it all) */
    lucca?: StaticImageData;
};

// Shared eyebrow + h2 + intro text used at the top of each section.
export default function SectionHeading({ id, eyebrow, title, text, inverse = false, centered = false, lucca }: SectionHeadingProps) {
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

    const heading = (
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

    if (!lucca) return heading;

    // with Lucca: on the right of a left-aligned heading, above a centered one
    const wrapClass = [
        styles["section-heading__wrap"],
        centered ? styles["section-heading__wrap--centered"] : "",
    ].join(" ");
    return (
        <div className={wrapClass}>
            {heading}
            <Image
                className={styles["section-heading__lucca"]}
                src={lucca}
                alt=""
                sizes="(min-width: 768px) 140px, 96px"
            />
        </div>
    );
}
