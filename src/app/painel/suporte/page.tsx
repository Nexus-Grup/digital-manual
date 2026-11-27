import { getCurrentUser } from "@/lib/auth";
import { AdminInboxView } from "@/_components/userPanelComponents/support/admin/AdminInboxView";
import { UserTicketsView } from "@/_components/userPanelComponents/support/user/UserTicketsView";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Suporte" };

export const instant = false;
// /support: ADMIN vê a fila de todos os chamados; usuário vê os próprios.
export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.systemRole === "ADMIN") {
    return (
      <main id="conteudo" className="container-stage-section">
        <AdminInboxView adminId={user.id} searchParams={await searchParams} />;
      </main>
    )
  }
  return (
      <main id="conteudo" className="container-stage-section">
        <UserTicketsView userId={user.id} />;
      </main>
  )
}
