import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Building2, Download, FileText, Gauge, Headset, Package, Plus, QrCode, Tag, UserRound, Users } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/Overview.module.css";
import { OverviewFilters } from "@/_components/userPanelComponents/overview/OverviewFilters";
import {
  ContentCoverage, StatCards, Thumb, ToComplete, TopProducts, UsageCards,
} from "@/_components/userPanelComponents/overview/OverviewCards";
import { prisma } from "@/lib/prisma";
import { PERIODS, getCatalogStats, getTopProducts, getUsage, toPeriod } from "@/lib/panelOverview";

export const metadata: Metadata = { title: "Visão geral da plataforma" };

type SearchParams = Promise<{ periodo?: string }>;

const MANAGE = "/painel/gerenciar-plataforma";
const OPEN_TICKETS = ["OPEN", "IN_PROGRESS", "AWAITING_USER"] as const;

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });

// Super user home (the layout already restricts this area to ADMIN): the whole platform at a glance.
export default function PlatformOverviewPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main id="conteudo" className={styles["overview"]}>
      <Suspense fallback={<p className={styles["overview__container"]}>Carregando a visão geral…</p>}>
        <PlatformOverview searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function PlatformOverview({ searchParams }: { searchParams: SearchParams }) {
  const days = toPeriod((await searchParams).periodo);
  const all = {}; // every product of the platform

  const [stats, usage, top, companies, users, usersActive, usersWithoutCompany, brands, openTickets, newUsers] =
    await Promise.all([
      getCatalogStats(all),
      getUsage(all, days),
      getTopProducts(all, days),
      prisma.company.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          logoUrl: true,
          _count: { select: { brands: true, userCompanies: true } },
          brands: { select: { _count: { select: { products: true } } } },
        },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { userCompanies: { none: {} } } }),
      prisma.brand.count({ where: { isActive: true } }),
      prisma.ticket.count({ where: { status: { in: [...OPEN_TICKETS] } } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true, firstName: true, lastName: true, email: true, createdAt: true, isActive: true,
          userCompanies: { take: 1, select: { company: { select: { name: true } } } },
        },
      }),
    ]);

  // companies with the most products first
  const companyRows = companies
    .map((c) => ({ ...c, products: c.brands.reduce((n, b) => n + b._count.products, 0) }))
    .sort((a, b) => b.products - a.products)
    .slice(0, 6);

  return (
    <div className={styles["overview__container"]}>
      <header className={styles["overview__header"]}>
        <div className={styles["overview__titles"]}>
          <h1 className={styles["overview__title"]}>Visão geral da plataforma</h1>
          <p className={styles["overview__subtitle"]}>Empresas, usuários, catálogo e uso dos manuais digitais em um só lugar.</p>
        </div>
        <div className={styles["overview__actions"]}>
          <Link className={`${styles["overview__action"]} ${styles["overview__action--primary"]}`} href={`${MANAGE}/usuarios/novo`}>
            <Plus size={16} aria-hidden /> Criar usuário
          </Link>
          <Link className={styles["overview__action"]} href="/painel/empresas/nova">
            <Plus size={16} aria-hidden /> Nova empresa
          </Link>
          <a className={styles["overview__action"]} href={`/api/painel/relatorio?escopo=plataforma&periodo=${days}`} download>
            <Download size={16} aria-hidden /> Baixar relatório (CSV)
          </a>
        </div>
      </header>

      <OverviewFilters
        fields={[{
          name: "periodo",
          label: "Período",
          value: String(days),
          options: PERIODS.map((d) => ({ value: String(d), label: `Últimos ${d} dias` })),
        }]}
      />

      <section className={styles["overview__block"]} aria-labelledby="platform-title">
        <h2 className={styles["overview__block-title"]} id="platform-title">Plataforma</h2>
        <StatCards
          label="Números da plataforma"
          items={[
            { label: "Empresas", value: companies.length, hint: "empresas ativas", icon: Building2, href: "/painel/empresas" },
            { label: "Usuários", value: usersActive, hint: `${users} no total · ${usersWithoutCompany} sem empresa`, icon: Users, href: `${MANAGE}/usuarios` },
            { label: "Marcas", value: brands, hint: "marcas ativas", icon: Tag, href: "/painel/marcas" },
            { label: "Produtos", value: stats.products, hint: `${stats.published} publicados · ${stats.drafts} rascunhos`, icon: Package, href: "/painel/produtos" },
            { label: "Manuais", value: stats.manuals, hint: "PDFs publicados", icon: FileText },
            { label: "QR Codes", value: stats.activeQr, hint: "QR Codes ativos", icon: QrCode },
            { label: "Chamados", value: openTickets, hint: "aguardando atendimento", icon: Headset, href: "/painel/suporte" },
            { label: "Conteúdo", value: `${stats.avgCompletion}%`, hint: "completude média", icon: Gauge },
          ]}
        />
      </section>

      <section className={styles["overview__block"]} aria-labelledby="usage-title">
        <h2 className={styles["overview__block-title"]} id="usage-title">Uso dos manuais · últimos {days} dias</h2>
        <UsageCards usage={usage} days={days} keys={["qrScans", "views", "manualViews", "downloads"]} />
      </section>

      <div className={styles["overview__columns"]}>
        <TopProducts items={top} days={days} />
        <section className={styles["panel-card"]} aria-labelledby="companies-title">
          <h2 className={styles["panel-card__title"]} id="companies-title">Empresas com mais produtos</h2>
          {companyRows.length ? (
            <ul className={styles["entity"]}>
              {companyRows.map((c) => (
                <li key={c.id} className={styles["entity__item"]}>
                  <Thumb src={c.logoUrl} icon={Building2} />
                  <span className={styles["entity__body"]}>
                    <Link className={styles["entity__name"]} href={`/painel/empresas/${c.id}`}>{c.name}</Link>
                    <span className={styles["entity__meta"]}>
                      {c._count.brands} {c._count.brands === 1 ? "marca" : "marcas"} · {c.products} {c.products === 1 ? "produto" : "produtos"} · {c._count.userCompanies} {c._count.userCompanies === 1 ? "usuário" : "usuários"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles["panel-card__empty"]}>Nenhuma empresa cadastrada ainda.</p>
          )}
        </section>
      </div>

      <div className={styles["overview__columns"]}>
        <ContentCoverage stats={stats} />
        <section className={styles["panel-card"]} aria-labelledby="new-users-title">
          <h2 className={styles["panel-card__title"]} id="new-users-title">Usuários mais recentes</h2>
          {newUsers.length ? (
            <ul className={styles["entity"]}>
              {newUsers.map((u) => (
                <li key={u.id} className={styles["entity__item"]}>
                  <Thumb src={null} icon={UserRound} />
                  <span className={styles["entity__body"]}>
                    <Link className={styles["entity__name"]} href={`${MANAGE}/usuarios/${u.id}`}>{u.firstName} {u.lastName}</Link>
                    <span className={styles["entity__meta"]}>
                      {u.email} · {u.userCompanies[0]?.company.name ?? "Sem empresa"} · desde {dateFormat.format(u.createdAt)}
                    </span>
                  </span>
                  <span className={`${styles["entity__status"]} ${u.isActive ? "" : styles["entity__status--off"]}`}>
                    {u.isActive ? "Ativo" : "Inativo"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles["panel-card__empty"]}>Nenhum usuário cadastrado ainda.</p>
          )}
        </section>
      </div>

      <ToComplete stats={stats} />
    </div>
  );
}
