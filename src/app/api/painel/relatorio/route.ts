import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { COUNT_SELECT, computeProgress, stepsFromCounts } from '@/lib/productCompletion';
import { missingSteps } from '@/_lib/productConstants';
import {
  getCatalogStats, getDailyUsage, getTopProducts, getUsage, resolveScope, toPeriod,
} from '@/lib/panelOverview';

// GET /api/painel/relatorio?escopo=empresa|plataforma&empresa=&marca=&periodo=
// Report of the panel overview / indicators as CSV (opens in Excel and Google Sheets).
// "plataforma" = every company (super user only); "empresa" = what the user can see.

const SEP = ';'; // pt-BR spreadsheets use ";" (the comma is the decimal separator)

const cell = (v: string | number) => {
  const s = String(v);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const line = (...cells: (string | number)[]) => cells.map(cell).join(SEP);

const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'relatorio';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Faça login para baixar o relatório' }, { status: 401 });

  const q = new URL(req.url).searchParams;
  const days = toPeriod(q.get('periodo'));
  const platform = q.get('escopo') === 'plataforma';
  if (platform && user.systemRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Relatório disponível só para administradores' }, { status: 403 });
  }

  let scope: Prisma.ProductWhereInput = {};
  let title = 'Plataforma Manual digital';
  if (!platform) {
    const resolved = await resolveScope(
      user,
      { empresa: q.get('empresa') ?? undefined, marca: q.get('marca') ?? undefined },
      { allowAll: q.get('todas') === '1' },
    );
    if (!resolved) return NextResponse.json({ error: 'Você não faz parte de nenhuma empresa' }, { status: 404 });
    scope = resolved.scope;
    title = [resolved.company?.name ?? 'Todas as empresas', resolved.brand?.name].filter(Boolean).join(' - ');
  }

  const [stats, usage, daily, top, products] = await Promise.all([
    getCatalogStats(scope),
    getUsage(scope, days),
    getDailyUsage(scope, days),
    getTopProducts(scope, days, 50),
    prisma.product.findMany({
      where: scope,
      orderBy: { name: 'asc' },
      select: {
        id: true, name: true, code: true, status: true, imgUrl: true, updatedAt: true,
        brand: { select: { name: true } },
        _count: { select: COUNT_SELECT },
      },
    }),
  ]);

  const generated = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const out: string[] = [
    line('Relatório', title),
    line('Período', `Últimos ${days} dias`),
    line('Gerado em', generated),
    '',
    line('Catálogo', 'Valor'),
    line('Produtos', stats.products),
    line('Publicados', stats.published),
    line('Rascunhos', stats.drafts),
    line('Manuais (PDF)', stats.manuals),
    line('QR Codes ativos', stats.activeQr),
    line('Completude média (%)', stats.avgCompletion),
    '',
    line('Uso', `Últimos ${days} dias`, `${days} dias anteriores`),
    line('Leituras de QR Code', usage.qrScans.value, usage.qrScans.previous),
    line('Visualizações', usage.views.value, usage.views.previous),
    line('Acessos à página inicial', usage.landingViews.value, usage.landingViews.previous),
    line('Acessos ao manual', usage.manualViews.value, usage.manualViews.previous),
    line('Downloads do PDF', usage.downloads.value, usage.downloads.previous),
    '',
    line('Uso por dia', 'Leituras de QR Code', 'Visualizações', 'Acessos ao manual', 'Downloads do PDF'),
    ...daily.map((d) => line(d.date.split('-').reverse().join('/'), d.qrScans, d.views, d.manualViews, d.downloads)),
    '',
    line('Produtos mais acessados', 'Marca', 'Acessos (visualizações + QR)'),
    ...top.map((p) => line(p.name, p.brand, p.count)),
    '',
    line('Produto', 'Código', 'Marca', 'Status', 'Completude (%)', 'Falta'),
    ...products.map((p) => {
      const progress = computeProgress(stepsFromCounts(p.imgUrl, p._count), p.updatedAt);
      return line(
        p.name, p.code, p.brand.name,
        p.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho',
        progress.completion,
        missingSteps(progress.steps).join(', ') || '-',
      );
    }),
  ];

  const date = new Date().toISOString().slice(0, 10);
  // BOM so Excel reads the file as UTF-8 (accents)
  return new Response(`﻿${out.join('\r\n')}\r\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="relatorio-${slug(title)}-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
