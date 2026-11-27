import Link from "next/link";
import { SUPPORT_BASE } from "@/lib/support/constants";
import { getUserTickets } from "@/lib/support/queries";
import { TicketsTable } from "@/_components/userPanelComponents/support/user/TicketsTable";
import page from "@/_styles/cssUserPanelPage/support/supportPage.module.css";

export async function UserTicketsView({ userId }: { userId: number }) {
  const tickets = await getUserTickets(userId);

  return (
    <section className={page.page}>
      <header className={page.header}>
        <div>
          <h1 className={page.title}>Meus chamados de suporte</h1>
          <p className={page.subtitle}>Acompanhe o status de cada solicitação.</p>
        </div>
        <Link href={`${SUPPORT_BASE}/novo`} className={page.outlineBtn}>
          + Open ticket
        </Link>
      </header>
      <TicketsTable tickets={tickets} />
    </section>
  );
}
