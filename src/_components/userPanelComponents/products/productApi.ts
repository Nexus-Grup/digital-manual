import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** fetch que nunca lança: devolve { ok, data } ou { ok:false, error } (a mensagem vai para o toast). */
export async function api<T = unknown>(url: string, method: Method = 'GET', body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      ...(body !== undefined ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error ?? 'Something went wrong. Try again.' };
    return { ok: true, data: data as T };
  } catch (e) {
    console.error('[api] fetch threw:', method, url, e);
    return { ok: false, error: 'Network error. Try again.' };
  }
}

export type UploadKind = 'image' | 'audio' | 'pdf' | 'model';

let browserClient: SupabaseClient | null = null;
function storageClient() {
  // IMPORTANTE: no navegador o Next só substitui acesso DIRETO a process.env.NEXT_PUBLIC_XXX
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('[upload] SUPABASE URL:', url);
  console.log('[upload] SUPABASE KEY definida?', Boolean(key));

  if (!url || !key) {
    throw new Error('Faltam NEXT_PUBLIC_SUPABASE_URL e/ou a chave publishable/anon no .env.local (reinicie o npm run dev)');
  }

  browserClient ??= createClient(url, key, { auth: { persistSession: false } });
  return browserClient;
}

/**
 * Envio em 3 passos, direto ao Supabase (sem o limite de 4,5 MB da Vercel):
 *  1. o servidor confere permissão/tipo/tamanho e devolve uma URL assinada;
 *  2. o navegador envia o arquivo;
 *  3. o servidor confere o conteúdo real e devolve o endereço final.
 */
export async function uploadFile(productId: number, kind: UploadKind, file: File): Promise<ApiResult<{ url: string }>> {
  const sign = await api<{ bucket: string; path: string; token: string; publicUrl: string }>(
    `/api/products/${productId}/upload/sign`, 'POST', { kind, fileName: file.name, size: file.size },
  );
  if (!sign.ok) return sign;

  console.log('[upload] sign response:', {
    bucket: sign.data.bucket,
    path: sign.data.path,
    hasToken: Boolean(sign.data.token),
    publicUrl: sign.data.publicUrl,
  });

  try {
    const { error } = await storageClient()
      .storage.from(sign.data.bucket)
      .uploadToSignedUrl(sign.data.path, sign.data.token, file, { contentType: file.type || undefined, cacheControl: '31536000' });
    if (error) {
      console.error('[upload] Supabase upload error:', error);
      return { ok: false, error: 'Could not upload the file. Try again.' };
    }
  } catch (e) {
    console.error('[upload] Upload threw:', e);
    return { ok: false, error: 'Network error. Try again.' };
  }

  const confirm = await api<{ url: string }>(`/api/products/${productId}/upload/confirm`, 'POST', { kind, path: sign.data.path });
  return confirm;
}

/** ".../uuid-nome-do-arquivo.mp3" -> "nome-do-arquivo.mp3" */
export function fileNameFromUrl(url: string) {
  const last = decodeURIComponent(url.split('/').pop() ?? '');
  return last.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-?/i, '') || last || 'file';
}

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
export const formatDay = (iso: string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(iso));