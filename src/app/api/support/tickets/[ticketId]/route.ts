import { NextResponse } from "next/server";
import { HttpError, handleError, parseId, readBody, requireUser } from "@/lib/companyAccess";
import { prisma } from "@/lib/prisma";
import { getTicketDetail } from "@/lib/support/queries";
import { userResolveInput } from "@/lib/support/schemas";

type Ctx = { params: Promise<{ ticketId: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const user = await requireUser();
    const ticket = await getTicketDetail(user.id, parseId((await params).ticketId));
    if (!ticket) throw new HttpError(404, "Ticket not found");
    return NextResponse.json(ticket);
  } catch (e) {
    return handleError(e);
  }
}

// O usuário só pode marcar o próprio chamado como resolvido.
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const user = await requireUser();
    const id = parseId((await params).ticketId);
    await readBody(req, userResolveInput);

    const result = await prisma.ticket.updateMany({
      where: { id, createdById: user.id, status: { in: ["OPEN", "IN_PROGRESS", "AWAITING_USER"] } },
      data: { status: "RESOLVED", resolvedAt: new Date() },
    });
    if (result.count === 0) throw new HttpError(409, "This ticket can't be resolved");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
