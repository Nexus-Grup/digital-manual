import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { UsersSelects, UsersSearch } from "@/_components/userPanelComponents/UsersFilters";
import Link from "next/link";
import { Filter, Plus } from "lucide-react";
import { UsersStats } from "@/_components/userPanelComponents/UsersStats";
import { UsersTable } from "@/_components/userPanelComponents/UsersTable";
import styles from "@/_styles/cssUserPanelPage/UsersPage.module.css";

const NEW_USER_HREF = "/user-panel/manage-platform/users/new";

type SearchParams = Promise<{ q?: string; filter?: string; company?: string }>;

// Busca as empresas para o dropdown (fica dentro de Suspense)
async function Toolbar() {
  const companies = await prisma.company.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.toolbar}>
      <UsersSelects companies={companies} />
      <Link href={NEW_USER_HREF} className={styles.createButton}>
        <Plus size={14} aria-hidden /> Create user
      </Link>
    </div>
  );
}

export default function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Platform Users</h1>
      <p className={styles.subtitle}>Manage the profiles on your platform.</p>

      <Suspense fallback={<div className={styles.toolbar} />}>
        <Toolbar />
      </Suspense>

      <Suspense fallback={<p className={styles.muted}>Loading...</p>}>
        <UsersStats />
      </Suspense>

      <div className={styles.searchRow}>
        <Suspense fallback={null}>
          <UsersSearch />
        </Suspense>

        {/* TODO: filtros avançados (ainda sem ação) */}
        <button type="button" className={styles.filtersButton}>
          <Filter size={12} aria-hidden /> Filters
        </button>
      </div>

      <h2 className={styles.sectionTitle}>All platform users</h2>

      <Suspense fallback={<p className={styles.muted}>Loading users...</p>}>
        <UsersTable searchParams={searchParams} />
      </Suspense>
    </section>
  );
}