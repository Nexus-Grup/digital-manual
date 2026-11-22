import { NextResponse } from 'next/server';
import type { ProductInformation } from '@/_data/getInformation';

const DESCRIPTION =
  'Uma ferramenta compacta, leve (1,7 kg) e potente (750 W), projetada para perfurações rápidas e precisas em concreto, madeira e metal. Com mandril de 1/2" (13 mm), velocidade variável e sistema reversível, oferece alto desempenho, controle e durabilidade para uso profissional ou doméstico exigente.';

// Mock data (same pattern as the videos/audios routes) until the Information tables are populated.
const db: Record<string, ProductInformation> = {
  '8': {
    title: 'Descrição da ferramenta',
    productName: 'Parafusadeira GRT 120-CLI',
    description: DESCRIPTION,
    // fill imageUrl (e.g. '/products/8/front.webp') when the photos are added
    gallery: [
      { id: 1, imageUrl: null, alt: 'Parafusadeira GRT 120-CLI azul com bateria encaixada, vista 360°', is360: true },
      { id: 2, imageUrl: null, alt: 'Parafusadeira vista de lado' },
      { id: 3, imageUrl: null, alt: 'Detalhe do mandril de 1/2" (13 mm)' },
      { id: 4, imageUrl: null, alt: 'Detalhe da luz de LED e do gatilho' },
      { id: 5, imageUrl: null, alt: 'Bateria e carregador' },
    ],
    features: [
      { id: 1, icon: 'light', text: 'Luz de LED, para trabalhar em áreas menos iluminadas.' },
      { id: 2, icon: 'bolt', text: 'Bivolt 127v - 220v. Pode ficar ligado até 18 horas.' },
      { id: 3, icon: 'gauge', text: 'Velocidade variável no gatilho, para começar o furo com precisão.' },
      { id: 4, icon: 'reverse', text: 'Sistema reversível, para apertar e soltar parafusos.' },
    ],
  },
};

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/products/[productId]/information'>,
) {
  const { productId } = await ctx.params;
  return NextResponse.json({ information: db[productId] ?? null });
}
