import Link from "next/link";
import styles from "@/_styles/cssUserPanelPage/support/AdminInbox.module.css";

type Props = { page: number; totalPages: number; hrefFor: (page: number) => string };

export function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav className={styles.pager} aria-label="Paginação">
      <Link href={hrefFor(page - 1)} className={styles.pageLink} aria-disabled={page <= 1}>Anterior</Link>
      <span>Página {page} de {totalPages}</span>
      <Link href={hrefFor(page + 1)} className={styles.pageLink} aria-disabled={page >= totalPages}>Próxima</Link>
    </nav>
  );
}
