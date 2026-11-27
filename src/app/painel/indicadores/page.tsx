import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/Dashboard.module.css";
import { PanelEmptyState } from "@/_components/userPanelComponents/utils_panel/PanelEmptyState";

export const metadata: Metadata = { title: "Indicadores" };

export default function DashboardPage() {
  return (
    <main id="conteudo" className={styles.container_main}>
      <PanelEmptyState
        icon={LayoutDashboard}
        title="Indicadores"
        text="Aqui vão aparecer os números de uso dos seus manuais: visualizações, leituras de QR Code e downloads ao longo do tempo."
        shortcuts={[{ href: "/painel/produtos", label: "Ver os números de cada produto (⋮ → Ver detalhes)" }]}
      />
    </main>
  );
}
