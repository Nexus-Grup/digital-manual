import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { parseIdOrNull } from "@/lib/support/ids";
import { AdminTicketView } from "@/_components/userPanelComponents/support/admin/AdminTicketView";
import { UserTicketView } from "@/_components/userPanelComponents/support/user/UserTicketView";
export const instant = false;
// /support/123: ADMIN abre qualquer chamado (com notas internas); usuário só os próprios.
export default async function TicketPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return null;

  const id = parseIdOrNull((await params).ticketId);
  if (!id) notFound();

  if (user.systemRole === "ADMIN") return ( <main className="container-stage-section"><AdminTicketView ticketId={id} />;</main>)
  return (
    <main className="container-stage-section">
      <UserTicketView userId={user.id} ticketId={id} />;
    </main>
  )
}
