import { NextResponse, connection } from "next/server";
import { handleError } from "@/lib/companyAccess";
import { requireAdmin } from "@/lib/support/access";
import { getAdminInbox, parseAdminFilters } from "@/lib/support/adminQueries";

// Fila do admin. Filtros: ?view=unassigned|mine|awaiting&company=1&brand=2&priority=HIGH&page=2
export async function GET(req: Request) {
  await connection(); // fora do try: o Next trata o sinal dele, o handleError não
  try {
    const admin = await requireAdmin();
    const sp = Object.fromEntries(new URL(req.url).searchParams);
    return NextResponse.json(await getAdminInbox(admin.id, parseAdminFilters(sp)));
  } catch (e) {
    return handleError(e);
  }
}