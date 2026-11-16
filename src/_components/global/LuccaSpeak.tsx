"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/_styles/global/LuccaSpeak.module.css";

type Props = {
  /** Falas do Lucca, uma depois da outra */
  messages?: string[];
  /** Repete as falas em loop. Com false, chama onDone depois da última */
  loop?: boolean;
  /** Velocidade da digitação (ms por letra) */
  typeMs?: number;
  /** Tempo que cada fala fica na tela depois de digitada */
  holdMs?: number;
  /** Largura do Lucca em px */
  size?: number;
  /** Ocupa a tela toda ou só o espaço do pai */
  fullscreen?: boolean;
  onDone?: () => void;
};

const SEP = "\u0000";

export default function LuccaSpeech({
  messages = ["Olá! Eu sou o Lucca.", "Já já o manual fica pronto..."],
  loop = true,
  typeMs = 45,
  holdMs = 1800,
  size = 150,
  fullscreen = true,
  onDone,
}: Props) {
  // chave estável: passar um array novo a cada render não reinicia a animação
  const key = messages.join(SEP);
  const list = key.split(SEP);

  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [talking, setTalking] = useState(false);
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
    const lines = key.split(SEP);

    async function run() {
      try {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setIdx(0);
          setTyped(lines[0]);
          return;
        }
        do {
          for (let i = 0; i < lines.length; i++) {
            setIdx(i);
            setTyped("");
            await wait(350); // balão aparece
            setTalking(true);
            for (let c = 1; c <= lines[i].length; c++) {
              setTyped(lines[i].slice(0, c));
              await wait(typeMs + Math.random() * 25);
            }
            setTalking(false);
            await wait(holdMs);
          }
        } while (loop);
        onDoneRef.current?.();
      } catch {
        /* componente desmontado */
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [key, loop, typeMs, holdMs]);

  return (
    <div
      className={fullscreen ? `${styles.wrap} ${styles.full}` : styles.wrap}
      role="status"
      aria-label={list[idx]}
    >
      <svg
        className={styles.lucca}
        style={{ width: size }}
        viewBox="68 34 182 248"
        aria-hidden="true"
      >
        <rect x="85" y="108" width="150" height="172" rx="38" fill="var(--green)" />
        <rect x="113" y="193" width="92" height="69" rx="26" fill="var(--belly)" />
        <g className={styles.eye}>
          <circle cx="128" cy="150" r="25" fill="#fff" />
          <circle cx="124" cy="149" r="12" fill="var(--ink)" />
        </g>
        <g className={`${styles.eye} ${styles.eyeR}`}>
          <circle cx="187" cy="150" r="25" fill="#fff" />
          <circle cx="183" cy="149" r="12" fill="var(--ink)" />
        </g>
        <polygon
          className={talking ? styles.beakTalk : styles.beak}
          points="148,177 172,177 160,193"
          fill="var(--beak)"
        />
        <path d="M96 106 C98 62 128 38 160 38 C192 38 220 62 224 106 Z" fill="var(--hat)" />
        <rect x="150" y="42" width="19" height="48" rx="9.5" fill="var(--hat-light)" />
        <rect x="70" y="100" width="178" height="22" rx="11" fill="var(--hat)" />
      </svg>

      {/* key={idx} refaz a animação de "pop" a cada fala nova */}
      <div key={idx} className={styles.bubble}>
        {/* texto fantasma reserva o tamanho final: o balão não pula enquanto digita */}
        <span className={styles.ghost} aria-hidden="true">{list[idx]}</span>
        <span className={styles.typed}>{typed}</span>
      </div>
    </div>
  );
}