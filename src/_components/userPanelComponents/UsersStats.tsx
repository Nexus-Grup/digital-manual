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
    { label: "Total users", value: total },
    { label: "Active users", value: active },
    { label: "Pending registration", value: pending },
    { label: "Unassigned", value: unassigned },
  ];

  return (
    <div className={styles.stats}>
      {cards.map((c) => (
        <div key={c.label} className={styles.stat}>
          <span className={styles.statLabel}>{c.label}</span>
          <strong className={styles.statValue}>{c.value}</strong>
        </div>
      ))}
    </div>
  );
}