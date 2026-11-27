"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import styles from "@/_styles/cssUserPanelPage/SettingsSidebar.module.css";

const BASE = "/painel";

const CONFIG = {
  company: {
    title: "Configurações da empresa",
    select: "Selecione a empresa",
    edit: "Editar empresa",
    create: "Nova empresa",
    base: `${BASE}/empresas`,
    param: "companyId", // nome da pasta dinâmica: companies/[companyId]
  },
  brand: {
    title: "Configurações da marca",
    select: "Selecione a marca",
    edit: "Editar marca",
    create: "Nova marca",
    base: `${BASE}/marcas`,
    param: "brandId", // brands/[brandId]
  },
} as const;

type Resource = keyof typeof CONFIG;

export type SettingsItem = {
  id: number;
  name: string;
  /** Só quem pode editar (ex.: OWNER da empresa) habilita o botão Edit */
  canEdit: boolean;
  /** Só nas marcas: a empresa a que a marca pertence */
  companyId?: number;
};

/** Empresa da lista do Brand Editor (todas as que o usuário faz parte) */
export type BrandCompany = {
  id: number;
  name: string;
  role: "ADMIN" | "OWNER" | "MANAGER" | "MEMBER";
  /** ADMIN e OWNER criam marca; MANAGER e MEMBER não */
  canCreateBrand: boolean;
};

type Props = {
  companies: SettingsItem[];
  brands: SettingsItem[];
  /** Empresas do usuário, para escolher antes de ver as marcas */
  brandCompanies: BrandCompany[];
  /** false para membro comum: a área de empresas não aparece */
  showCompanies: boolean;
  /** false para quem só é MEMBER: a área de marcas não aparece */
  showBrands: boolean;
};

/** Descobre em qual das duas áreas a rota atual está (ou nenhuma). */
function resourceFromPath(pathname: string): Resource | null {
  for (const key of Object.keys(CONFIG) as Resource[]) {
    const base = CONFIG[key].base;
    if (pathname === base || pathname.startsWith(`${base}/`)) return key;
  }
  return null;
}

export function SettingsSidebar({
  companies,
  brands,
  brandCompanies,
  showCompanies,
  showBrands,
}: Props) {
  const uid = useId();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<Record<string, string | undefined>>();
  // empresa escolhida no Brand Editor (quando ainda não há marca selecionada)
  const [pickedCompany, setPickedCompany] = useState("");

  const resource = resourceFromPath(pathname);

  // Fora de /companies e /brands a sidebar não aparece
  if (!resource) return null;

  // Membro comum não vê nada de empresas, nem de marcas
  if (resource === "company" && !showCompanies) return null;
  if (resource === "brand" && !showBrands) return null;

  const cfg = CONFIG[resource];
  const isBrand = resource === "brand";

  // O item selecionado vem da rota: /brands/12/edit -> "12"
  const selectedId = params[cfg.param] ?? "";
  const selected = (isBrand ? brands : companies).find((i) => String(i.id) === selectedId);

  // Empresa atual: a da marca aberta; senão a que o usuário escolheu; senão a única que ele tem
  const companyId = isBrand
    ? selected?.companyId
      ? String(selected.companyId)
      : pickedCompany || (brandCompanies.length === 1 ? String(brandCompanies[0].id) : "")
    : "";

  const items = isBrand ? brands.filter((b) => String(b.companyId) === companyId) : companies;
  const currentCompany = brandCompanies.find((c) => String(c.id) === companyId);

  // New brand: só ADMIN/OWNER, e só com uma empresa escolhida. Empresas e o resto seguem livres.
  const canCreate = isBrand ? !!currentCompany?.canCreateBrand : true;
  const newPath = `${cfg.base}/nova`; // marcas/nova, empresas/nova
  
  const newHref = newPath;
  const editHref = selected ? `${cfg.base}/${selected.id}/editar` : null;

  const isNew = pathname === newPath;
  const isEdit = !!editHref && pathname === editHref;

  function onSelectCompany(e: React.ChangeEvent<HTMLSelectElement>) {
    setPickedCompany(e.target.value);
    router.push(cfg.base); // volta à lista: a marca aberta era de outra empresa
  }

  function onSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    if (!id) {
      router.push(cfg.base);
      return;
    }
    // Se estiver na tela de edição, continua nela ao trocar de item
    const suffix = pathname.endsWith("/editar") ? "/editar" : "";
    router.push(`${cfg.base}/${id}${suffix}`);
  }

  const createHint = !companyId ? "Selecione uma empresa para criar uma marca." : "Só proprietários da empresa podem criar marcas.";
  const editHint = selected ? "Você não tem permissão para editar." : `${cfg.select} para editar.`;

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>{cfg.title}</header>

      <nav className={styles.nav} aria-label={cfg.title}>
        {isBrand && (
          <select
            className={styles.select}
            aria-label="Selecione a empresa"
            value={companyId}
            onChange={onSelectCompany}
          >
            <option value="">Selecione a empresa</option>
            {brandCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        <select
          className={styles.select}
          aria-label={cfg.select}
          value={selectedId}
          onChange={onSelect}
          disabled={isBrand && !companyId}
        >
          <option value="">
            {isBrand && companyId && items.length === 0 ? "Nenhuma marca nesta empresa" : cfg.select}
          </option>
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
          <>
            <button
              type="button"
              className={styles.item}
              disabled
              aria-describedby={`${uid}-edit-hint`}
            >
              <Pencil size={14} aria-hidden />
              <span>{cfg.edit}</span>
            </button>
            <p id={`${uid}-edit-hint`} className={styles.hint}>{editHint}</p>
          </>
        )}

        {canCreate ? (
          <Link
            href={newHref}
            className={`${styles.item} ${isNew ? styles.active : ""}`}
            aria-current={isNew ? "page" : undefined}
          >
            <Plus size={14} aria-hidden />
            <span>{cfg.create}</span>
          </Link>
        ) : (
          <>
            <button type="button" className={styles.item} disabled aria-describedby={`${uid}-create-hint`}>
              <Plus size={14} aria-hidden />
              <span>{cfg.create}</span>
            </button>
            <p id={`${uid}-create-hint`} className={styles.hint}>{createHint}</p>
          </>
        )}
      </nav>
    </aside>
  );
}