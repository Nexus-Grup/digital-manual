import { cacheLife } from 'next/cache';
import { getPublicProduct } from './publicProduct';

export type InformationFeatureIcon = 'light' | 'bolt' | 'gauge' | 'reverse';

// Formato que a página e os componentes já esperam (agora preenchido pelo banco).
export type InformationFeature = {
  id: number;
  icon: InformationFeatureIcon;
  text: string;
};

// The first image is the main (360°) view.
export type GalleryImage = {
  id: number;
  /** null = placeholder until the real photo is added */
  imageUrl: string | null;
  alt: string;
  /** shows the 360° seal next to the image */
  is360?: boolean;
};

export type ProductInformation = {
  title: string;
  productName: string;
  description: string;
  gallery: GalleryImage[];
  features: InformationFeature[];
};

// O wizard oferece 10 ícones; a lista da página só desenha 4. Os que não têm par usam 'light'.
// Para mostrar todos, o InfoFeatureList precisa aceitar os nomes do wizard.
const ICON_MAP: Record<string, InformationFeatureIcon> = {
  lightbulb: 'light',
  zap: 'bolt',
  battery: 'gauge',
  clock: 'gauge',
  ruler: 'gauge',
  thermometer: 'gauge',
};

export async function getInformation(productId: string): Promise<ProductInformation | null> {
  'use cache';
  cacheLife('minutes'); // use 'hours' in production

  try {
    const p = await getPublicProduct(productId);
    if (!p) return null;

    // imagem principal primeiro, depois a galeria (sem repetir)
    const urls = [...new Set([p.imgUrl, ...p.gallery].filter((u): u is string => !!u))];
    const gallery: GalleryImage[] = urls.length
      ? urls.map((imageUrl, i) => ({
          id: i + 1,
          imageUrl,
          alt: i === 0 ? p.name : `${p.name} (imagem ${i + 1})`,
          is360: i === 0 && !!p.model3dUrl, // selo 360° quando existe modelo 3D
        }))
      : [{ id: 1, imageUrl: null, alt: p.name }];

    const features: InformationFeature[] = (p.information?.cards ?? []).map((c) => ({
      id: c.id,
      icon: ICON_MAP[c.icon ?? ''] ?? 'light',
      text: c.description ? `${c.title}: ${c.description}` : c.title,
    }));

    return {
      title: p.information?.title ?? p.name,
      productName: p.name,
      description: p.information?.description ?? p.description ?? '',
      gallery,
      features,
    };
  } catch (err) {
    console.error('getInformation error:', err);
    return null;
  }
}