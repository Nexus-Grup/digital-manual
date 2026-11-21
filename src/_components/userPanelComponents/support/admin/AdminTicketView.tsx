import Link from "next/link";
import { notFound } from "next/navigation";
import { ADMIN_SUPPORT_BASE } from "@/lib/support/constants";
import { getAdminTicketDetail } from "@/lib/support/adminQueries";
import { AdminDetailsCard } from "@/_components/userPanelComponents/support/admin/AdminDetailsCard";
import { AdminReplyForm } from "@/_components/userPanelComponents/support/admin/AdminReplyForm";
import { ManageCard } from "@/_components/userPanelComponents/support/admin/ManageCard";
import { PriorityBadge } from "@/_components/userPanelComponents/support/user/PriorityBadge";
import { StatusBadge } from "@/_components/userPanelComponents/support/user/StatusBadge";
import { TicketThread } from "@/_components/userPanelComponents/support/user/TicketThread";
import page from "@/_styles/cssUserPanelPage/support/supportPage.module.css";

export async function AdminTicketView({ ticketId }: { ticketId: number }) {
  const ticket = await getAdminTicketDetail(ticketId);
  if (!ticket) notFound();

  return (
    <section className={page.page}>
      <Link href={ADMIN_SUPPORT_BASE} className={page.crumb}>← Support inbox</Link>
      <div className={page.titleRow}>
        <h1 className={page.title}>{ticket.title}</h1>
        <StatusBadge status={ticket.status} audience="admin" />
        <PriorityBadge priority={ticket.priority} />
      </div>
      <div className={page.grid}>
        <div className={page.card}>
          <TicketThread messages={ticket.messages} />
          <AdminReplyForm ticketId={ticket.id} closed={ticket.status === "CLOSED"} />
        </div>
        <div className={page.side}>
          <ManageCard
            ticketId={ticket.id}
            status={ticket.status}
            priority={ticket.priority}
            assigneeName={ticket.assigneeName}
          />
          <AdminDetailsCard ticket={ticket} />
        </div>
      </div>
    </section>
  );
}
