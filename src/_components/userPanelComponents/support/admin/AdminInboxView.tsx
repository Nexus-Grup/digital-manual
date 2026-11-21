import { ADMIN_SUPPORT_BASE } from "@/lib/support/constants";
import { getAdminInbox, parseAdminFilters } from "@/lib/support/adminQueries";
import { withParams } from "@/lib/support/url";
import { AdminTicketsTable } from "@/_components/userPanelComponents/support/admin/AdminTicketsTable";
import { InboxChips } from "@/_components/userPanelComponents/support/admin/InboxChips";
import { InboxSelects } from "@/_components/userPanelComponents/support/admin/InboxSelects";
import { Pagination } from "@/_components/userPanelComponents/support/admin/Pagination";
import styles from "@/_styles/cssUserPanelPage/support/AdminInbox.module.css";
import page from "@/_styles/cssUserPanelPage/support/supportPage.module.css";

export async function AdminInboxView({
  adminId,
  searchParams,
}: {
  adminId: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseAdminFilters(searchParams);
  const inbox = await getAdminInbox(adminId, filters);

  const current = {
    view: filters.view === "all" ? undefined : filters.view,
    company: filters.companyId ? String(filters.companyId) : undefined,
    brand: filters.brandId ? String(filters.brandId) : undefined,
    priority: filters.priority ?? undefined,
  };
  const totalPages = Math.max(1, Math.ceil(inbox.total / inbox.pageSize));

  return (
    <section className={page.page}>
      <header className={page.header}>
        <div>
          <h1 className={page.title}>Support inbox</h1>
          <p className={page.subtitle}>All tickets from users and companies.</p>
        </div>
      </header>
      <div className={styles.toolbar}>
        <InboxChips view={filters.view} counts={inbox.counts} current={current} />
        <InboxSelects companies={inbox.companies} brands={inbox.brands} />
      </div>
      <AdminTicketsTable items={inbox.items} />
      <Pagination
        page={inbox.page}
        totalPages={totalPages}
        hrefFor={(p) => withParams(ADMIN_SUPPORT_BASE, current, { page: p > 1 ? String(p) : undefined })}
      />
    </section>
  );
}
