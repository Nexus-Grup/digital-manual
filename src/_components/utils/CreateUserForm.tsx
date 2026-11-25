"use client";

import { useState, type FormEvent } from "react";
import { Building2, ChevronDown, Info, User, UserPlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import styles from "@/_styles/utils/CreateUserForm.module.css";

/** Espelham os enums do Prisma (não importar @prisma/client em Client Component). */
export type GlobalRole = "USER" | "ADMIN";
export type CompanyRole = "MEMBER" | "OWNER" | "MANAGER";

type BaseValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export type AdminCreateUserValues = BaseValues & { role: GlobalRole };
export type CompanyCreateUserValues = BaseValues & {
  companyRole: CompanyRole;
  companyId: number;
};

export type CompanyOption = { id: number; name: string };

type CommonProps = {
  onCancel: () => void;
  loading?: boolean;
};

type AdminProps = CommonProps & {
  variant: "admin";
  onSubmit: (values: AdminCreateUserValues) => void | Promise<void>;
};

type CompanyProps = CommonProps & {
  variant: "company";
  /** Empresas onde o usuário logado é OWNER (opções do dropdown) */
  companies: CompanyOption[];
  /** Empresa atual/selecionada por padrão (recebe o badge "Current company") */
  defaultCompanyId?: number;
  onSubmit: (values: CompanyCreateUserValues) => void | Promise<void>;
};

export type CreateUserFormProps = AdminProps | CompanyProps;

const GLOBAL_ROLES: { value: GlobalRole; description: string }[] = [
  { value: "USER", description: "Standard platform account. No global administration access." },
  { value: "ADMIN", description: "Full platform administration access." },
];

const COMPANY_ROLES: { value: CompanyRole; label: string }[] = [
  { value: "OWNER", label: "Owner" },
  { value: "MANAGER", label: "Manager"},
  { value: "MEMBER", label: "Member" },
];

function generatePassword(length = 14) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function CreateUserForm(props: CreateUserFormProps) {
  const { variant, onCancel, loading = false } = props;

  const [values, setValues] = useState<BaseValues>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState<GlobalRole>("USER");
  const [companyRole, setCompanyRole] = useState<CompanyRole>("MEMBER");
  const [companyId, setCompanyId] = useState<number | "">(
    props.variant === "company"
      ? props.defaultCompanyId ?? props.companies[0]?.id ?? ""
      : ""
  );

  const set =
    (field: keyof BaseValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      if (props.variant === "admin") {
        await props.onSubmit({ ...values, role });
      } else {
        if (companyId === "") {
          toast.error("Select a company.");
          return;
        }
        await props.onSubmit({ ...values, companyRole, companyId });
      }
    } catch (err) {
      // quem chama o formulário normalmente mostra o próprio toast de erro;
      // este cobre o caso em que o onSubmit lança uma exceção
      toast.error(err instanceof Error ? err.message : "Could not create the user. Try again.");
    }
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <header className={styles.header}>
        <h2 className={styles.title}>Create user</h2>
        <p className={styles.subtitle}>
          {variant === "admin" ? "Register a new user." : "Register a new company user."}
        </p>
      </header>

      <div className={styles.body}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="firstName">First name*</label>
            <input
              id="firstName"
              className={styles.input}
              placeholder="First name"
              value={values.firstName}
              onChange={set("firstName")}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="lastName">Last name*</label>
            <input
              id="lastName"
              className={styles.input}
              placeholder="Last name"
              value={values.lastName}
              onChange={set("lastName")}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="username">Username*</label>
          <input
            id="username"
            className={styles.input}
            placeholder="e.g. john.smith"
            value={values.username}
            onChange={set("username")}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email address*</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="user@company.com"
            value={values.email}
            onChange={set("email")}
            required
          />
        </div>

        {/* ---------- Variante ADMIN: role global ---------- */}
        {props.variant === "admin" && (
          <fieldset className={styles.fieldset}>
            <legend>Access</legend>
            <div className={styles.accessList}>
              {GLOBAL_ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`${styles.accessCard} ${role === r.value ? styles.accessCardActive : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    className={styles.srOnly}
                  />
                  <span className={styles.accessTop}>
                    {r.value === "ADMIN" ? (
                      <ShieldCheck size={14} aria-hidden />
                    ) : (
                      <User size={14} aria-hidden />
                    )}
                    <span className={styles.accessName}>{r.value}</span>
                    {r.value === "USER" && (
                      <span className={`${styles.badge} ${styles.badgeGreen}`}>Default</span>
                    )}
                  </span>
                  <span className={styles.accessDesc}>{r.description}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* ---------- Variante COMPANY: empresa fixa + role na empresa ---------- */}
        {props.variant === "company" && (
          <>
            <div className={styles.field}>
              <label htmlFor="companyId">Company Access</label>
              <div className={styles.companySelect}>
                <Building2 size={14} aria-hidden />
                <select
                  id="companyId"
                  className={styles.companyNative}
                  value={companyId}
                  onChange={(e) => setCompanyId(Number(e.target.value))}
                  required
                >
                  {props.companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {companyId === props.defaultCompanyId && (
                  <span className={`${styles.badge} ${styles.badgeGray}`}>Current company</span>
                )}
                {/* <ChevronDown size={16} aria-hidden /> */}
              </div>
            </div>

            <fieldset className={styles.fieldset}>
              <legend>Change user role*</legend>
              <div className={styles.radioList}>
                {COMPANY_ROLES.map((r) => (
                  <label key={r.value} className={styles.radio}>
                    <input
                      type="radio"
                      name="companyRole"
                      value={r.value}
                      checked={companyRole === r.value}
                      onChange={() => setCompanyRole(r.value)}
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {/* ---------- Senha temporária ---------- */}
        <div className={styles.field}>
          <label htmlFor="password">Temporary password *</label>
          <div className={styles.passwordWrap}>
            <input
              id="password"
              className={`${styles.input} ${styles.passwordInput}`}
              placeholder="Temporary password"
              value={values.password}
              onChange={set("password")}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className={styles.generate}
              onClick={() => setValues((v) => ({ ...v, password: generatePassword() }))}
            >
              to generate
            </button>
          </div>
          <p className={styles.hint}>
            <Info size={11} aria-hidden /> User must change password on first login.
          </p>
        </div>

        {props.variant === "admin" && (
          <div className={styles.noCompany}>
            <span className={styles.noCompanyTitle}>
              <Building2 size={13} aria-hidden /> No company assigned
            </span>
            <span className={styles.noCompanyDesc}>
              You can associate this user with a company later.
            </span>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.btn} onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className={styles.btn} disabled={loading}>
          <UserPlus size={15} aria-hidden />
          {loading ? "Creating..." : "Create user"}
        </button>
      </footer>
    </form>
  );
}