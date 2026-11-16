import type { CSSProperties } from "react";
import styles from "@/_styles/global/LuccaObert.module.css";

type Props = {
  /** Diâmetro do círculo em px */
  size?: number;
  /** Segundos por volta */
  speed?: number;
  /** Texto pequeno embaixo (opcional) */
  label?: string;
  /** Ocupa a tela toda ou só o espaço do pai */
  fullscreen?: boolean;
};

const DOTS = 10;
const EYES = [
  { cx: 128, cy: 150 },
  { cx: 187, cy: 150 },
];
const LOOK = 9; // quanto a pupila anda para o lado da bolinha líder

// A bolinha líder (a mais forte) começa em -360/DOTS graus, medidos a partir do topo
const lead = (-360 / DOTS) * (Math.PI / 180);

export default function LuccaOrbit({
  size = 220,
  speed = 1.4,
  label,
  fullscreen = true,
}: Props) {
  const vars = {
    "--size": `${size}px`,
    "--radius": `${size / 2 - 12}px`,
    "--dot": `${Math.max(8, size * 0.05)}px`,
    "--spin": `${speed}s`,
  } as CSSProperties;

  return (
    <div
      className={fullscreen ? `${styles.wrap} ${styles.full}` : styles.wrap}
      role="status"
      aria-label={label ?? "Carregando"}
    >
      <div className={styles.orbit} style={vars}>
        {/* Anel de bolinhas girando */}
        <div className={styles.ring} aria-hidden="true">
          {Array.from({ length: DOTS }, (_, i) => (
            <span
              key={i}
              style={{
                opacity: 0.15 + (i / (DOTS - 1)) * 0.85,
                transform: `rotate(${(i * 360) / DOTS}deg) translateY(calc(var(--radius) * -1))`,
              }}
            />
          ))}
        </div>

        {/* Lucca no centro */}
        <svg className={styles.lucca} viewBox="68 34 182 248" aria-hidden="true">
          <rect x="85" y="108" width="150" height="172" rx="38" fill="var(--green)" />
          <rect x="113" y="193" width="92" height="69" rx="26" fill="var(--belly)" />

          {EYES.map(({ cx, cy }) => (
            <g key={cx} className={styles.eye}>
              <circle cx={cx} cy={cy} r="25" fill="#fff" />
              {/* a pupila gira junto com o anel, sempre olhando para a bolinha líder */}
              <g className={styles.look} style={{ transformOrigin: `${cx}px ${cy}px` }}>
                <circle
                  cx={cx + LOOK * Math.sin(lead)}
                  cy={cy - LOOK * Math.cos(lead)}
                  r="12"
                  fill="var(--ink)"
                />
              </g>
            </g>
          ))}

          <polygon points="148,177 172,177 160,193" fill="var(--beak)" />
          <path d="M96 106 C98 62 128 38 160 38 C192 38 220 62 224 106 Z" fill="var(--hat)" />
          <rect x="150" y="42" width="19" height="48" rx="9.5" fill="var(--hat-light)" />
          <rect x="70" y="100" width="178" height="22" rx="11" fill="var(--hat)" />
        </svg>
      </div>

      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
}