import "server-only";
import type { TicketAbout } from "@prisma/client";
import { HttpError } from "@/lib/companyAccess";
import { prisma } from "@/lib/prisma";
import { SUPPORT_TEAM_LABEL } from "./constants";
import { describeRelated } from "./format";
import type { TicketDetailView, TicketListItem, TicketTargets } from "./types";

const relatedSelect = {
  product: { select: { name: true } },
  brand: { select: { name: true } },
  company: { select: { name: true } },
} as const;

// Marcas que o usuário pode "ver": ativas e de empresas ativas das quais ele é membro.
// Se for restringe por UserBrand/papel, ajusta este filtro em um lugar só.
const brandScope = (userId: number) => ({
  isActive: true,
  company: { isActive: true, userCompanies: { some: { userId } } },
});

export async function getUserTickets(userId: number): Promise<TicketListItem[]> {
  const rows = await prisma.ticket.findMany({
    where: { createdById: userId },
    orderBy: { lastMessageAt: "desc" },
    select: { id: true, title: true, about: true, status: true, lastMessageAt: true, ...relatedSelect },
  });
  return rows.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    lastMessageAt: t.lastMessageAt.toISOString(),
    related: describeRelated(t),
  }));
}

export async function getTicketTargets(userId: number): Promise<TicketTargets> {
  const companies = await prisma.company.findMany({
    where: { isActive: true, userCompanies: { some: { userId } } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      brands: {
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          products: { orderBy: { name: "asc" }, select: { id: true, name: true } },
        },
      },
    },
  });
  return {
    companies: companies.map((c) => ({ id: c.id, name: c.name })),
    brands: companies.flatMap((c) => c.brands.map((b) => ({ id: b.id, name: b.name }))),
    products: companies.flatMap((c) =>
      c.brands.flatMap((b) => b.products.map((p) => ({ id: p.id, name: `${p.name} (${b.name})` }))),
    ),
  };
}

export type TargetIds = { productId: number | null; brandId: number | null; companyId: number | null };

// Confere se o alvo pertence ao usuário e preenche brandId/companyId a partir do produto/marca.
export async function resolveTicketTarget(
  userId: number,
  about: TicketAbout,
  ids: TargetIds,
): Promise<TargetIds> {
  if (about === "PRODUCT") {
    if (!ids.productId) throw new HttpError(400, "Selecione um produto");
    const p = await prisma.product.findFirst({
      where: { id: ids.productId, brand: brandScope(userId) },
      select: { id: true, brandId: true, brand: { select: { companyId: true } } },
    });
    if (!p) throw new HttpError(404, "Produto não encontrado");
    return { productId: p.id, brandId: p.brandId, companyId: p.brand.companyId };
  }
  if (about === "BRAND") {
    if (!ids.brandId) throw new HttpError(400, "Selecione uma marca");
    const b = await prisma.brand.findFirst({
      where: { id: ids.brandId, ...brandScope(userId) },
      select: { id: true, companyId: true },
    });
    if (!b) throw new HttpError(404, "Marca não encontrada");
    return { productId: null, brandId: b.id, companyId: b.companyId };
  }
  if (about === "COMPANY") {
    if (!ids.companyId) throw new HttpError(400, "Selecione uma empresa");
    const c = await prisma.company.findFirst({
      where: { id: ids.companyId, isActive: true, userCompanies: { some: { userId } } },
      select: { id: true },
    });
    if (!c) throw new HttpError(404, "Empresa não encontrada");
    return { productId: null, brandId: null, companyId: c.id };
  }
  return { productId: null, brandId: null, companyId: null };
}

// Só o dono do chamado enxerga; notas internas nunca saem daqui.
export async function getTicketDetail(userId: number, ticketId: number): Promise<TicketDetailView | null> {
  const t = await prisma.ticket.findFirst({
    where: { id: ticketId, createdById: userId },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      category: true,
      about: true,
      assigneeId: true,
      createdAt: true,
      ...relatedSelect,
      messages: {
        where: { isInternal: false },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          body: true,
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
    about: t.about,
    related: describeRelated(t),
    hasAssignee: t.assigneeId !== null,
    createdAt: t.createdAt.toISOString(),
    messages: t.messages.map((m) => {
      const fromSupport = m.author.id !== userId;
      return {
        id: m.id,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
        fromSupport,
        isInternal: false,
        // O usuário nunca vê o nome do admin que respondeu.
        authorName: fromSupport ? SUPPORT_TEAM_LABEL : `${m.author.firstName} ${m.author.lastName}`,
        attachments: m.attachments,
      };
    }),
  };
}
