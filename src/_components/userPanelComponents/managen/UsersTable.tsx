import Link from "next/link";
import { Pencil, User } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import styles from "@/_styles/cssUserPanelPage/UsersPage.module.css";

type SearchParams = Promise<{ q?: string; filter?: string; company?: string }>;

const ROLE_LABEL: Record<string, string> = { ADMIN: "Administrador", USER: "Usuário" };

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

  const filtered = !!(q || filter || sp.company);
  // announced to screen readers when the search or a filter changes the list (WCAG 4.1.3)
  const summary =
    users.length === 0
      ? "Nenhum usuário encontrado."
      : `${users.length === 50 ? "Mostrando os 50 mais recentes" : `${users.length} ${users.length === 1 ? "usuário" : "usuários"}`}${filtered ? " com os filtros atuais" : ""}.`;

  if (users.length === 0) {
    return (
      <p className={styles.muted} role="status">
        {summary}
      </p>
    );
  }

  return (
    <>
      <p className={styles.muted} role="status">
        {summary}
      </p>
      <div className={styles.tableWrap} role="region" aria-label="Tabela de usuários" tabIndex={0}>
    <table className={styles.table}>
      <caption className={styles.srOnly}>Usuários da plataforma</caption>
      <thead>
        <tr>
          <th scope="col" className={styles.th}>Usuário</th>
          <th scope="col" className={`${styles.th} ${styles.center} ${styles.colRole}`}>Papel no sistema</th>
          <th scope="col" className={`${styles.th} ${styles.center}`}>Empresa</th>
          <th scope="col" className={`${styles.th} ${styles.center}`}>Status</th>
          <th scope="col" className={`${styles.th} ${styles.center}`}>Cadastro</th>
          <th scope="col" className={`${styles.th} ${styles.center}`}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => {
          const role = u.systemRole;
          const status = statusOf(u.isActive);
          const registration = registrationOf(u.mustChangePassword);
          const names = u.userCompanies.map((uc) => uc.company.name);
          const fullName = `${u.firstName} ${u.lastName}`;

          return (
            <tr key={u.id} className={styles.row}>
              <th scope="row" className={`${styles.th} ${styles.rowHeader}`}>
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
              </th>
              <td className={`${styles.td} ${styles.center} ${styles.colRole}`}>
                <span className={styles.mutedText}>{ROLE_LABEL[role] ?? role}</span>
              </td>
              <td className={`${styles.td} ${styles.center}`}>
                {names.length === 0 ? (
                  <span className={styles.mutedText}>sem vínculo</span>
                ) : (
                  <>
                    {names[0]}
                    {names.length > 1 && (
                      <span className={styles.mutedText} title={names.slice(1).join(", ")}>
                        {" "}+{names.length - 1}
                        <span className={styles.srOnly}> {names.length - 1 === 1 ? "outra empresa" : "outras empresas"}: {names.slice(1).join(", ")}</span>
                      </span>
                    )}
                  </>
                )}
              </td>
              <td className={`${styles.td} ${styles.center}`}>
                <span className={`${styles.badge} ${status.className}`}>{status.label}</span>
              </td>
              <td className={`${styles.td} ${styles.center}`}>
                <span className={`${styles.badge} ${registration.className}`}>
                  {registration.label}
                </span>
              </td>
              <td className={`${styles.td} ${styles.center}`}>
                <Link
                  href={`/painel/gerenciar-plataforma/usuarios/${u.id}/editar`}
                  className={styles.editLink}
                  aria-label={`Editar ${fullName}`}
                >
                  <Pencil size={14} aria-hidden /> Editar
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
      </div>
    </>
  );
}