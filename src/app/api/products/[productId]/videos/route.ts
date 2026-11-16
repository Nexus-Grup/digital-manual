import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/products/[productId]/videos'>,
) {
  const { productId } = await ctx.params;

  const db: Record<string, { url: string; title: string }[]> = {
    '8': [
      { url: 'https://www.youtube.com/watch?v=2pYeFGOA-6M', title: 'Vem conhecer a nossa família de serras copos ' },
      { url: 'https://www.youtube.com/watch?v=2pYeFGOA-6M', title: 'Mesma potência que uma chave de impacto a cabo?!' },
      { url: 'https://www.youtube.com/watch?v=2pYeFGOA-6M', title: 'Mesma potência que uma chave de impacto a cabo?!' },
      { url: 'https://www.youtube.com/watch?v=2pYeFGOA-6M', title: 'Mesma potência que uma chave de impacto a cabo?!' },
    ],
    '9': [
      { url: 'https://www.youtube.com/watch?v=2pYeFGOA-6M', title: 'Você já conhece a nova lixadeira da Bosch?' },
    ],
  };

  return NextResponse.json({ videos: db[productId] ?? [] });
}