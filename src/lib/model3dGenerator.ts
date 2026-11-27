import 'server-only';
import { Client, handle_file } from '@gradio/client';
import { HttpError } from '@/lib/companyAccess';

/**
 * Image-to-3D with TRELLIS (Microsoft, open source) running on a free Hugging Face Space.
 * Same flow as the Space UI: open a session, preprocess the photos (removes the background),
 * then generate the textured mesh and export it as GLB.
 *
 * Several photos of the same product (front, sides, back) go through TRELLIS multi-image mode, which
 * fills in the sides the main photo does not show. Close-ups of a detail confuse it: the panel lets
 * the user leave those out.
 *
 * HF_TOKEN (free account, https://huggingface.co/settings/tokens, "Read" scope) gives a separate
 * daily GPU quota; without it the anonymous quota runs out after ~1 generation per day.
 */
const SPACE = process.env.MODEL3D_SPACE ?? 'trellis-community/TRELLIS';

// Space defaults (generate_and_extract_glb), positional because one input has no name
const GENERATION = {
  seed: 0,
  ssGuidance: 7.5,
  ssSteps: 12,
  slatGuidance: 3,
  slatSteps: 12,
  multiImageAlgo: 'stochastic',
  meshSimplify: 0.95, // keep 5% of the faces: small file, still smooth
  textureSize: 1024,
};

/** TRELLIS multi-image mode works with a handful of views; more only slows it down. */
export const MAX_MODEL_IMAGES = 8;

type GradioFile = { url?: string | null; path?: string | null };
type GalleryItem = { image: unknown; caption: string | null };

function token(): `hf_${string}` | undefined {
  const t = process.env.HF_TOKEN?.trim();
  return t?.startsWith('hf_') ? (t as `hf_${string}`) : undefined;
}

/** Maps the Space errors to messages the panel can show. */
function toHttpError(err: unknown): HttpError {
  const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : '';
  if (/quota/i.test(msg)) {
    return new HttpError(429, 'A cota gratuita de geração 3D de hoje acabou. Tente de novo mais tarde.');
  }
  if (/sleeping|building|paused|not found|runtime_error/i.test(msg)) {
    return new HttpError(503, 'O serviço de geração 3D está indisponível agora. Tente de novo em alguns minutos.');
  }
  console.error('3D generation failed', err);
  return new HttpError(502, 'Não foi possível gerar o modelo 3D a partir desta imagem. Tente outra foto.');
}

/**
 * Generates a textured GLB from public image URLs of the same product (the first one is the main view).
 * One image: single-image mode; two or more: multi-image mode. Takes about 1–3 minutes.
 */
export async function generateGlbFromImages(imageUrls: string[]): Promise<Uint8Array> {
  const urls = imageUrls.slice(0, MAX_MODEL_IMAGES);
  if (urls.length === 0) throw new HttpError(400, 'Envie a imagem principal primeiro');
  const hfToken = token();
  let fileUrl: string | null | undefined;

  try {
    const client = await Client.connect(SPACE, hfToken ? { token: hfToken } : undefined);
    await client.predict('/start_session', {});

    let image: unknown;
    let multiimages: GalleryItem[] = [];
    if (urls.length === 1) {
      const pre = await client.predict('/preprocess_image', { image: handle_file(urls[0]) });
      image = (pre.data as unknown[])[0];
    } else {
      const pre = await client.predict('/preprocess_images', {
        images: urls.map((url) => ({ image: handle_file(url), caption: null })),
      });
      multiimages = (pre.data as GalleryItem[][])[0];
      if (!multiimages?.length) throw new Error('runtime_error: preprocess_images returned no images');
      image = multiimages[0].image; // ignored in multi-image mode, but the input expects a value
    }

    const g = GENERATION;
    const result = await client.predict('/generate_and_extract_glb', [
      image, multiimages, multiimages.length > 1, g.seed, g.ssGuidance, g.ssSteps, g.slatGuidance, g.slatSteps,
      g.multiImageAlgo, g.meshSimplify, g.textureSize,
    ]);
    // returns [preview video, extracted GLB, download GLB]
    const data = result.data as (GradioFile | null)[];
    fileUrl = data[2]?.url ?? data[1]?.url;
  } catch (err) {
    throw toHttpError(err);
  }

  if (!fileUrl) throw new HttpError(502, 'O serviço de 3D não retornou nenhum modelo. Tente de novo.');

  const res = await fetch(fileUrl, {
    headers: hfToken ? { Authorization: `Bearer ${hfToken}` } : undefined,
    cache: 'no-store',
  });
  if (!res.ok) throw new HttpError(502, 'Não foi possível baixar o modelo 3D gerado. Tente de novo.');
  return new Uint8Array(await res.arrayBuffer());
}
