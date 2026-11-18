import "server-only";
import { createClient } from "@supabase/supabase-js";

export const LOGO_BUCKET = "company-logos";

// Service role = acesso total. Só no servidor, nunca com NEXT_PUBLIC_
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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
  await supabaseAdmin.storage.from(LOGO_BUCKET).remove([objectPath]);
}