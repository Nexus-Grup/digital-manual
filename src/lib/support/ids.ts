// Para pages (Server Components): devolve null em vez de lançar, aí use notFound().
// Nas rotas de API use parseId de "@/lib/companyAccess".
export function parseIdOrNull(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}
