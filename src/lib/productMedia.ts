// Arquivos de produto ficam num bucket PÚBLICO do Supabase: product-media
// Caminho: products/{productId}/{uuid}[-nome].{ext}
export const PRODUCT_BUCKET = 'product-media';

const FILE_RE = /^(\d+)\/[0-9a-f-]{36}(-[a-z0-9._-]{1,60})?\.(png|jpg|webp|mp3|wav|ogg|pdf|glb)$/i;

/** true se a URL é um arquivo enviado pela NOSSA rota de upload (nada de URL de terceiros). */
export function isProductMediaUrl(value: string, productId?: number) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  const prefix = `${base}/storage/v1/object/public/${PRODUCT_BUCKET}/products/`;
  if (!value.startsWith(prefix)) return false;
  const m = FILE_RE.exec(value.slice(prefix.length));
  if (!m) return false;
  return productId === undefined || Number(m[1]) === productId;
}
