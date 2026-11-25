import { NextResponse } from "next/server";
import type { TicketStatus } from "@prisma/client";
import { HttpError, handleError, parseId, readBody, requireUser } from "@/lib/companyAccess";
import { prisma } from "@/lib/prisma";
import { messageInput } from "@/lib/support/schemas";

type Ctx = { params: Promise<{ ticketId: string }> };

// O usuário responde no próprio chamado (sempre pública, nunca nota interna).
export async function POST(req: Request, { params }: Ctx) {
  try {
    const user = await requireUser();
    const id = parseId((await params).ticketId);
    const { body, attachments } = await readBody(req, messageInput);

    const ticket = await prisma.ticket.findFirst({
      where: { id, createdById: user.id },
      select: { status: true, assigneeId: true },
    });
    if (!ticket) throw new HttpError(404, "Ticket not found");
    if (ticket.status === "CLOSED") throw new HttpError(409, "This ticket is closed. Open a new one");

    // Resposta do usuário reabre chamado resolvido e tira "aguardando você".
    const nextStatus: TicketStatus | undefined =
      ticket.status === "RESOLVED" || ticket.status === "AWAITING_USER"
        ? ticket.assigneeId ? "IN_PROGRESS" : "OPEN"
        : undefined;

    const [message] = await prisma.$transaction([
      prisma.ticketMessage.create({
        data: { ticketId: id, authorId: user.id, body, attachments: { create: attachments } },
        select: { id: true },
      }),
      prisma.ticket.update({
        where: { id },
        data: { lastMessageAt: new Date(), ...(nextStatus ? { status: nextStatus, resolvedAt: null } : {}) },
      }),
    ]);
    return NextResponse.json({ id: message.id }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
