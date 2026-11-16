import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/products/[productId]/audios'>,
) {
  const { productId } = await ctx.params;

const db: Record<string, { url: string; productName: string }> = {
'8': { url: '/audios/audio-test.mp3', productName: 'Parafusadeira GSR 120-LI' },
'9': { url: '/audios/audio-test.mp3', productName: 'Lixadeira' },
};

  return NextResponse.json({ audio: db[productId] ?? null });
}