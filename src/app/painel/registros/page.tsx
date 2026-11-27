import type { Metadata } from "next";
import { Logs } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/Logs.module.css";
import { PanelEmptyState } from "@/_components/userPanelComponents/utils_panel/PanelEmptyState";

export const metadata: Metadata = { title: "Registros" };

export default function LogsPage() {
  return (
    <main id="conteudo" className={styles.container_main}>
      <PanelEmptyState
        icon={Logs}
        title="Registros"
        text="Aqui vai ficar o histórico de ações da plataforma: quem criou, editou ou publicou cada empresa, marca e produto."
        shortcuts={[
          { href: "/painel/gerenciar-plataforma/usuarios", label: "Gerenciar usuários" },
          { href: "/painel/suporte", label: "Ver chamados de suporte" },
        ]}
      />
    </main>
  );
}
