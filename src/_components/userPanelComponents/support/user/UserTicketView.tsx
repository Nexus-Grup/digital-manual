import Link from "next/link";
import { notFound } from "next/navigation";
import { SUPPORT_BASE } from "@/lib/support/constants";
import { getTicketDetail } from "@/lib/support/queries";
import { StatusBadge } from "@/_components/userPanelComponents/support/user/StatusBadge";
import { TicketDetailsCard } from "@/_components/userPanelComponents/support/user/TicketDetailsCard";
import { TicketReplyForm } from "@/_components/userPanelComponents/support/user/TicketReplyForm";
import { TicketThread } from "@/_components/userPanelComponents/support/user/TicketThread";
import page from "@/_styles/cssUserPanelPage/support/supportPage.module.css";

export async function UserTicketView({ userId, ticketId }: { userId: number; ticketId: number }) {
  const ticket = await getTicketDetail(userId, ticketId);
  if (!ticket) notFound();

  return (
    <section className={page.page}>
      <Link href={SUPPORT_BASE} className={page.crumb}>
        ← My support tickets
      </Link>
      <div className={page.titleRow}>
        <h1 className={page.title}>{ticket.title}</h1>
        <StatusBadge status={ticket.status} />
      </div>
      <div className={page.grid}>
        <div className={page.card}>
          <TicketThread messages={ticket.messages} />
          <TicketReplyForm ticketId={ticket.id} status={ticket.status} />
        </div>
        <TicketDetailsCard ticket={ticket} />
      </div>
    </section>
  );
}
