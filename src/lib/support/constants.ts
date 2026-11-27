import type {
  TicketAbout,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@prisma/client";

// Mude aqui se o painel do usuário ficar sob outro prefixo (ex.: "/panel/suporte").
export const SUPPORT_BASE = "/painel/suporte";
export const SUPPORT_TEAM_LABEL = "Equipe de suporte";

export const LIMITS = { titleMin: 3, titleMax: 120, bodyMin: 10, bodyMax: 5000 } as const;

export const STATUS_LABEL: Record<TicketStatus, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  AWAITING_USER: "Aguardando sua resposta",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

export type StatusTone = "blue" | "yellow" | "purple" | "green" | "gray" | "red";
export const STATUS_TONE: Record<TicketStatus, StatusTone> = {
  OPEN: "blue",
  IN_PROGRESS: "yellow",
  AWAITING_USER: "purple",
  RESOLVED: "green",
  CLOSED: "gray",
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const ABOUT_LABEL: Record<TicketAbout, string> = {
  PRODUCT: "Produto",
  BRAND: "Marca",
  COMPANY: "Empresa",
  ACCOUNT: "Conta e acesso",
  OTHER: "Outros",
};

export const CATEGORY_LABEL: Record<TicketCategory, string> = {
  TECHNICAL_ISSUE: "Problema técnico",
  QUESTION: "Dúvida",
  OTHER: "Outros",
};

function toOptions<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
export const ABOUT_OPTIONS = toOptions(ABOUT_LABEL);
export const PRIORITY_OPTIONS = toOptions(PRIORITY_LABEL);
export const CATEGORY_OPTIONS = toOptions(CATEGORY_LABEL);

// Filtros da lista (chips). "Em andamento" inclui os que aguardam resposta do usuário.
export const FILTERS: { key: string; label: string; statuses: readonly TicketStatus[] | null }[] = [
  { key: "all", label: "Todos", statuses: null },
  { key: "open", label: "Aberto", statuses: ["OPEN"] },
  { key: "in_progress", label: "Em andamento", statuses: ["IN_PROGRESS", "AWAITING_USER"] },
  { key: "resolved", label: "Resolvido", statuses: ["RESOLVED", "CLOSED"] },
];

// ----- Admin e anexos -----
// Mesma rota do usuário: a page decide a tela pelo systemRole.
export const ADMIN_SUPPORT_BASE = SUPPORT_BASE;
export const ADMIN_PAGE_SIZE = 20;

export const STATUS_LABEL_ADMIN: Record<TicketStatus, string> = {
  ...STATUS_LABEL,
  AWAITING_USER: "Aguardando usuário",
};
export const STATUS_OPTIONS_ADMIN = toOptions(STATUS_LABEL_ADMIN);

export const PRIORITY_TONE: Record<TicketPriority, StatusTone> = {
  LOW: "gray",
  MEDIUM: "yellow",
  HIGH: "red",
};

export const ADMIN_VIEWS = [
  { key: "all", label: "Todos" },
  { key: "unassigned", label: "Sem responsável" },
  { key: "mine", label: "Atribuídos a mim" },
  { key: "awaiting", label: "Aguardando usuário" },
] as const;
export type AdminView = (typeof ADMIN_VIEWS)[number]["key"];

// Crie este bucket no Supabase Storage (público, como o de logos).
export const SUPPORT_BUCKET = "support-attachments";
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
