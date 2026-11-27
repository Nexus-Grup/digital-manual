"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/UsersPage.module.css";

export function UserRowMenu({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={styles.menuWrap}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="Ações do usuário"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div role="menu" className={styles.menu}>
          {/* TODO: abrir o formulário em modo edição (userId) quando existir */}
          <button type="button" role="menuitem" className={styles.menuItem} disabled>
            Edit (soon)
          </button>
        </div>
      )}
    </div>
  );
}
