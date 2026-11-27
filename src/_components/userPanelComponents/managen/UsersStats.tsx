import { prisma } from "@/lib/prisma";
import styles from "@/_styles/cssUserPanelPage/UsersPage.module.css";

export async function UsersStats() {
  const [total, active, pending, unassigned] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { mustChangePassword: true } }),
    prisma.user.count({ where: { userCompanies: { none: {} } } }),
  ]);

  const cards = [
    { label: "Total de usuários", value: total },
    { label: "Usuários ativos", value: active },
    { label: "Cadastro pendente", value: pending },
    { label: "Sem responsável", value: unassigned },
  ];

  return (
    <dl className={styles.stats} aria-label="Resumo dos usuários">
      {cards.map((c) => (
        <div key={c.label} className={styles.stat}>
          <dt className={styles.statLabel}>{c.label}</dt>
          <dd className={styles.statValue}>{c.value}</dd>
        </div>
      ))}
    </dl>
  );
}