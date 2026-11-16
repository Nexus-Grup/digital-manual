import styles from "@/_styles/global/LuccaLoader.module.css";

type Props = {
  /** "blink" = só o Lucca piscando · "dots" = piscando + bolinhas girando embaixo */
  variant?: "blink" | "dots";
  /** Largura do Lucca em px */
  size?: number;
  /** Ocupa a tela toda (true) ou só o espaço do pai (false) */
  fullscreen?: boolean;
};

export default function LuccaLoader({
  variant = "dots",
  size = 96,
  fullscreen = true,
}: Props) {
  return (
    <div
      className={fullscreen ? `${styles.wrap} ${styles.full}` : styles.wrap}
      role="status"
      aria-label="Carregando"
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
        <polygon points="148,177 172,177 160,193" fill="var(--beak)" />
        <path d="M96 106 C98 62 128 38 160 38 C192 38 220 62 224 106 Z" fill="var(--hat)" />
        <rect x="150" y="42" width="19" height="48" rx="9.5" fill="var(--hat-light)" />
        <rect x="70" y="100" width="178" height="22" rx="11" fill="var(--hat)" />
      </svg>

      {variant === "dots" && (
        <div className={styles.spinner} aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              style={{
                transform: `rotate(${i * 45}deg) translateY(-15px)`,
                opacity: 0.2 + (i / 7) * 0.8,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}