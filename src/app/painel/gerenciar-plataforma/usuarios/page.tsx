import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { UsersSelects, UsersSearch } from "@/_components/userPanelComponents/managen/UsersFilters";
import Link from "next/link";
import { Filter, Plus } from "lucide-react";
import { UsersStats } from "@/_components/userPanelComponents/managen/UsersStats";
import { UsersTable } from "@/_components/userPanelComponents/managen/UsersTable";
import styles from "@/_styles/cssUserPanelPage/UsersPage.module.css";

const NEW_USER_HREF = "/painel/gerenciar-plataforma/usuarios/novo";

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
        <Plus size={14} aria-hidden /> Criar usuário
      </Link>
    </div>
  );
}

export default function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Usuários da plataforma</h1>
      <p className={styles.subtitle}>Gerencie os perfis da sua plataforma.</p>

      <Suspense fallback={<div className={styles.toolbar} />}>
        <Toolbar />
      </Suspense>

      <Suspense fallback={<p className={styles.muted}>Carregando...</p>}>
        <UsersStats />
      </Suspense>

      <div className={styles.searchRow}>
        <Suspense fallback={null}>
          <UsersSearch />
        </Suspense>

        {/* TODO: filtros avançados (ainda sem ação) */}
        <button type="button" className={styles.filtersButton}>
          <Filter size={12} aria-hidden /> Filtros
        </button>
      </div>

      <h2 className={styles.sectionTitle}>Todos os usuários da plataforma</h2>

      <Suspense fallback={<p className={styles.muted}>Carregando usuários...</p>}>
        <UsersTable searchParams={searchParams} />
      </Suspense>
    </section>
  );
}