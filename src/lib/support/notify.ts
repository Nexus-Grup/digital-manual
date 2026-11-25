import { SUPPORT_BASE } from "./constants";

// Notificação para o dono do chamado (usa o model Notification que você já tem).
export const ticketNotification = (userId: number, ticketId: number, title: string, message: string) => ({
  userId,
  type: "INFO" as const,
  title,
  message,
  data: { url: `${SUPPORT_BASE}/${ticketId}` },
});
