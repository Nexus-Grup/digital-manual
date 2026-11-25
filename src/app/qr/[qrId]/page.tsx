import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

// Com Cache Components ligado, esta rota le o banco e faz redirect, entao ela precisa ser bloqueante.
export const instant = false;

// Rota publica (fora do user-panel): /qr/a1b2c3d4e5f6  ->  /products/{productId}
export default async function QrRedirectPage({ params }: { params: Promise<{ qrId: string }> }) {
  const { qrId } = await params;

  // o token e gerado com randomBytes(6).toString('hex') = 12 caracteres hexadecimais
  if (!/^[0-9a-f]{12}$/.test(qrId)) notFound();

  const qr = await prisma.productQrCode.findFirst({
    where: { url: { endsWith: `/qr/${qrId}` }, isActive: true },
    select: { productId: true },
  });

  // token inexistente ou QR desativado
  if (!qr) notFound();

  redirect(`/products/${qr.productId}`);
}