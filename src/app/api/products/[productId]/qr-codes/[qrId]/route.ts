import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { HttpError, handleError, parseId, readBody } from '@/lib/companyAccess';
import { requireProductAccess } from '@/lib/productAccess';
import { qrPatchInput } from '@/lib/productSchemas';

type Ctx = { params: Promise<{ productId: string; qrId: string }> };

async function load(params: Ctx['params']) {
  const p = await params;
  const productId = parseId(p.productId);
  const qrId = parseId(p.qrId);
  await requireProductAccess(productId, 'edit');
  // o QR precisa ser deste produto
  const qr = await prisma.productQrCode.findFirst({ where: { id: qrId, productId }, select: { id: true } });
  if (!qr) throw new HttpError(404, 'QR Code não encontrado');
  return qr.id;
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const id = await load(params);
    const { isActive } = await readBody(req, qrPatchInput);
    await prisma.productQrCode.update({ where: { id }, data: { isActive } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const id = await load(params);
    await prisma.productQrCode.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}