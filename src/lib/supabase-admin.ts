import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { LOGO_BUCKET } from "@/lib/logoUrl";

// Mantém compatibilidade com arquivos que importavam LOGO_BUCKET daqui.
export { LOGO_BUCKET } from "@/lib/logoUrl";

let client: SupabaseClient | null = null;

/**
 * Client com service role = acesso total. Só no servidor, nunca com NEXT_PUBLIC_.
 * Criado sob demanda (lazy) para não quebrar o `next build` quando as
 * variáveis de ambiente não estão disponíveis na hora de coletar as rotas.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar definidas."
      );
    }

    client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}

/**
 * Apaga um logo do Storage a partir da URL pública salva no banco.
 * Use ao trocar ou remover o logo de uma empresa.
 */
export async function deleteCompanyLogo(publicUrl: string | null | undefined) {
  if (!publicUrl) return;

  const marker = `/storage/v1/object/public/${LOGO_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return; // não é arquivo deste bucket (ex.: logo antigo em /uploads)

  const objectPath = decodeURIComponent(
    publicUrl.slice(index + marker.length).split("?")[0]
  );
  await getSupabaseAdmin().storage.from(LOGO_BUCKET).remove([objectPath]);
}