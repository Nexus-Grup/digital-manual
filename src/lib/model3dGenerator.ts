import 'server-only';
import { Client, handle_file } from '@gradio/client';
import { HttpError } from '@/lib/companyAccess';

/**
 * Image-to-3D with TRELLIS (Microsoft, open source) running on a free Hugging Face Space.
 * Same flow as the Space UI: open a session, preprocess the photo (removes the background),
 * then generate the textured mesh and export it as GLB.
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

type GradioFile = { url?: string | null; path?: string | null };

function token(): `hf_${string}` | undefined {
  const t = process.env.HF_TOKEN?.trim();
  return t?.startsWith('hf_') ? (t as `hf_${string}`) : undefined;
}

/** Maps the Space errors to messages the panel can show. */
function toHttpError(err: unknown): HttpError {
  const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : '';
  if (/quota/i.test(msg)) {
    return new HttpError(429, 'The free 3D generation quota for today is used up. Try again later.');
  }
  if (/sleeping|building|paused|not found|runtime_error/i.test(msg)) {
    return new HttpError(503, 'The 3D generation service is unavailable right now. Try again in a few minutes.');
  }
  console.error('3D generation failed', err);
  return new HttpError(502, 'Could not generate the 3D model from this image. Try another photo.');
}

/** Generates a textured GLB from a public image URL. Takes about 1–2 minutes. */
export async function generateGlbFromImage(imageUrl: string): Promise<Uint8Array> {
  const hfToken = token();
  let fileUrl: string | null | undefined;

  try {
    const client = await Client.connect(SPACE, hfToken ? { token: hfToken } : undefined);
    await client.predict('/start_session', {});

    const pre = await client.predict('/preprocess_image', { image: handle_file(imageUrl) });
    const image = (pre.data as unknown[])[0];

    const g = GENERATION;
    const result = await client.predict('/generate_and_extract_glb', [
      image, [], false, g.seed, g.ssGuidance, g.ssSteps, g.slatGuidance, g.slatSteps,
      g.multiImageAlgo, g.meshSimplify, g.textureSize,
    ]);
    // returns [preview video, extracted GLB, download GLB]
    const data = result.data as (GradioFile | null)[];
    fileUrl = data[2]?.url ?? data[1]?.url;
  } catch (err) {
    throw toHttpError(err);
  }

  if (!fileUrl) throw new HttpError(502, 'The 3D service returned no model. Try again.');

  const res = await fetch(fileUrl, {
    headers: hfToken ? { Authorization: `Bearer ${hfToken}` } : undefined,
    cache: 'no-store',
  });
  if (!res.ok) throw new HttpError(502, 'Could not download the generated 3D model. Try again.');
  return new Uint8Array(await res.arrayBuffer());
}
