"use client";
import styles from "@/_styles/cssUserPanelPage/support/ChipGroup.module.css";

type Props<T extends string> = {
  label: string;
  hideLabel?: boolean;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function ChipGroup<T extends string>({ label, hideLabel, options, value, onChange }: Props<T>) {
  return (
    <div className={styles.field}>
      <span className={hideLabel ? styles.srOnly : styles.label}>{label}</span>
      <div className={styles.chips} role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            className={`${styles.chip} ${o.value === value ? styles.active : ""}`}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
