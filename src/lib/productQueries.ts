import type { Prisma, ProductCategory, ProductSubcategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ALL_SUBCATEGORIES, CATEGORIES } from '@/_lib/productConstants';
import type {
  BrandOption, ListSummary, ProductFull, ProductListItem, Progress, SpecDTO,
} from '@/_lib/productTypes';
import { COUNT_SELECT, computeProgress, stepsFromCounts } from '@/lib/productCompletion';

type U = { id: number; systemRole: string };

/** Carrega uma vez o que o usuário pode ver/editar (evita uma consulta por produto). */
export async function loadAccess(user: U) {
  if (user.systemRole === 'ADMIN') {
    return {
      scope: {} as Prisma.ProductWhereInput,
      canEditBrand: (_b: { id: number; companyId: number }) => true,
      brandWhere: { isActive: true } as Prisma.BrandWhereInput,
    };
  }

  const memberships = await prisma.userCompany.findMany({
    where: { userId: user.id, company: { isActive: true } },
    select: { companyId: true, companyRole: true, userBrands: { select: { brandId: true, brandRole: true } } },
  });

  const fullCompanies = memberships.filter((m) => m.companyRole !== 'MEMBER').map((m) => m.companyId);
  const linkedBrands = memberships.flatMap((m) => m.userBrands);
  const editorBrands = new Set(linkedBrands.filter((b) => b.brandRole === 'EDITOR').map((b) => b.brandId));
  const full = new Set(fullCompanies);

  const brandOr: Prisma.BrandWhereInput[] = [
    { companyId: { in: fullCompanies } },
    { id: { in: linkedBrands.map((b) => b.brandId) } },
  ];

  return {
    scope: { brand: { isActive: true, OR: brandOr } } as Prisma.ProductWhereInput,
    canEditBrand: (b: { id: number; companyId: number }) => full.has(b.companyId) || editorBrands.has(b.id),
    brandWhere: {
      isActive: true,
      OR: [{ companyId: { in: fullCompanies } }, { id: { in: [...editorBrands] } }],
    } as Prisma.BrandWhereInput,
  };
}

/** Marcas em que o usuário pode CRIAR produto (select "Brand" da etapa 1). */
export async function editableBrands(user: U): Promise<BrandOption[]> {
  const access = await loadAccess(user);
  const rows = await prisma.brand.findMany({
    where: access.brandWhere,
    select: { id: true, name: true, companyId: true, company: { select: { name: true } } },
    orderBy: { name: 'asc' },
  });
  return rows.map((b) => ({ id: b.id, name: b.name, companyId: b.companyId, companyName: b.company.name }));
}

