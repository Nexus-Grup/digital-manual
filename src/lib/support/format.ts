import type { TicketAbout } from "@prisma/client";
import type { Related } from "./types";

export function describeRelated(t: {
  about: TicketAbout;
  product?: { name: string } | null;
  brand?: { name: string } | null;
  company?: { name: string } | null;
}): Related {
  switch (t.about) {
    case "PRODUCT":
      return { name: t.product?.name ?? "Produto removido", kind: "Produto" };
    case "BRAND":
      return { name: t.brand?.name ?? "Marca removida", kind: "Marca" };
    case "COMPANY":
      return { name: t.company?.name ?? "Empresa removida", kind: "Empresa" };
    case "ACCOUNT":
      return { name: "Conta e acesso", kind: "Geral" };
    default:
      return { name: "Outros", kind: "Geral" };
  }
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(iso));
}

export function formatRelative(iso: string, now = Date.now()) {
  const diff = (new Date(iso).getTime() - now) / 1000;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  if (abs < 60) return "agora mesmo";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 604800) return rtf.format(Math.round(diff / 86400), "day");
  return formatDate(iso);
}
