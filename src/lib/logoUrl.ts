export const LOGO_BUCKET = "company-logos";

/**
 * true se a URL é um logo enviado por NOSSA rota de upload (nosso bucket,
 * pasta companies/, nome uuid.ext). Use ao validar o logoUrl recebido do cliente:
 * impede salvar URLs de terceiros.
 *
 * Este arquivo NÃO importa o Supabase de propósito: pode ser usado em schemas
 * (zod) sem executar a criação do client durante o build.
 */
export function isCompanyLogoUrl(value: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;

  const prefix = `${base}/storage/v1/object/public/${LOGO_BUCKET}/companies/`;
  if (!value.startsWith(prefix)) return false;
  return /^[0-9a-f-]{36}\.(png|jpg|svg)$/i.test(value.slice(prefix.length));
}