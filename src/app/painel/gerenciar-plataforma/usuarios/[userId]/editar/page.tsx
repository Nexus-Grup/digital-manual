import type { Metadata } from "next";
import { UserCog } from "lucide-react";
import { PanelEmptyState } from "@/_components/userPanelComponents/utils_panel/PanelEmptyState";

export const metadata: Metadata = { title: "Editar usuário" };

export default function EditUserPage() {
  return (
    <main id="conteudo">
      <PanelEmptyState
        icon={UserCog}
        title="Editar usuário"
        text="Aqui você vai poder alterar os dados, o papel no sistema e o acesso deste usuário às empresas."
        shortcuts={[{ href: "/painel/gerenciar-plataforma/usuarios", label: "Voltar para os usuários" }]}
      />
    </main>
  );
}
