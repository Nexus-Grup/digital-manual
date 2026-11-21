import type {
  TicketAbout,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@prisma/client";

// Mude aqui se o painel do usuário ficar sob outro prefixo (ex.: "/panel/support").
export const SUPPORT_BASE = "/user-panel/support";
export const SUPPORT_TEAM_LABEL = "Support team";

export const LIMITS = { titleMin: 3, titleMax: 120, bodyMin: 10, bodyMax: 5000 } as const;

export const STATUS_LABEL: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  AWAITING_USER: "Awaiting your reply",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
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
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const ABOUT_LABEL: Record<TicketAbout, string> = {
  PRODUCT: "Product",
  BRAND: "Brand",
  COMPANY: "Company",
  ACCOUNT: "Account and access",
  OTHER: "Other",
};

export const CATEGORY_LABEL: Record<TicketCategory, string> = {
  TECHNICAL_ISSUE: "Technical issue",
  QUESTION: "Question",
  OTHER: "Other",
};

function toOptions<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}
export const ABOUT_OPTIONS = toOptions(ABOUT_LABEL);
export const PRIORITY_OPTIONS = toOptions(PRIORITY_LABEL);
export const CATEGORY_OPTIONS = toOptions(CATEGORY_LABEL);

// Filtros da lista (chips). "In progress" inclui os que aguardam resposta do usuário.
export const FILTERS: { key: string; label: string; statuses: readonly TicketStatus[] | null }[] = [
  { key: "all", label: "All", statuses: null },
  { key: "open", label: "Open", statuses: ["OPEN"] },
  { key: "in_progress", label: "In progress", statuses: ["IN_PROGRESS", "AWAITING_USER"] },
  { key: "resolved", label: "Resolved", statuses: ["RESOLVED", "CLOSED"] },
];

// ----- Admin e anexos -----
// Mesma rota do usuário: a page decide a tela pelo systemRole.
export const ADMIN_SUPPORT_BASE = SUPPORT_BASE;
export const ADMIN_PAGE_SIZE = 20;

export const STATUS_LABEL_ADMIN: Record<TicketStatus, string> = {
  ...STATUS_LABEL,
  AWAITING_USER: "Awaiting user",
};
export const STATUS_OPTIONS_ADMIN = toOptions(STATUS_LABEL_ADMIN);

export const PRIORITY_TONE: Record<TicketPriority, StatusTone> = {
  LOW: "gray",
  MEDIUM: "yellow",
  HIGH: "red",
};

export const ADMIN_VIEWS = [
  { key: "all", label: "All" },
  { key: "unassigned", label: "Unassigned" },
  { key: "mine", label: "Assigned to me" },
  { key: "awaiting", label: "Awaiting user" },
] as const;
export type AdminView = (typeof ADMIN_VIEWS)[number]["key"];

// Crie este bucket no Supabase Storage (público, como o de logos).
export const SUPPORT_BUCKET = "support-attachments";
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
