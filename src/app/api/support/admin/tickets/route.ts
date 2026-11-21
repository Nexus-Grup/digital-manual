import { NextResponse } from "next/server";
import { handleError } from "@/lib/companyAccess";
import { requireAdmin } from "@/lib/support/access";
import { getAdminInbox, parseAdminFilters } from "@/lib/support/adminQueries";

// Fila do admin. Filtros: ?view=unassigned|mine|awaiting&company=1&brand=2&priority=HIGH&page=2
export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    const sp = Object.fromEntries(new URL(req.url).searchParams);
    return NextResponse.json(await getAdminInbox(admin.id, parseAdminFilters(sp)));
  } catch (e) {
    return handleError(e);
  }
}
