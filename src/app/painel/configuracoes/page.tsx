import type { Metadata } from "next";
import { Settings } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/Settings.module.css";
import { PanelEmptyState } from "@/_components/userPanelComponents/utils_panel/PanelEmptyState";

export const metadata: Metadata = { title: "Configurações" };

export default function SettingsPage() {
  return (
    <main id="conteudo" className={styles.container_main}>
      <PanelEmptyState
        icon={Settings}
        title="Configurações"
        text="Aqui vão ficar as preferências da sua conta, como avisos por e-mail. Os dados da empresa e das marcas já podem ser editados nas páginas delas."
        shortcuts={[
          { href: "/painel/perfil", label: "Editar meu perfil e senha" },
          { href: "/painel/empresas", label: "Configurações da empresa" },
          { href: "/painel/marcas", label: "Configurações da marca" },
        ]}
      />
    </main>
  );
}
