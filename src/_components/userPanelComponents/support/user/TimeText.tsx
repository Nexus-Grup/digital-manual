"use client";
import { formatDateTime, formatRelative } from "@/lib/support/format";

// Formata no navegador (fuso do usuário); suppressHydrationWarning evita diferença servidor x cliente.
export function TimeText({ iso, relative = false }: { iso: string; relative?: boolean }) {
  return (
    <time dateTime={iso} title={formatDateTime(iso)} suppressHydrationWarning>
      {relative ? formatRelative(iso) : formatDateTime(iso)}
    </time>
  );
}
