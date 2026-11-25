import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, parseId } from '@/lib/companyAccess';
import { requireProductAccess } from '@/lib/productAccess';

type Ctx = { params: Promise<{ productId: string }> };

// POST: gera um novo QR Code (QR-001, QR-002...) com um endereço único /qr/{token}
export async function POST(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');

    const existing = await prisma.productQrCode.findMany({ where: { productId }, select: { value: true } });
    const max = existing.reduce((m, q) => Math.max(m, Number(q.value.replace(/\D/g, '')) || 0), 0);
    const value = `QR-${String(max + 1).padStart(3, '0')}`;

    const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
    const url = `${base}/qr/${randomBytes(6).toString('hex')}`;

    const qr = await prisma.productQrCode.create({
      data: { productId, value, url },
      select: { id: true, value: true, url: true, isActive: true, createdAt: true },
    });
    await prisma.product.update({ where: { id: productId }, data: { updatedAt: new Date() } });
    return NextResponse.json({ qr: { ...qr, createdAt: qr.createdAt.toISOString() } }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}