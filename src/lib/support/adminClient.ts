import type { TicketPriority, TicketStatus } from "@prisma/client";
import { request } from "./client";
import type { UploadedFile } from "./types";

export const updateTicketAdmin = (
  ticketId: number,
  payload: { status?: TicketStatus; priority?: TicketPriority },
) =>
  request<{ ok: true }>(`/api/support/admin/tickets/${ticketId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const sendAdminMessage = (
  ticketId: number,
  payload: { body: string; isInternal: boolean; resolve: boolean; attachments: UploadedFile[] },
) =>
  request<{ id: number }>(`/api/support/admin/tickets/${ticketId}/messages`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
