"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PRIORITY_OPTIONS } from "@/lib/support/constants";
import styles from "@/_styles/cssUserPanelPage/support/AdminInbox.module.css";

type Props = {
  companies: { id: number; name: string }[];
  brands: { id: number; name: string; companyId: number }[];
};

export function InboxSelects({ companies, brands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const company = sp.get("company") ?? "";
  const brand = sp.get("brand") ?? "";
  const priority = sp.get("priority") ?? "";
  const visibleBrands = company ? brands.filter((b) => String(b.companyId) === company) : brands;

  function set(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "company") next.delete("brand");
    next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className={styles.selects}>
      <select className={styles.select} aria-label="Filtrar por empresa" value={company} onChange={(e) => set("company", e.target.value)}>
        <option value="">Todas as empresas</option>
        {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select className={styles.select} aria-label="Filtrar por marca" value={brand} onChange={(e) => set("brand", e.target.value)}>
        <option value="">Todas as marcas</option>
        {visibleBrands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>
      <select className={styles.select} aria-label="Filtrar por prioridade" value={priority} onChange={(e) => set("priority", e.target.value)}>
        <option value="">Qualquer prioridade</option>
        {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
