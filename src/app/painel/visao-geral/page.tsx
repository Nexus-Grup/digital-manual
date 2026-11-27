import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, Download, FileText, Gauge, Home, Package, Plus, QrCode, Tag, Users } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/Overview.module.css";
import { PanelEmptyState } from "@/_components/userPanelComponents/utils_panel/PanelEmptyState";
import { OverviewFilters } from "@/_components/userPanelComponents/overview/OverviewFilters";
import {
  ContentCoverage, StatCards, Thumb, ToComplete, TopProducts, UsageCards,
} from "@/_components/userPanelComponents/overview/OverviewCards";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessCompanyArea } from "@/lib/companyAccess";
import { PERIODS, getCatalogStats, getTopProducts, getUsage, resolveScope, toPeriod } from "@/lib/panelOverview";

export const metadata: Metadata = { title: "Visão geral da empresa" };

type SearchParams = Promise<{ empresa?: string; marca?: string; periodo?: string }>;

// only public Supabase Storage URLs go through next/image (next.config remotePatterns)
const optimizable = (src: string) => /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(src);

export default function CompanyOverviewPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main id="conteudo" className={styles["overview"]}>
      <Suspense fallback={<p className={styles["overview__container"]}>Carregando a visão geral…</p>}>
        <CompanyOverview searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

/**
 * Client home: the numbers of one company the person belongs to (brands, products, content, usage),
 * limited to the brands they can see. Admins can open any company.
 */
async function CompanyOverview({ searchParams }: { searchParams: SearchParams }) {
  const user = (await getCurrentUser())!;
  const params = await searchParams;
  const days = toPeriod(params.periodo);

  const resolved = await resolveScope(user, params);

  if (!resolved) {
    const canCreate = await canAccessCompanyArea(user);
    return (
      <PanelEmptyState
        icon={Home}
        title="Visão geral da empresa"
        text="Você ainda não faz parte de nenhuma empresa. Quando for adicionado a uma, os números das marcas e dos produtos dela aparecem aqui."
        tag="Sem empresa"
        shortcuts={canCreate ? [{ href: "/painel/empresas/nova", label: "Cadastrar uma empresa" }] : [{ href: "/painel/suporte/novo", label: "Pedir acesso ao suporte" }]}
      />
    );
  }

  const { companies, brands, brand, scope } = resolved;
  const company = resolved.company!;

  const [stats, usage, top, members] = await Promise.all([
    getCatalogStats(scope),
    getUsage(scope, days),
    getTopProducts(scope, days),
    prisma.userCompany.count({ where: { companyId: company.id, user: { isActive: true } } }),
  ]);

  const report = new URLSearchParams({ escopo: "empresa", empresa: String(company.id), periodo: String(days) });
  if (brand) report.set("marca", String(brand.id));

  const firstName = user.firstName.split(" ")[0];

  return (
    <div className={styles["overview__container"]}>
      <header className={styles["overview__header"]}>
        <div className={styles["overview__heading"]}>
          {company.logoUrl ? (
            <span className={styles["overview__logo"]}>
              {optimizable(company.logoUrl) ? (
                <Image className={styles["overview__logo-image"]} src={company.logoUrl} alt="" fill sizes="56px" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles["overview__logo-image"]} src={company.logoUrl} alt="" />
              )}
            </span>
          ) : null}
          <div className={styles["overview__titles"]}>
            <h1 className={styles["overview__title"]}>{company.name}</h1>
            <p className={styles["overview__subtitle"]}>
              Olá, {firstName}! Este é o resumo {brand ? `da marca ${brand.name}` : "das suas marcas"} nos últimos {days} dias.
            </p>
          </div>
        </div>
        <div className={styles["overview__actions"]}>
          <Link className={`${styles["overview__action"]} ${styles["overview__action--primary"]}`} href="/painel/produtos/novo">
            <Plus size={16} aria-hidden /> Novo produto
          </Link>
          <Link className={styles["overview__action"]} href="/painel/produtos">Ver produtos</Link>
          <a className={styles["overview__action"]} href={`/api/painel/relatorio?${report}`} download>
            <Download size={16} aria-hidden /> Baixar relatório (CSV)
          </a>
        </div>
      </header>

      <OverviewFilters
        fields={[
          ...(companies.length > 1
            ? [{ name: "empresa", label: "Empresa", value: String(company.id), options: companies.map((c) => ({ value: String(c.id), label: c.name })) }]
            : []),
          {
            name: "marca",
            label: "Marca",
            value: brand ? String(brand.id) : "",
            options: [{ value: "", label: "Todas as marcas" }, ...brands.map((b) => ({ value: String(b.id), label: b.name }))],
          },
          {
            name: "periodo",
            label: "Período",
            value: String(days),
            options: PERIODS.map((d) => ({ value: String(d), label: `Últimos ${d} dias` })),
          },
        ]}
      />

      <section className={styles["overview__block"]} aria-labelledby="catalog-title">
        <h2 className={styles["overview__block-title"]} id="catalog-title">Catálogo</h2>
        <StatCards
          label="Números do catálogo"
          items={[
            { label: "Marcas", value: brand ? 1 : brands.length, hint: "marcas cadastradas", icon: Tag, href: "/painel/marcas" },
            { label: "Produtos", value: stats.products, hint: `${stats.published} publicados · ${stats.drafts} rascunhos`, icon: Package, href: "/painel/produtos" },
            { label: "Manuais", value: stats.manuals, hint: "PDFs publicados", icon: FileText },
            { label: "QR Codes", value: stats.activeQr, hint: "QR Codes ativos", icon: QrCode },
            { label: "Usuários", value: members, hint: "pessoas na empresa", icon: Users },
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
        <section className={styles["panel-card"]} aria-labelledby="brands-title">
          <h2 className={styles["panel-card__title"]} id="brands-title">Marcas</h2>
          {brands.length ? (
            <ul className={styles["entity"]}>
              {brands.map((b) => (
                <li key={b.id} className={styles["entity__item"]}>
                  <Thumb src={b.imgUrl} icon={Building2} />
                  <span className={styles["entity__body"]}>
                    <Link className={styles["entity__name"]} href={`/painel/marcas/${b.id}`}>{b.name}</Link>
                    <span className={styles["entity__meta"]}>
                      {b.products} {b.products === 1 ? "produto" : "produtos"}
                    </span>
                  </span>
                  <span className={`${styles["entity__status"]} ${b.isActive ? "" : styles["entity__status--off"]}`}>
                    {b.isActive ? "Ativa" : "Inativa"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles["panel-card__empty"]}>Nenhuma marca visível para você nesta empresa.</p>
          )}
        </section>
      </div>

      <div className={styles["overview__columns"]}>
        <ContentCoverage stats={stats} />
        <ToComplete stats={stats} />
      </div>
    </div>
  );
}
