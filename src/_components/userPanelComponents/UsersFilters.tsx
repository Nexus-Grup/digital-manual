"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/UsersPage.module.css";


type CompanyOption = { id: number; name: string };

function useSetParam() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };
}

export function UsersSelects({ companies }: { companies: CompanyOption[] }) {
  const params = useSearchParams();
  const setParam = useSetParam();

  return (
    <div className={styles.selects}>
      <select
        className={styles.select}
        aria-label="Filter users"
        value={params.get("filter") ?? ""}
        onChange={(e) => setParam("filter", e.target.value)}
      >
        <option value="">All Users</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending registration</option>
        <option value="complete">Registration complete</option>
        <option value="unassigned">Unassigned</option>
      </select>

      <select
        className={styles.select}
        aria-label="Filter by company"
        value={params.get("company") ?? ""}
        onChange={(e) => setParam("company", e.target.value)}
      >
        <option value="">All Companies</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function UsersSearch() {
  const params = useSearchParams();
  const setParam = useSetParam();
  const urlValue = params.get("q") ?? "";
  const [value, setValue] = useState(urlValue);

  // Espera 350 ms depois de parar de digitar para buscar
  useEffect(() => {
    if (value === urlValue) return;
    const t = setTimeout(() => setParam("q", value.trim()), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <label className={styles.search}>
      <Search size={13} aria-hidden />
      <input
        type="search"
        placeholder="Search name or email..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}