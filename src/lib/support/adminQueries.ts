import "server-only";
import type { Prisma, TicketPriority } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ADMIN_PAGE_SIZE, ADMIN_VIEWS, PRIORITY_LABEL, type AdminView } from "./constants";
import { describeRelated } from "./format";
import type { AdminInbox, AdminTicketDetailView } from "./types";
import { parseIdOrNull } from "./ids";

export type AdminFilters = {
  view: AdminView;
  companyId: number | null;
  brandId: number | null;
  priority: TicketPriority | null;
  page: number;
};

export function parseAdminFilters(sp: Record<string, string | string[] | undefined>): AdminFilters {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : (sp[k] as string | undefined));
  const priority = one("priority");
  return {
    view: ADMIN_VIEWS.find((v) => v.key === one("view"))?.key ?? "all",
    companyId: parseIdOrNull(one("company")),
    brandId: parseIdOrNull(one("brand")),
    priority:
      priority && Object.prototype.hasOwnProperty.call(PRIORITY_LABEL, priority)
        ? (priority as TicketPriority)
        : null,
    page: parseIdOrNull(one("page")) ?? 1,
  };
}

const fullName = (u: { firstName: string; lastName: string }) => `${u.firstName} ${u.lastName}`;

const relatedSelect = {
  product: { select: { name: true } },
  brand: { select: { name: true } },
  company: { select: { name: true } },
} as const;

export async function getAdminInbox(adminId: number, f: AdminFilters): Promise<AdminInbox> {
  const base: Prisma.TicketWhereInput = {
    ...(f.companyId ? { companyId: f.companyId } : {}),
    ...(f.brandId ? { brandId: f.brandId } : {}),
    ...(f.priority ? { priority: f.priority } : {}),
  };
  const viewWhere = (v: AdminView): Prisma.TicketWhereInput =>
    v === "unassigned" ? { assigneeId: null }
    : v === "mine" ? { assigneeId: adminId }
    : v === "awaiting" ? { status: "AWAITING_USER" }
    : {};
  const count = (v: AdminView) => prisma.ticket.count({ where: { AND: [base, viewWhere(v)] } });

  const [rows, all, unassigned, mine, awaiting, companies, brands] = await Promise.all([
    prisma.ticket.findMany({
      where: { AND: [base, viewWhere(f.view)] },
      orderBy: { lastMessageAt: "desc" },
      skip: (f.page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      select: {
        id: true,
        title: true,
        about: true,
        status: true,
        priority: true,
        lastMessageAt: true,
        createdBy: { select: { firstName: true, lastName: true } },
        assignee: { select: { firstName: true, lastName: true } },
        ...relatedSelect,
      },
    }),
    count("all"),
    count("unassigned"),
    count("mine"),
    count("awaiting"),
    prisma.company.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, companyId: true },
    }),
  ]);

  const counts = { all, unassigned, mine, awaiting };
  return {
    items: rows.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      lastMessageAt: t.lastMessageAt.toISOString(),
      related: describeRelated(t),
      requesterName: fullName(t.createdBy),
      assigneeName: t.assignee ? fullName(t.assignee) : null,
    })),
    total: counts[f.view],
    page: f.page,
    pageSize: ADMIN_PAGE_SIZE,
    counts,
    companies,
    brands,
  };
}

export async function getAdminTicketDetail(ticketId: number): Promise<AdminTicketDetailView | null> {
  const t = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      category: true,
      createdAt: true,
      createdById: true,
      createdBy: { select: { firstName: true, lastName: true, email: true } },
      assignee: { select: { firstName: true, lastName: true } },
      ...relatedSelect,
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          body: true,
          isInternal: true,
          createdAt: true,
          author: { select: { id: true, firstName: true, lastName: true } },
          attachments: { select: { id: true, fileName: true, fileUrl: true } },
        },
      },
    },
  });
  if (!t) return null;
  return {
    id: t.id,
    title: t.title,
    status: t.status,
    priority: t.priority,
    category: t.category,
    createdAt: t.createdAt.toISOString(),
    requester: { name: fullName(t.createdBy), email: t.createdBy.email },
    assigneeName: t.assignee ? fullName(t.assignee) : null,
    product: t.product?.name ?? null,
    brand: t.brand?.name ?? null,
    company: t.company?.name ?? null,
    messages: t.messages.map((m) => ({
      id: m.id,
      body: m.body,
      isInternal: m.isInternal,
      createdAt: m.createdAt.toISOString(),
      fromSupport: m.author.id !== t.createdById,
      authorName: fullName(m.author),
      attachments: m.attachments,
    })),
  };
}
