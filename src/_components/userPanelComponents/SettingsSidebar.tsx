"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/SettingsSidebar.module.css";

const BASE = "/user-panel";

const CONFIG = {
  company: {
    title: "Company Settings",
    select: "Select company",
    edit: "Edit company",
    create: "New company",
    base: `${BASE}/companies`,
    param: "companyId", // nome da pasta dinâmica: companies/[companyId]
  },
  brand: {
    title: "Brand Settings",
    select: "Select brand",
    edit: "Edit brand",
    create: "New brand",
    base: `${BASE}/brands`,
    param: "brandId", // brands/[brandId]
  },
} as const;

type Resource = keyof typeof CONFIG;

export type SettingsItem = {
  id: number;
  name: string;
  /** Só quem pode editar (ex.: OWNER da empresa) habilita o botão Edit */
  canEdit: boolean;
};

type Props = {
  companies: SettingsItem[];
  brands: SettingsItem[];
  /** false para membro comum: a área de empresas não aparece */
  showCompanies: boolean;
};

/** Descobre em qual das duas áreas a rota atual está (ou nenhuma). */
function resourceFromPath(pathname: string): Resource | null {
  for (const key of Object.keys(CONFIG) as Resource[]) {
    const base = CONFIG[key].base;
    if (pathname === base || pathname.startsWith(`${base}/`)) return key;
  }
  return null;
}

export function SettingsSidebar({ companies, brands, showCompanies }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<Record<string, string | undefined>>();

  const resource = resourceFromPath(pathname);

  // Fora de /companies e /brands a sidebar não aparece
  if (!resource) return null;

  // Membro comum não vê nada de empresas
  if (resource === "company" && !showCompanies) return null;

  const cfg = CONFIG[resource];
  const items = resource === "company" ? companies : brands;

  // O item selecionado vem da rota: /companies/12/edit -> "12"
  const selectedId = params[cfg.param] ?? "";
  const selected = items.find((i) => String(i.id) === selectedId);

  const newHref = `${cfg.base}/new`;
  const editHref = selected ? `${cfg.base}/${selected.id}/edit` : null;

  const isNew = pathname === newHref;
  const isEdit = !!editHref && pathname === editHref;

  function onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    if (!id) {
      router.push(cfg.base);
      return;
    }
    // Se estiver na tela de edição, continua nela ao trocar de item
    const suffix = pathname.endsWith("/edit") ? "/edit" : "";
    router.push(`${cfg.base}/${id}${suffix}`);
  }

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>{cfg.title}</header>

      <nav className={styles.nav} aria-label={cfg.title}>
        <select
          className={styles.select}
          aria-label={cfg.select}
          value={selectedId}
          onChange={onSelect}
        >
          <option value="">{cfg.select}</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        {editHref && selected?.canEdit ? (
          <Link
            href={editHref}
            className={`${styles.item} ${isEdit ? styles.active : ""}`}
            aria-current={isEdit ? "page" : undefined}
          >
            <Pencil size={14} aria-hidden />
            <span>{cfg.edit}</span>
          </Link>
        ) : (
          <button
            type="button"
            className={styles.item}
            disabled
            title={selected ? "Only owners can edit" : cfg.select}
          >
            <Pencil size={14} aria-hidden />
            <span>{cfg.edit}</span>
          </button>
        )}

        <Link
          href={newHref}
          className={`${styles.item} ${isNew ? styles.active : ""}`}
          aria-current={isNew ? "page" : undefined}
        >
          <Plus size={14} aria-hidden />
          <span>{cfg.create}</span>
        </Link>
      </nav>
    </aside>
  );
}