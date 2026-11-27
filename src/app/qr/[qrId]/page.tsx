import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { recordEvent } from '@/lib/analytics';

// Com Cache Components ligado, esta rota le o banco e faz redirect, entao ela precisa ser bloqueante.
export const instant = false;

// Rota publica (fora do painel): /qr/a1b2c3d4e5f6  ->  /produtos/{productId}
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

  // scan counted for the panel indicators (before redirect, which throws)
  await recordEvent(qr.productId, 'QR_SCAN', 'qr');
  redirect(`/produtos/${qr.productId}`);
}