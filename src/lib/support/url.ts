// Monta "/caminho?a=1&b=2" ignorando valores vazios. Passe undefined em overrides para remover.
export function withParams(
  path: string,
  current: Record<string, string | undefined>,
  overrides: Record<string, string | undefined> = {},
) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...current, ...overrides })) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}
