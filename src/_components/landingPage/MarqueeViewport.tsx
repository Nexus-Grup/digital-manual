"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "@/_styles/landingPage/LogoMarquee.module.css";

// Runs the marquee animation only while it is on screen (IntersectionObserver),
// so off-screen it costs no compositing work.
// WCAG 2.2.2: moving content that starts by itself needs a visible way to pause it, so there is a
// Pause/Resume button (keyboard and touch users can't rely on hover). With "reduce motion" turned on
// in the system, the CSS shows a static grid instead and the button is hidden.
export default function MarqueeViewport({ children }: { children: ReactNode }) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [onScreen, setOnScreen] = useState(false);
    const [userPaused, setUserPaused] = useState(false);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
            rootMargin: "100px 0px",
        });
        observer.observe(viewport);

        return () => observer.disconnect();
    }, []);

    const paused = userPaused || !onScreen;

    return (
        <div className={styles["logo-marquee__stage"]}>
            <div className={styles["logo-marquee__viewport"]} ref={viewportRef}>
                <div className={`${styles["logo-marquee__track"]} ${paused ? styles["logo-marquee__track--paused"] : ""}`}>
                    {children}
                </div>
            </div>
            <button
                type="button"
                className={styles["logo-marquee__toggle"]}
                aria-pressed={userPaused}
                onClick={() => setUserPaused((value) => !value)}
            >
                {userPaused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
                {userPaused ? "Retomar animação" : "Pausar animação"}
            </button>
        </div>
    );
}
