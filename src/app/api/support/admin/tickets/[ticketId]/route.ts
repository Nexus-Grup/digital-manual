import { NextResponse } from "next/server";
import { HttpError, handleError, parseId, readBody } from "@/lib/companyAccess";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/support/access";
import { STATUS_LABEL_ADMIN } from "@/lib/support/constants";
import { ticketNotification } from "@/lib/support/notify";
import { adminUpdateInput } from "@/lib/support/schemas";

type Ctx = { params: Promise<{ ticketId: string }> };

// Admin muda status e/ou prioridade. O responsável NÃO é alterado aqui (quem responde primeiro assume).
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireAdmin();
    const id = parseId((await params).ticketId);
    const { status, priority } = await readBody(req, adminUpdateInput);

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: { status: true, title: true, createdById: true },
    });
    if (!ticket) throw new HttpError(404, "Ticket not found");

    const now = new Date();
    const statusChanged = !!status && status !== ticket.status;

    await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id },
        data: {
          ...(priority ? { priority } : {}),
          ...(status
            ? {
                status,
                resolvedAt: status === "RESOLVED" ? now : status === "CLOSED" ? undefined : null,
                closedAt: status === "CLOSED" ? now : null,
              }
            : {}),
        },
      });
      if (statusChanged && status) {
        await tx.notification.create({
          data: ticketNotification(
            ticket.createdById,
            id,
            "Ticket status updated",
            `Your ticket "${ticket.title}" is now ${STATUS_LABEL_ADMIN[status].toLowerCase()}.`,
          ),
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
