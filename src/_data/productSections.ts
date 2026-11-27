import { getAssembly } from '@/_data/getAssembly';
import { getManual } from '@/_data/getManual';

/** Which optional product pages have content (same rules the pages use before calling notFound()). */
export type ProductSections = {
  manual: boolean;
  assembly: boolean;
};

export async function getProductSections(productId: string): Promise<ProductSections> {
  const [manual, assembly] = await Promise.all([getManual(productId), getAssembly(productId)]);
  return {
    manual: Boolean(manual && (manual.sections.length > 0 || manual.pdfUrl)),
    assembly: Boolean(assembly && assembly.steps.length > 0),
  };
}
