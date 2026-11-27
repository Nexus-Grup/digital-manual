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
        aria-label="Filtrar usuários"
        value={params.get("filter") ?? ""}
        onChange={(e) => setParam("filter", e.target.value)}
      >
        <option value="">Todos os usuários</option>
        <option value="active">Ativo</option>
        <option value="inactive">Inativo</option>
        <option value="pending">Cadastro pendente</option>
        <option value="complete">Cadastro completo</option>
        <option value="unassigned">Sem responsável</option>
      </select>

      <select
        className={styles.select}
        aria-label="Filtrar por empresa"
        value={params.get("company") ?? ""}
        onChange={(e) => setParam("company", e.target.value)}
      >
        <option value="">Todas as empresas</option>
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
        placeholder="Buscar nome ou e-mail..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}