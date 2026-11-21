import { NextResponse } from "next/server";
import type { TicketStatus } from "@prisma/client";
import { HttpError, handleError, parseId, readBody } from "@/lib/companyAccess";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/support/access";
import { ticketNotification } from "@/lib/support/notify";
import { adminMessageInput } from "@/lib/support/schemas";

type Ctx = { params: Promise<{ ticketId: string }> };

// Resposta pública ou nota interna.
// Resposta pública: notifica o usuário, atualiza "Updated", o 1º admin que responde vira o responsável
// e o chamado passa para "Awaiting user" (ou "Resolved" com resolve=true).
export async function POST(req: Request, { params }: Ctx) {
  try {
    const admin = await requireAdmin();
    const id = parseId((await params).ticketId);
    const { body, attachments, isInternal, resolve } = await readBody(req, adminMessageInput);

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: { status: true, assigneeId: true, title: true, createdById: true },
    });
    if (!ticket) throw new HttpError(404, "Ticket not found");
    if (ticket.status === "CLOSED" && !isInternal)
      throw new HttpError(409, "This ticket is closed. You can still add internal notes");

    const now = new Date();
    const nextStatus: TicketStatus | undefined = isInternal
      ? undefined
      : resolve
        ? "RESOLVED"
        : ticket.status === "OPEN" || ticket.status === "IN_PROGRESS"
          ? "AWAITING_USER"
          : undefined;

    const message = await prisma.$transaction(async (tx) => {
      const created = await tx.ticketMessage.create({
        data: { ticketId: id, authorId: admin.id, body, isInternal, attachments: { create: attachments } },
        select: { id: true },
      });
      if (!isInternal) {
        await tx.ticket.update({
          where: { id },
          data: {
            lastMessageAt: now,
            ...(ticket.assigneeId === null ? { assigneeId: admin.id } : {}),
            ...(nextStatus ? { status: nextStatus, resolvedAt: nextStatus === "RESOLVED" ? now : null } : {}),
          },
        });
        await tx.notification.create({
          data: ticketNotification(
            ticket.createdById,
            id,
            resolve ? "Your ticket was resolved" : "New reply on your ticket",
            `Support replied to "${ticket.title}".`,
          ),
        });
      }
      return created;
    });
    return NextResponse.json({ id: message.id }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
