import type { CSSProperties } from "react";
import styles from "@/_styles/landingPage/WaveDivider.module.css";

type WaveDividerProps = {
    /** Background color of the section above (CSS value, usually a --lp-* token). */
    from: string;
    /** Background color of the section below (CSS value, usually a --lp-* token). */
    to: string;
    /** Mirrors the wave horizontally to vary the rhythm between sections. */
    flip?: boolean;
    /**
     * Color of the translucent back layer (defaults to `to`). Use a brand color on light <-> dark
     * transitions, where a translucent `to` over `from` would read as a gray stripe.
     */
    accent?: string;
};

type WaveStyle = CSSProperties & {
    "--wave-from": string;
    "--wave-to": string;
    "--wave-accent": string;
};

// Decorative two-layer wave that blends one section background into the next.
export default function WaveDivider({ from, to, flip = false, accent }: WaveDividerProps) {
    const style: WaveStyle = {
        "--wave-from": from,
        "--wave-to": to,
        "--wave-accent": accent ?? to,
    };

    return (
        <div className={`${styles["wave"]} ${flip ? styles["wave--flip"] : ""}`} style={style} aria-hidden="true">
            <svg className={styles["wave__svg"]} viewBox="0 0 1440 120" preserveAspectRatio="none" focusable="false">
                <path
                    className={styles["wave__layer--back"]}
                    d="M0,36 C180,84 420,4 720,30 C1020,56 1220,104 1440,52 L1440,120 L0,120 Z"
                />
                <path
                    className={styles["wave__layer--front"]}
                    d="M0,70 C240,112 470,22 720,52 C970,82 1190,118 1440,74 L1440,120 L0,120 Z"
                />
            </svg>
        </div>
    );
}
