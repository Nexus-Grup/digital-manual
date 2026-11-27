"use client";

import { useId, useState, type FormEvent } from "react";
import { Building2, Info, User, UserPlus, ShieldCheck } from "lucide-react";
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
  /** Empresa atual/selecionada por padrão (recebe o badge "Empresa atual") */
  defaultCompanyId?: number;
  onSubmit: (values: CompanyCreateUserValues) => void | Promise<void>;
};

export type CreateUserFormProps = AdminProps | CompanyProps;

const GLOBAL_ROLES: { value: GlobalRole; label: string; description: string }[] = [
  { value: "USER", label: "Usuário", description: "Conta padrão da plataforma, sem acesso à administração geral." },
  { value: "ADMIN", label: "Administrador", description: "Acesso total à administração da plataforma." },
];

const COMPANY_ROLES: { value: CompanyRole; label: string }[] = [
  { value: "OWNER", label: "Proprietário" },
  { value: "MANAGER", label: "Gerente"},
  { value: "MEMBER", label: "Membro" },
];

function generatePassword(length = 14) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function CreateUserForm(props: CreateUserFormProps) {
  const { variant, onCancel, loading = false } = props;
  const uid = useId();

  const [values, setValues] = useState<BaseValues>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState<GlobalRole>("USER");
  const [generated, setGenerated] = useState(false);
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
          toast.error("Selecione uma empresa.");
          return;
        }
        await props.onSubmit({ ...values, companyRole, companyId });
      }
    } catch (err) {
      // quem chama o formulário normalmente mostra o próprio toast de erro;
      // este cobre o caso em que o onSubmit lança uma exceção
      toast.error(err instanceof Error ? err.message : "Não foi possível criar o usuário. Tente de novo.");
    }
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit} aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-required`}>
      <header className={styles.header}>
        <h2 id={`${uid}-title`} className={styles.title}>Criar usuário</h2>
        <p className={styles.subtitle}>
          {variant === "admin" ? "Cadastre um novo usuário." : "Cadastre um novo usuário da empresa."}
        </p>
      </header>

      <div className={styles.body}>
        <p id={`${uid}-required`} className={styles.hint}>Campos com * são obrigatórios.</p>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor={`${uid}-firstName`}>Nome *</label>
            <input
              id={`${uid}-firstName`}
              className={styles.input}
              placeholder="Nome"
              value={values.firstName}
              onChange={set("firstName")}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${uid}-lastName`}>Sobrenome *</label>
            <input
              id={`${uid}-lastName`}
              className={styles.input}
              placeholder="Sobrenome"
              value={values.lastName}
              onChange={set("lastName")}
              autoComplete="off"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor={`${uid}-username`}>Nome de usuário *</label>
          <input
            id={`${uid}-username`}
            className={styles.input}
            placeholder="ex.: joao.silva"
            value={values.username}
            onChange={set("username")}
            autoComplete="off"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${uid}-email`}>E-mail *</label>
          <input
            id={`${uid}-email`}
            type="email"
            className={styles.input}
            placeholder="usuario@empresa.com"
            value={values.email}
            onChange={set("email")}
            autoComplete="off"
            required
          />
        </div>

        {/* ---------- Variante ADMIN: role global ---------- */}
        {props.variant === "admin" && (
          <fieldset className={styles.fieldset}>
            <legend>Acesso na plataforma *</legend>
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
                    aria-describedby={`${uid}-role-${r.value}`}
                    className={styles.srOnly}
                  />
                  <span className={styles.accessTop}>
                    {r.value === "ADMIN" ? (
                      <ShieldCheck size={14} aria-hidden />
                    ) : (
                      <User size={14} aria-hidden />
                    )}
                    <span className={styles.accessName}>{r.label}</span>
                    {r.value === "USER" && (
                      <span className={`${styles.badge} ${styles.badgeGreen}`}>Padrão</span>
                    )}
                  </span>
                  <span id={`${uid}-role-${r.value}`} className={styles.accessDesc}>{r.description}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* ---------- Variante COMPANY: empresa fixa + role na empresa ---------- */}
        {props.variant === "company" && (
          <>
            <div className={styles.field}>
              <label htmlFor={`${uid}-companyId`}>Acesso à empresa *</label>
              <div className={styles.companySelect}>
                <Building2 size={14} aria-hidden />
                <select
                  id={`${uid}-companyId`}
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
                  <span className={`${styles.badge} ${styles.badgeGray}`}>Empresa atual</span>
                )}
              </div>
            </div>

            <fieldset className={styles.fieldset}>
              <legend>Papel do usuário *</legend>
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
          <label htmlFor={`${uid}-password`}>Senha temporária *</label>
          <div className={styles.passwordWrap}>
            <input
              id={`${uid}-password`}
              className={`${styles.input} ${styles.passwordInput}`}
              placeholder="Senha temporária"
              value={values.password}
              onChange={set("password")}
              autoComplete="new-password"
              minLength={8}
              required
              aria-describedby={`${uid}-password-hint`}
            />
            <button
              type="button"
              className={styles.generate}
              onClick={() => {
                setValues((v) => ({ ...v, password: generatePassword() }));
                setGenerated(true);
              }}
            >
              Gerar senha
            </button>
          </div>
          <p id={`${uid}-password-hint`} className={styles.hint}>
            <Info size={12} aria-hidden /> Mínimo de 8 caracteres. O usuário precisa trocar a senha no primeiro acesso.
          </p>
          <span className={styles.srOnly} role="status">
            {generated ? "Senha gerada e preenchida no campo." : ""}
          </span>
        </div>

        {props.variant === "admin" && (
          <div className={styles.noCompany}>
            <span className={styles.noCompanyTitle}>
              <Building2 size={13} aria-hidden /> Nenhuma empresa vinculada
            </span>
            <span className={styles.noCompanyDesc}>
              Você pode vincular este usuário a uma empresa depois.
            </span>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.btn} onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
          <UserPlus size={15} aria-hidden />
          {loading ? "Criando..." : "Criar usuário"}
        </button>
      </footer>
    </form>
  );
}