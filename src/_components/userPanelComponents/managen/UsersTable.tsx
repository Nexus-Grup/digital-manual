import { User } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UserRowMenu } from "./UserRowMenu";
import styles from "@/_styles/cssUserPanelPage/UsersPage.module.css";

type SearchParams = Promise<{ q?: string; filter?: string; company?: string }>;

// Conta ligada ou desligada (isActive)
function statusOf(isActive: boolean) {
  return isActive
    ? { label: "Ativo", className: styles.active }
    : { label: "Inativo", className: styles.inactive };
}

// Cadastro concluído = já trocou a senha temporária (mustChangePassword = false)
function registrationOf(mustChangePassword: boolean) {
  return mustChangePassword
    ? { label: "Pendente", className: styles.pending }
    : { label: "Completo", className: styles.complete };
}

export async function UsersTable({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const q = sp.q?.trim() ?? "";
  const filter = sp.filter ?? "";
  const companyId = Number(sp.company);

  const conditions: Prisma.UserWhereInput[] = [];

  if (q) {
    conditions.push({
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { userName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (Number.isInteger(companyId) && companyId > 0) {
    conditions.push({ userCompanies: { some: { companyId } } });
  }
  if (filter === "active") conditions.push({ isActive: true });
  if (filter === "inactive") conditions.push({ isActive: false });
  if (filter === "pending") conditions.push({ mustChangePassword: true });
  if (filter === "complete") conditions.push({ mustChangePassword: false });
  if (filter === "unassigned") conditions.push({ userCompanies: { none: {} } });

  const users = await prisma.user.findMany({
    where: { AND: conditions },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isActive: true,
      systemRole: true,
      mustChangePassword: true,
      userCompanies: { select: { company: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (users.length === 0) {
    return <p className={styles.muted}>Nenhum usuário encontrado.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Usuários</th>
          <th className={styles.center}>Papel no sistema</th>
          <th className={styles.center}>Empresa</th>
          <th className={styles.center}>Status</th>
          <th className={styles.center}>Cadastro</th>
          <th className={styles.center}>Editar</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => {
          const role = u.systemRole;
          const status = statusOf(u.isActive);
          const registration = registrationOf(u.mustChangePassword);
          const names = u.userCompanies.map((uc) => uc.company.name);

          return (
            <tr key={u.id}>
              <td>
                <div className={styles.userCell}>
                  <span className={styles.avatar}>
                    <User size={14} aria-hidden />
                  </span>
                  <span className={styles.userText}>
                    <span className={styles.userName}>
                      {u.firstName} {u.lastName}
                    </span>
                    <span className={styles.userEmail}>{u.email}</span>
                  </span>
                </div>
              </td>
              <td className={styles.center}>
                <span className={styles.mutedText}>{role}</span>
              </td>
              <td className={styles.center}>
                {names.length === 0 ? (
                  <span className={styles.mutedText}>sem vínculo</span>
                ) : (
                  <>
                    {names[0]}
                    {names.length > 1 && (
                      <span className={styles.mutedText}> +{names.length - 1}</span>
                    )}
                  </>
                )}
              </td>
              <td className={styles.center}>
                <span className={`${styles.badge} ${status.className}`}>{status.label}</span>
              </td>
              <td className={styles.center}>
                <span className={`${styles.badge} ${registration.className}`}>
                  {registration.label}
                </span>
              </td>
              <td className={styles.center}>
                <UserRowMenu userId={u.id} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}