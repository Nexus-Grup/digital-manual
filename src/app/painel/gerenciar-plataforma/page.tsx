import { redirect } from "next/navigation";

// The platform area starts at its first section (Usuários): no empty landing page.
export default function ManagePlatformPage() {
  redirect("/painel/gerenciar-plataforma/usuarios");
}
