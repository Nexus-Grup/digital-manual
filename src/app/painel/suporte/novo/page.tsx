import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SUPPORT_BASE } from "@/lib/support/constants";
import { getTicketTargets } from "@/lib/support/queries";
import { NewTicketForm } from "@/_components/userPanelComponents/support/user/NewTicketForm";
import page from "@/_styles/cssUserPanelPage/support/supportPage.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo chamado" };

export const instant = false;
export default async function NewTicketPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  // Admin atende chamados, não abre: volta para a fila.
  if (user.systemRole === "ADMIN") redirect(SUPPORT_BASE);
  const targets = await getTicketTargets(user.id);

  return (
    <main id="conteudo" className="container-stage-section">
      <section className={page.page}>
        <Link href={SUPPORT_BASE} className={page.crumb}>
          ← My support tickets
        </Link>
        <header className={page.header}>
          <div>
            <h1 className={page.title}>Novo chamado</h1>
            <p className={page.subtitle}>Conte o que está acontecendo e nossa equipe vai responder aqui.</p>
          </div>
        </header>
        <div className={page.grid}>
          <div className={page.card}>
            <NewTicketForm targets={targets} />
          </div>
          <aside className={page.card}>
            <h2 className={page.cardTitle}>Antes de abrir um chamado</h2>
            <p className={page.cardText}>
              Check whether the product manual already answers your question. The more details you give, the faster we can solve it.
            </p>
          </aside>
        </div>
      </section>      
    </main>

  );
}
