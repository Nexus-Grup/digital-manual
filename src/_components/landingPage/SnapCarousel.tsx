"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "@/_styles/landingPage/SnapCarousel.module.css";

type SnapCarouselProps = {
    /** Accessible name of the carousel region. */
    label: string;
    /** Number of cards (one dot per card). */
    count: number;
    /** Changing this value scrolls the carousel back to the first card (e.g. after filtering). */
    resetKey?: string;
    /** Dot colors for dark sections. */
    inverse?: boolean;
    /** The card list (<ul> with one <li> per card). */
    children: ReactNode;
};

// Mobile/tablet card carousel built on native CSS scroll-snap (swipe, trackpad and keyboard work out of the box).
// The dots show the current card and jump to a card. From 1200px the list falls back to its own grid layout.
export default function SnapCarousel({ label, count, resetKey, inverse = false, children }: SnapCarouselProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    const getCards = () => {
        const viewport = viewportRef.current;
        return viewport ? Array.from(viewport.querySelectorAll<HTMLElement>(":scope > ul > li")) : [];
    };

    // Back to the first card whenever the content changes (the scroll listener then updates the dots).
    useEffect(() => {
        viewportRef.current?.scrollTo({ left: 0 });
    }, [resetKey, count]);

    // Track the card closest to the start edge (rAF-throttled, passive listener).
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const cards = Array.from(viewport.querySelectorAll<HTMLElement>(":scope > ul > li"));
                let closest = 0;
                let distance = Infinity;
                cards.forEach((card, index) => {
                    const current = Math.abs(card.offsetLeft - viewport.scrollLeft);
                    if (current < distance) {
                        distance = current;
                        closest = index;
                    }
                });
                setActive(closest);
            });
        };

        viewport.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            viewport.removeEventListener("scroll", onScroll);
        };
    }, []);

    const goTo = (index: number) => {
        const viewport = viewportRef.current;
        const card = getCards()[index];
        if (!viewport || !card) return;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        viewport.scrollTo({ left: card.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    };

    return (
        <div className={styles["snap-carousel"]}>
            <div
                className={styles["snap-carousel__viewport"]}
                ref={viewportRef}
                role="region"
                aria-label={label}
                tabIndex={0}
            >
                {children}
            </div>
            <div className={styles["snap-carousel__dots"]}>
                {Array.from({ length: count }, (_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={[
                            styles["snap-carousel__dot"],
                            inverse ? styles["snap-carousel__dot--inverse"] : "",
                            index === active ? styles["snap-carousel__dot--active"] : "",
                        ].join(" ")}
                        aria-label={`Ir para o card ${index + 1} de ${count}`}
                        aria-current={index === active ? "true" : undefined}
                        onClick={() => goTo(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
}
