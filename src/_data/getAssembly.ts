import { cacheLife } from 'next/cache';
import { getPublicProduct } from '@/_data/publicProduct';

export type AssemblyStepItem = {
  id: number;
  /** step number printed on the drawing (1, 2...) */
  label: string;
  /** title as saved (may start with the step, e.g. "1 - ..." or the old "A - ...") */
  title: string;
  /** title without the leading step number/letter, for the step cards */
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

// Older guides were saved with letters in the title ("A - ..."): both forms are removed from the name.
const legacyLetter = (i: number) => (i < 26 ? String.fromCharCode(65 + i) : null);

// "1 - Instalação da bateria" / "A - Instalação da bateria" -> "Instalação da bateria" (the number is on the card)
const stripStepPrefix = (title: string, i: number) => {
  const prefixes = [String(i + 1), legacyLetter(i)].filter(Boolean).join('|');
  return title.replace(new RegExp(`^\\s*(?:${prefixes})\\s*[-–—:.)]\\s*`, 'i'), '').trim() || title;
};

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
        label: String(i + 1),
        title: s.title,
        name: stripStepPrefix(s.title, i),
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