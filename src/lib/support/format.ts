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
      return { name: t.product?.name ?? "Removed product", kind: "Product" };
    case "BRAND":
      return { name: t.brand?.name ?? "Removed brand", kind: "Brand" };
    case "COMPANY":
      return { name: t.company?.name ?? "Removed company", kind: "Company" };
    case "ACCOUNT":
      return { name: "Account and access", kind: "General" };
    default:
      return { name: "Other", kind: "General" };
  }
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(iso));
}

export function formatRelative(iso: string, now = Date.now()) {
  const diff = (new Date(iso).getTime() - now) / 1000;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60) return "just now";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 604800) return rtf.format(Math.round(diff / 86400), "day");
  return formatDate(iso);
}
