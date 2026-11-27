import type { Metadata } from "next";
import { Suspense } from "react";
import { Download, LayoutDashboard } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/Overview.module.css";
import { PanelEmptyState } from "@/_components/userPanelComponents/utils_panel/PanelEmptyState";
import { OverviewFilters } from "@/_components/userPanelComponents/overview/OverviewFilters";
import { UsageCards } from "@/_components/userPanelComponents/overview/OverviewCards";
import { UsageLineChart } from "@/_components/userPanelComponents/overview/UsageLineChart";
import { ProductBars } from "@/_components/userPanelComponents/overview/ProductBars";
import { getCurrentUser } from "@/lib/auth";
import { PERIODS, getDailyUsage, getTopProducts, getUsage, resolveScope, toPeriod } from "@/lib/panelOverview";

export const metadata: Metadata = { title: "Indicadores" };

type SearchParams = Promise<{ empresa?: string; marca?: string; periodo?: string }>;

// series of the daily chart: validated categorical order (--viz-1..4), dashes on the contrast themes
const SERIES = [
  { key: "qrScans", label: "Leituras de QR Code", color: "var(--viz-1)", dash: "var(--viz-dash-1)" },
  { key: "views", label: "Visualizações", color: "var(--viz-2)", dash: "var(--viz-dash-2)" },
  { key: "manualViews", label: "Acessos ao manual", color: "var(--viz-3)", dash: "var(--viz-dash-3)" },
  { key: "downloads", label: "Downloads do PDF", color: "var(--viz-4)", dash: "var(--viz-dash-4)" },
];

export default function IndicatorsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main id="conteudo" className={styles["overview"]}>
      <Suspense fallback={<p className={styles["overview__container"]}>Carregando os indicadores…</p>}>
        <Indicators searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

/** Usage of the digital manuals over time (QR scans, views, manual access, PDF downloads). */
async function Indicators({ searchParams }: { searchParams: SearchParams }) {
  const user = (await getCurrentUser())!;
  const params = await searchParams;
  const days = toPeriod(params.periodo);

  // no company picked = every company the person can see
  const resolved = await resolveScope(user, params, { allowAll: true });
  if (!resolved) {
    return (
      <PanelEmptyState
        icon={LayoutDashboard}
        title="Indicadores"
        text="Os indicadores mostram o uso dos manuais das empresas de que você faz parte. Você ainda não está em nenhuma."
        tag="Sem empresa"
        shortcuts={[{ href: "/painel/suporte/novo", label: "Pedir acesso ao suporte" }]}
      />
    );
  }

  const { companies, company, brands, brand, scope } = resolved;
  const [usage, daily, top] = await Promise.all([
    getUsage(scope, days),
    getDailyUsage(scope, days),
    getTopProducts(scope, days, 10),
  ]);

  const subject = brand ? `a marca ${brand.name}` : company ? company.name : companies.length > 1 ? "todas as empresas" : companies[0].name;

  const report = new URLSearchParams({ escopo: "empresa", periodo: String(days) });
  if (company) report.set("empresa", String(company.id));
  else report.set("todas", "1");
  if (brand) report.set("marca", String(brand.id));

  return (
    <div className={styles["overview__container"]}>
      <header className={styles["overview__header"]}>
        <div className={styles["overview__titles"]}>
          <h1 className={styles["overview__title"]}>Indicadores</h1>
          <p className={styles["overview__subtitle"]}>
            Como os manuais digitais de {subject} foram usados nos últimos {days} dias.
          </p>
        </div>
        <div className={styles["overview__actions"]}>
          <a className={styles["overview__action"]} href={`/api/painel/relatorio?${report}`} download>
            <Download size={16} aria-hidden /> Baixar relatório (CSV)
          </a>
        </div>
      </header>

      {/* date range first, then the dimensions: they scope everything below */}
      <OverviewFilters
        fields={[
          {
            name: "periodo",
            label: "Período",
            value: String(days),
            options: PERIODS.map((d) => ({ value: String(d), label: `Últimos ${d} dias` })),
          },
          ...(companies.length > 1
            ? [{
                name: "empresa",
                label: "Empresa",
                value: company ? String(company.id) : "",
                options: [{ value: "", label: "Todas as empresas" }, ...companies.map((c) => ({ value: String(c.id), label: c.name }))],
              }]
            : []),
          {
            name: "marca",
            label: "Marca",
            value: brand ? String(brand.id) : "",
            options: [{ value: "", label: "Todas as marcas" }, ...brands.map((b) => ({ value: String(b.id), label: b.name }))],
          },
        ]}
      />

      <section className={styles["overview__block"]} aria-labelledby="totals-title">
        <h2 className={styles["overview__block-title"]} id="totals-title">Totais do período</h2>
        <UsageCards usage={usage} days={days} keys={["qrScans", "views", "manualViews", "downloads"]} />
      </section>

      <UsageLineChart title={`Uso por dia · últimos ${days} dias`} rows={daily} series={SERIES} />

      <ProductBars
        title="Produtos mais acessados (visualizações + leituras de QR Code)"
        items={top}
        empty={`Ainda não há acessos nos últimos ${days} dias. Os números aparecem quando alguém escaneia um QR Code ou abre um manual publicado.`}
      />
    </div>
  );
}
