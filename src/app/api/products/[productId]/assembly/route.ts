import { NextResponse } from 'next/server';
import type { ProductAssembly } from '@/_data/getAssembly';

const DESCRIPTION =
  'Uma ferramenta compacta, leve (1,7 kg) e potente (750 W), projetada para perfurações rápidas e precisas em concreto, madeira e metal. Com mandril de 1/2" (13 mm), velocidade variável e sistema reversível, oferece alto desempenho, controle e durabilidade para uso profissional ou doméstico exigente.';

// Mock data (same pattern as the videos/audios routes) until the Assembly tables are populated.
const db: Record<string, ProductAssembly> = {
  '8': {
    title: 'Instruções de montagem',
    productName: 'Parafusadeira GRT 120-CLI',
    description: DESCRIPTION,
    steps: [
      {
        id: 1,
        label: 'A',
        title: 'Encaixar a broca',
        imageUrl: null,
        alt: 'Passo A: insira a broca no mandril e gire o mandril para apertar.',
      },
      {
        id: 2,
        label: 'B',
        title: 'Escolher o sentido de rotação',
        imageUrl: null,
        alt: 'Passo B: use o seletor para escolher o sentido de rotação, para apertar ou soltar.',
      },
    ],
  },
};

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/products/[productId]/assembly'>,
) {
  const { productId } = await ctx.params;
  return NextResponse.json({ assembly: db[productId] ?? null });
}