/** Marcas que o usuário pode VER (filtro da lista). */
export async function visibleBrands(user: U) {
  const access = await loadAccess(user);
  const brandScope = (access.scope as { brand?: Prisma.BrandWhereInput }).brand ?? { isActive: true };
  return prisma.brand.findMany({
    where: brandScope,
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
}

export type ListFilters = {
  brandId?: number;
  category?: string;
  subcategory?: string;
  q?: string;
  tab?: 'all' | 'complete' | 'incomplete' | 'draft';
  page?: number;
  pageSize?: number;
};

export async function listProducts(user: U, f: ListFilters) {
  const access = await loadAccess(user);
  const q = f.q?.trim().slice(0, 80);
  const category = CATEGORIES.some((c) => c.value === f.category) ? (f.category as ProductCategory) : undefined;
  const subcategory = ALL_SUBCATEGORIES.some((s) => s.value === f.subcategory)
    ? (f.subcategory as ProductSubcategory)
    : undefined;

  const where: Prisma.ProductWhereInput = {
    ...access.scope,
    ...(f.brandId ? { brandId: f.brandId } : {}),
    ...(category ? { category } : {}),
    ...(subcategory ? { subcategory } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { code: { contains: q, mode: 'insensitive' } },
            { model: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const rows = await prisma.product.findMany({
    where,
    select: {
      id: true, name: true, code: true, imgUrl: true, category: true, subcategory: true,
      status: true, updatedAt: true, brandId: true,
      brand: { select: { name: true, companyId: true, company: { select: { name: true } } } },
      _count: { select: COUNT_SELECT },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const all: ProductListItem[] = rows.map((r) => {
    const p = computeProgress(stepsFromCounts(r.imgUrl, r._count), r.updatedAt);
    return {
      id: r.id,
      name: r.name,
      code: r.code,
      imgUrl: r.imgUrl,
      category: r.category,
      subcategory: r.subcategory,
      status: r.status,
      updatedAt: r.updatedAt.toISOString(),
      brandId: r.brandId,
      brandName: r.brand.name,
      companyName: r.brand.company.name,
      completion: p.completion,
      complete: p.completion === 100,
      canEdit: access.canEditBrand({ id: r.brandId, companyId: r.brand.companyId }),
    };
  });

  const summary: ListSummary = {
    all: all.length,
    published: all.filter((p) => p.status === 'PUBLISHED').length,
    draft: all.filter((p) => p.status === 'DRAFT').length,
    complete: all.filter((p) => p.complete).length,
    incomplete: all.filter((p) => !p.complete).length,
  };

  const tab = f.tab ?? 'all';
  const filtered = all.filter((p) =>
    tab === 'complete' ? p.complete : tab === 'incomplete' ? !p.complete : tab === 'draft' ? p.status === 'DRAFT' : true,
  );

  const pageSize = Math.min(Math.max(f.pageSize ?? 12, 1), 50);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(Math.max(f.page ?? 1, 1), pages);

  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pages,
    pageSize,
    summary,
  };
}

/** Progresso atual do produto (devolvido por todas as rotas de salvar etapa). */
export async function getProgress(productId: number): Promise<Progress> {
  const p = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
    select: { imgUrl: true, updatedAt: true, _count: { select: COUNT_SELECT } },
  });
  return computeProgress(stepsFromCounts(p.imgUrl, p._count), p.updatedAt);
}

export async function getProductFull(productId: number, canEdit: boolean): Promise<ProductFull> {
  const p = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
    select: {
      id: true, name: true, model: true, code: true, description: true, category: true, subcategory: true,
      status: true, updatedAt: true, imgUrl: true, brandId: true,
      brand: { select: { name: true, company: { select: { name: true } } } },
      galleries: {
        select: { mediaType: true, mediaUrl: true, images: { select: { imageUrl: true }, orderBy: { displayOrder: 'asc' } } },
      },
      videos: { select: { title: true, url: true, code: true, description: true }, orderBy: { id: 'asc' } },
      audios: { select: { audioUrl: true, audioType: true }, orderBy: { id: 'asc' } },
      technicalSheets: { take: 1, orderBy: { id: 'asc' } },
      manuals: {
        select: { title: true, fileUrl: true, documentType: true, language: true, version: true },
        orderBy: { id: 'asc' },
      },
      informations: {
        take: 1,
        orderBy: { id: 'asc' },
        select: {
          title: true, description: true,
          steps: { select: { title: true, icon: true, description: true }, orderBy: { displayOrder: 'asc' } },
        },
      },
      assemblies: {
        orderBy: { id: 'asc' },
        select: {
          title: true, type: true, description: true, imageUrl: true,
          steps: { select: { title: true, description: true, imageUrl: true }, orderBy: { stepNumber: 'asc' } },
        },
      },
      qrCodes: { orderBy: { id: 'asc' }, select: { id: true, value: true, url: true, isActive: true, createdAt: true } },
    },
  });

  const events = await prisma.productAnalyticsEvent.groupBy({
    by: ['eventType'],
    where: { productId },
    _count: { _all: true },
  });
  const count = (t: string) => events.find((e) => e.eventType === t)?._count._all ?? 0;

  const sheet = p.technicalSheets[0];
  const info = p.informations[0];
  const imageGallery = p.galleries.find((g) => g.mediaType === 'IMAGE');
  const model = p.galleries.find((g) => g.mediaType === 'MODEL_3D');

  const progress = computeProgress(
    stepsFromCounts(p.imgUrl, {
      galleries: p.galleries.length, videos: p.videos.length, audios: p.audios.length,
      technicalSheets: p.technicalSheets.length, manuals: p.manuals.length,
      informations: p.informations.length, assemblies: p.assemblies.length, qrCodes: p.qrCodes.length,
    }),
    p.updatedAt,
  );

  return {
    id: p.id,
    name: p.name,
    model: p.model,
    code: p.code,
    description: p.description,
    category: p.category,
    subcategory: p.subcategory,
    brandId: p.brandId,
    brandName: p.brand.name,
    companyName: p.brand.company.name,
    status: p.status,
    updatedAt: p.updatedAt.toISOString(),
    canEdit,
    progress,
    imgUrl: p.imgUrl,
    gallery: imageGallery?.images.map((i) => i.imageUrl) ?? [],
    model3dUrl: model?.mediaUrl ?? null,
    videos: p.videos,
    audios: p.audios,
    technical: sheet
      ? {
          title: sheet.title,
          description: sheet.description,
          material: sheet.material,
          dimensions: sheet.dimensions,
          weight: sheet.weight ? Number(sheet.weight) : null,
          specs: Array.isArray(sheet.specifications) ? (sheet.specifications as unknown as SpecDTO[]) : [],
        }
      : null,
    manuals: p.manuals,
    information: info
      ? { title: info.title, description: info.description, cards: info.steps }
      : null,
    assemblies: p.assemblies,
    qrCodes: p.qrCodes.map((q) => ({ ...q, createdAt: q.createdAt.toISOString() })),
    stats: {
      views: count('PRODUCT_VIEW'),
      qrScans: count('QR_SCAN'),
      downloads: count('MANUAL_DOWNLOAD'),
      landing: count('LANDING_PAGE_VIEW'),
    },
  };
}
