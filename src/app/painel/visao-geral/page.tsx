import type { Metadata } from "next";
import { Home } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/CompanyOverview.module.css";
import { PanelEmptyState } from "@/_components/userPanelComponents/utils_panel/PanelEmptyState";

export const metadata: Metadata = { title: "Visão geral da empresa" };

export default function CompanyOverviewPage() {
  return (
    <main id="conteudo" className={styles.container_main}>
      <PanelEmptyState
        icon={Home}
        title="Visão geral da empresa"
        text="Aqui você vai acompanhar, num só lugar, as marcas, os produtos publicados e o que ainda falta completar em cada um."
        shortcuts={[
          { href: "/painel/empresas", label: "Ver empresas" },
          { href: "/painel/marcas", label: "Ver marcas" },
          { href: "/painel/produtos", label: "Ver produtos" },
        ]}
      />
    </main>
  );
}
