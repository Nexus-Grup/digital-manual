"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/_styles/global/waitScreen.module.css";

type Props = {
  /** Texto digitado ao lado do Lucca */
  text?: string;
  /** Repete a animação em loop (ideal para loading). Para trocar de página, use false */
  loop?: boolean;
  /** Tempo (ms) que o nome fica na tela depois de digitado, antes de terminar */
  holdMs?: number;
  /** Chamado quando a animação termina (texto digitado + pausa + fade-out) */
  onDone?: () => void;
};

type Phase = "idle" | "in" | "wave" | "small";

const cx = (...c: (string | false)[]) => c.filter(Boolean).join(" ");

export default function WaitScreen({
  text = "Manual digital",
  loop = true,
  holdMs = 1200,
  onDone,
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [boxWidth, setBoxWidth] = useState(0);
  const [out, setOut] = useState(false);
  const sizerRef = useRef<HTMLSpanElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    let cancelled = false;
    const wait = async (ms: number) => {
      await new Promise<void>((r) => setTimeout(r, ms));
      if (cancelled) throw new Error("cancelled");
    };

    async function run() {
      try {
        await document.fonts.ready;
        const fullW = (sizerRef.current?.offsetWidth ?? 0) + 14;
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduced) {
          setPhase("small");
          setBoxWidth(fullW);
          setTyped(text);
          await wait(holdMs);
          onDoneRef.current?.(); // sem animação, mas ainda avisa o fim
          return;
        }

        do {
          setOut(false);
          setPhase("idle");
          setBoxWidth(0);
          setTyped("");
          await wait(300);

          setPhase("in"); // 1. aparece
          await wait(700);
          setPhase("wave"); // 2. acena
          await wait(1900);
          setPhase("small"); // 3. se encolhe
          setBoxWidth(fullW);
          await wait(900);

          for (let i = 1; i <= text.length; i++) {
            // 4. digita
            setTyped(text.slice(0, i));
            await wait(text[i - 1] === " " ? 160 : 85 + Math.random() * 70);
          }
          await wait(holdMs); // 5. segura
          setOut(true); // 6. fade-out
          await wait(600);
          onDoneRef.current?.(); // 7. avisa quem chamou
        } while (loop);
      } catch {
        /* componente desmontado */
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [text, loop, holdMs]);

  const visible = phase !== "idle";
  const small = phase === "small";

  return (
    <div
      className={cx(styles.stage, out && styles.out)}
      role="status"
      aria-label={`Carregando ${text}`}
    >
      <div className={styles.logo}>
        <div
          className={cx(
            styles.lucca,
            visible && styles.in,
            phase === "wave" && styles.waving,
            small && styles.small
          )}
        >
          <svg viewBox="68 34 182 248" aria-hidden="true">
            <g className={styles.feet} fill="var(--beak)">
              <ellipse cx="135" cy="282" rx="14" ry="6" />
              <ellipse cx="183" cy="282" rx="14" ry="6" />
            </g>
            <g className={styles.arm}>
              <line x1="236" y1="180" x2="252" y2="236" stroke="var(--green-dark)" strokeWidth="38" strokeLinecap="round" />
            </g>
            <g className={cx(styles.arm, styles.armL)}>
              <line x1="84" y1="174" x2="48" y2="120" stroke="var(--green-dark)" strokeWidth="38" strokeLinecap="round" />
            </g>
            <rect x="85" y="108" width="150" height="172" rx="38" fill="var(--green)" />
            <rect x="113" y="193" width="92" height="69" rx="26" fill="var(--belly)" />
            <circle cx="128" cy="150" r="25" fill="#fff" />
            <circle cx="187" cy="150" r="25" fill="#fff" />
            <circle cx="124" cy="149" r="12" fill="var(--ink)" />
            <circle cx="183" cy="149" r="12" fill="var(--ink)" />
            <polygon points="148,177 172,177 160,193" fill="var(--beak)" />
            <path d="M96 106 C98 62 128 38 160 38 C192 38 220 62 224 106 Z" fill="var(--hat)" />
            <rect x="150" y="42" width="19" height="48" rx="9.5" fill="var(--hat-light)" />
            <rect x="70" y="100" width="178" height="22" rx="11" fill="var(--hat)" />
          </svg>
        </div>

        <div
          className={cx(styles.box, small && styles.open)}
          style={{ width: boxWidth }}
        >
          <span>{typed}</span>
          <span className={styles.caret} />
        </div>
      </div>

      <span ref={sizerRef} className={styles.sizer} aria-hidden="true">
        {text}
      </span>
    </div>
  );
}