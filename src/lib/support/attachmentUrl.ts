import { SUPPORT_BUCKET } from "./constants";

/**
 * true se a URL é um anexo enviado por NOSSA rota /api/support/uploads
 * (nosso bucket, pasta support/, nome uuid.ext). Mesmo padrão do logoUrl.ts:
 * não importa o Supabase, então pode ser usado em schemas zod.
 */
export function isSupportAttachmentUrl(value: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;

  const prefix = `${base}/storage/v1/object/public/${SUPPORT_BUCKET}/support/`;
  if (!value.startsWith(prefix)) return false;
  return /^[0-9a-f-]{36}\.(png|jpg|pdf)$/i.test(value.slice(prefix.length));
}
