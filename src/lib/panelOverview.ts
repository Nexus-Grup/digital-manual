import 'server-only';
import type { EventType, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { loadAccess } from '@/lib/productQueries';
import { COUNT_SELECT, computeProgress, stepsFromCounts } from '@/lib/productCompletion';
import { STEP_KEY_LABELS, missingSteps } from '@/_lib/productConstants';
import type { StepKey } from '@/_lib/productTypes';

// Shared numbers of the two panel home pages ("Visão geral"): the client company overview and the
// platform overview of the super user. Everything is computed for a product scope, so each person
// only sees what they are allowed to.

export const PERIODS = [7, 30, 90] as const;
export type PeriodDays = (typeof PERIODS)[number];
export const toPeriod = (v: unknown): PeriodDays => (PERIODS as readonly number[]).includes(Number(v)) ? (Number(v) as PeriodDays) : 30;

const DAY = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------- usage (analytics events)
export type UsageKey = 'qrScans' | 'views' | 'landingViews' | 'manualViews' | 'downloads';
const USAGE_EVENTS: Record<UsageKey, EventType> = {
  qrScans: 'QR_SCAN',
  views: 'PRODUCT_VIEW',
  landingViews: 'LANDING_PAGE_VIEW',
  manualViews: 'MANUAL_VIEW',
  downloads: 'MANUAL_DOWNLOAD',
};

export type UsageMetric = { value: number; previous: number };
export type Usage = Record<UsageKey, UsageMetric>;

async function countByType(scope: Prisma.ProductWhereInput, from: Date, to: Date) {
  const rows = await prisma.productAnalyticsEvent.groupBy({
    by: ['eventType'],
    where: { product: scope, createdAt: { gte: from, lt: to } },
    _count: { _all: true },
  });
  return (type: EventType) => rows.find((r) => r.eventType === type)?._count._all ?? 0;
}

/** Usage in the last `days` and in the period right before it (for the % change). */
export async function getUsage(scope: Prisma.ProductWhereInput, days: PeriodDays): Promise<Usage> {
  const now = new Date();
  const start = new Date(now.getTime() - days * DAY);
  const before = new Date(start.getTime() - days * DAY);
  const [cur, prev] = await Promise.all([countByType(scope, start, now), countByType(scope, before, start)]);
  return Object.fromEntries(
    (Object.keys(USAGE_EVENTS) as UsageKey[]).map((k) => [k, { value: cur(USAGE_EVENTS[k]), previous: prev(USAGE_EVENTS[k]) }]),
  ) as Usage;
}

export type TopProduct = { id: number; name: string; brand: string; imgUrl: string | null; count: number };

/** Most accessed products in the period (page views + QR scans). */
export async function getTopProducts(scope: Prisma.ProductWhereInput, days: PeriodDays, take = 5): Promise<TopProduct[]> {
  const rows = await prisma.productAnalyticsEvent.groupBy({
    by: ['productId'],
    where: {
      product: scope,
      eventType: { in: ['PRODUCT_VIEW', 'QR_SCAN'] },
      createdAt: { gte: new Date(Date.now() - days * DAY) },
    },
    _count: { _all: true },
    orderBy: { _count: { productId: 'desc' } },
    take,
  });
  if (!rows.length) return [];
  const products = await prisma.product.findMany({
    where: { id: { in: rows.map((r) => r.productId) } },
    select: { id: true, name: true, imgUrl: true, brand: { select: { name: true } } },
  });
  return rows.flatMap((r) => {
    const p = products.find((x) => x.id === r.productId);
    return p ? [{ id: p.id, name: p.name, brand: p.brand.name, imgUrl: p.imgUrl, count: r._count._all }] : [];
  });
}

// ---------------------------------------------------------------- catalog (products, content)
export type CatalogStats = {
  products: number;
  published: number;
  drafts: number;
  manuals: number;
  activeQr: number;
  /** average content completion of the products (0–100) */
  avgCompletion: number;
  /** share of products that have each kind of content (0–100) */
  coverage: { key: StepKey; label: string; percent: number }[];
  /** products with the least content, to complete first */
  toComplete: { id: number; name: string; brand: string; completion: number; missing: string[] }[];
};

export async function getCatalogStats(scope: Prisma.ProductWhereInput): Promise<CatalogStats> {
  const [rows, manuals, activeQr] = await Promise.all([
    prisma.product.findMany({
      where: scope,
      select: {
        id: true, name: true, imgUrl: true, status: true, updatedAt: true,
        brand: { select: { name: true } },
        _count: { select: COUNT_SELECT },
      },
    }),
    prisma.manual.count({ where: { isActive: true, product: scope } }),
    prisma.productQrCode.count({ where: { isActive: true, product: scope } }),
  ]);

  const items = rows.map((p) => {
    const progress = computeProgress(stepsFromCounts(p.imgUrl, p._count), p.updatedAt);
    return { p, progress };
  });

  const keys = Object.keys(STEP_KEY_LABELS) as StepKey[];
  const pct = (n: number) => (rows.length ? Math.round((n / rows.length) * 100) : 0);

  return {
    products: rows.length,
    published: rows.filter((r) => r.status === 'PUBLISHED').length,
    drafts: rows.filter((r) => r.status !== 'PUBLISHED').length,
    manuals,
    activeQr,
    avgCompletion: rows.length ? Math.round(items.reduce((s, i) => s + i.progress.completion, 0) / rows.length) : 0,
    coverage: keys.map((key) => ({
      key,
      label: STEP_KEY_LABELS[key],
      percent: pct(items.filter((i) => i.progress.steps[key]).length),
    })),
    toComplete: items
      .filter((i) => i.progress.completion < 100)
      .sort((a, b) => a.progress.completion - b.progress.completion)
      .slice(0, 5)
      .map(({ p, progress }) => ({
        id: p.id,
        name: p.name,
        brand: p.brand.name,
        completion: progress.completion,
        missing: missingSteps(progress.steps),
      })),
  };
}

/** % change between two periods (null when there is nothing to compare with). */
export function change(m: UsageMetric): number | null {
  if (!m.previous) return null;
  return Math.round(((m.value - m.previous) / m.previous) * 100);
}

// ---------------------------------------------------------------- scope (company / brand filters)
type ScopeUser = { id: number; systemRole: string };

export type ResolvedScope = {
  companies: { id: number; name: string; logoUrl: string | null }[];
  /** null = every company (only when allowAll and nothing is picked) */
  company: { id: number; name: string; logoUrl: string | null } | null;
  brands: { id: number; name: string; imgUrl: string | null; isActive: boolean; products: number }[];
  brand: { id: number; name: string } | null;
  scope: Prisma.ProductWhereInput;
};

/**
 * Company + brand filters of the panel pages, limited to what the user can see (loadAccess):
 * admins see every company, members only theirs and only their brands.
 * `allowAll`: no company picked = every visible company (the indicators page); otherwise the first one.
 */
export async function resolveScope(
  user: ScopeUser,
  params: { empresa?: string; marca?: string },
  { allowAll = false }: { allowAll?: boolean } = {},
): Promise<ResolvedScope | null> {
  const isAdmin = user.systemRole === 'ADMIN';
  const companies = await prisma.company.findMany({
    where: isAdmin ? { isActive: true } : { isActive: true, userCompanies: { some: { userId: user.id } } },
    select: { id: true, name: true, logoUrl: true },
    orderBy: { name: 'asc' },
  });
  if (!companies.length) return null;

  const picked = companies.find((c) => String(c.id) === params.empresa) ?? null;
  const company = picked ?? (allowAll ? null : companies[0]);

  const access = await loadAccess(user);
  const accessBrand = (access.scope as { brand?: Prisma.BrandWhereInput }).brand ?? {};
  const brandScope: Prisma.BrandWhereInput = {
    ...accessBrand,
    companyId: company ? company.id : { in: companies.map((c) => c.id) },
  };
  const rows = await prisma.brand.findMany({
    where: brandScope,
    select: { id: true, name: true, imgUrl: true, isActive: true, _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  const brands = rows.map((b) => ({ id: b.id, name: b.name, imgUrl: b.imgUrl, isActive: b.isActive, products: b._count.products }));
  const brand = brands.find((b) => String(b.id) === params.marca) ?? null;

  return {
    companies,
    company,
    brands,
    brand: brand ? { id: brand.id, name: brand.name } : null,
    scope: brand ? { brandId: brand.id } : { brand: brandScope },
  };
}

// ---------------------------------------------------------------- usage per day (indicators chart)
export type DailyUsage = { date: string } & Record<'qrScans' | 'views' | 'manualViews' | 'downloads', number>;

const DAILY_EVENTS: Record<EventType, keyof Omit<DailyUsage, 'date'> | null> = {
  QR_SCAN: 'qrScans',
  PRODUCT_VIEW: 'views',
  MANUAL_VIEW: 'manualViews',
  MANUAL_DOWNLOAD: 'downloads',
  LANDING_PAGE_VIEW: null,
  GALLERY_VIEW: null,
  MODEL_3D_VIEW: null,
};

const TZ = 'America/Sao_Paulo';
const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });

/** One row per day of the period (Brasília time), zeros included, oldest first. */
export async function getDailyUsage(scope: Prisma.ProductWhereInput, days: PeriodDays): Promise<DailyUsage[]> {
  const start = new Date(Date.now() - days * DAY);
  const ids = (await prisma.product.findMany({ where: scope, select: { id: true } })).map((p) => p.id);

  const byDay = new Map<string, DailyUsage>();
  for (let i = days - 1; i >= 0; i--) {
    const date = dayKey.format(new Date(Date.now() - i * DAY));
    byDay.set(date, { date, qrScans: 0, views: 0, manualViews: 0, downloads: 0 });
  }
  if (!ids.length) return [...byDay.values()];

  // grouped in the database by local day (createdAt is stored in UTC)
  const rows = await prisma.$queryRaw<{ day: Date; type: EventType; n: bigint }[]>`
    SELECT (("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TZ})::date AS day, "eventType" AS type, COUNT(*) AS n
    FROM product_analytics_events
    WHERE "productId" = ANY(${ids}) AND "createdAt" >= ${start}
    GROUP BY 1, 2`;

  for (const r of rows) {
    const key = DAILY_EVENTS[r.type];
    const date = r.day.toISOString().slice(0, 10);
    const row = byDay.get(date);
    if (key && row) row[key] += Number(r.n);
  }
  return [...byDay.values()];
}
