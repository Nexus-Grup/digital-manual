"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "@/_styles/landingPage/LogoMarquee.module.css";

// Runs the marquee animation only while it is on screen (IntersectionObserver),
// so off-screen it costs no compositing work.
export default function MarqueeViewport({ children }: { children: ReactNode }) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [onScreen, setOnScreen] = useState(false);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
            rootMargin: "100px 0px",
        });
        observer.observe(viewport);

        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles["logo-marquee__viewport"]} ref={viewportRef}>
            <div className={`${styles["logo-marquee__track"]} ${onScreen ? "" : styles["logo-marquee__track--paused"]}`}>
                {children}
            </div>
        </div>
    );
}
