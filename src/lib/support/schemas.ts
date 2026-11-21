import { z } from "zod";
import { isSupportAttachmentUrl } from "./attachmentUrl";
import { LIMITS, MAX_ATTACHMENTS } from "./constants";

const id = z.number().int().positive();
const idOrNull = id.nullish().transform((v) => v ?? null);

// Enums do Prisma (TicketStatus, TicketPriority, TicketAbout, TicketCategory)
const status = z.enum(["OPEN", "IN_PROGRESS", "AWAITING_USER", "RESOLVED", "CLOSED"]);
const priority = z.enum(["LOW", "MEDIUM", "HIGH"]);
const about = z.enum(["PRODUCT", "BRAND", "COMPANY", "ACCOUNT", "OTHER"]);
const category = z.enum(["TECHNICAL_ISSUE", "QUESTION", "OTHER"]);

const attachment = z.object({
  // só aceita arquivos enviados pela nossa rota de upload
  fileUrl: z.string().trim().refine(isSupportAttachmentUrl, "Invalid attachment"),
  fileName: z.string().trim().min(1).max(120),
  mimeType: z.string().max(100).nullish().transform((v) => v ?? null),
  sizeBytes: z.number().int().nonnegative().nullish().transform((v) => v ?? null),
});

const attachments = z
  .array(attachment)
  .max(MAX_ATTACHMENTS, `Attach up to ${MAX_ATTACHMENTS} files`)
  .default([]);

const body = z
  .string()
  .trim()
  .min(1, "Write a message first")
  .max(LIMITS.bodyMax, `Message can have up to ${LIMITS.bodyMax} characters`);

export const createTicketInput = z.object({
  title: z
    .string()
    .trim()
    .min(LIMITS.titleMin, `Subject must have at least ${LIMITS.titleMin} characters`)
    .max(LIMITS.titleMax, `Subject can have up to ${LIMITS.titleMax} characters`),
  description: z
    .string()
    .trim()
    .min(LIMITS.bodyMin, "Describe the problem in a few more words")
    .max(LIMITS.bodyMax),
  about,
  category,
  priority,
  productId: idOrNull,
  brandId: idOrNull,
  companyId: idOrNull,
  attachments,
});

export const messageInput = z.object({ body, attachments });

// O usuário só pode marcar o próprio chamado como resolvido.
export const userResolveInput = z.object({ status: z.literal("RESOLVED") });

export const adminUpdateInput = z
  .object({ status: status.optional(), priority: priority.optional() })
  .refine((v) => v.status || v.priority, "Nothing to update");

export const adminMessageInput = z
  .object({
    body,
    attachments,
    isInternal: z.boolean().default(false),
    resolve: z.boolean().default(false),
  })
  // "Send and resolve" só vale para resposta pública
  .transform((v) => ({ ...v, resolve: v.resolve && !v.isInternal }));
