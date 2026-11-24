import { cacheLife } from 'next/cache';
import { getPublicProduct } from '@/_data/publicProduct';

export type AssemblyStepItem = {
  id: number;
  /** letter printed on the drawing (A, B...) */
  label: string;
  /** title as saved (may start with the letter, e.g. "A - ...") */
  title: string;
  /** title without the leading letter, for the step cards */
  name: string;
  description: string | null;
  /** null = placeholder until the real drawing is added */
  imageUrl: string | null;
  alt: string;
};

export type ProductAssembly = {
  title: string;
  productName: string;
  description: string;
  steps: AssemblyStepItem[];
};

const letter = (i: number) => (i < 26 ? String.fromCharCode(65 + i) : String(i + 1));

// "A - Instalação da bateria" -> "Instalação da bateria" (the letter is already on the card)
const stripLetter = (title: string, label: string) =>
  title.replace(new RegExp(`^\\s*${label}\\s*[-–—:.)]\\s*`, 'i'), '').trim() || title;

export async function getAssembly(productId: string): Promise<ProductAssembly | null> {
  'use cache';
  cacheLife('minutes'); // use 'hours' in production

  try {
    const p = await getPublicProduct(productId);
    if (!p) return null;

    // um produto pode ter vários guias: mostra o de montagem (ou o primeiro que tiver passos)
    const withSteps = p.assemblies.filter((a) => a.steps.length > 0);
    const guide = withSteps.find((a) => a.type === 'ASSEMBLY_GUIDE') ?? withSteps[0];
    if (!guide) return null;

    return {
      title: guide.title,
      productName: p.name,
      description: guide.description ?? '',
      steps: guide.steps.map((s, i) => ({
        id: s.id,
        label: letter(i),
        title: s.title,
        name: stripLetter(s.title, letter(i)),
        description: s.description,
        imageUrl: s.imageUrl,
        alt: s.description ? `${s.title}. ${s.description}` : s.title,
      })),
    };
  } catch (err) {
    console.error('getAssembly error:', err);
    return null;
  }
}