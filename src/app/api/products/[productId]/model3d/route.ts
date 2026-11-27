import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { HttpError, handleError, parseId } from '@/lib/companyAccess';
import { assertOwnMedia, requireProductAccess } from '@/lib/productAccess';
import { FILE_KINDS } from '@/lib/productFiles';
import { PRODUCT_BUCKET } from '@/lib/productMedia';
import { MAX_MODEL_IMAGES, generateGlbFromImages } from '@/lib/model3dGenerator';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type Ctx = { params: Promise<{ productId: string }> };

// image-to-3D takes ~1–3 minutes on the free GPU
export const maxDuration = 300;

const GLB_MAGIC = [0x67, 0x6c, 0x54, 0x46]; // "glTF"

// POST { imageUrls } -> generates a .glb from the product photos (main view first) and stores it like
// an upload. { imageUrl } (single photo) is still accepted.
// Returns { url }; the wizard saves it with the rest of the media (PUT /media), as with uploads.
export async function POST(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');

    const body = (await req.json().catch(() => null)) ?? {};
    const list: unknown[] = Array.isArray(body.imageUrls) ? body.imageUrls : [body.imageUrl];
    const imageUrls = [...new Set(list.filter((u): u is string => typeof u === 'string' && u.length > 0))];
    if (imageUrls.length === 0) throw new HttpError(400, 'Envie a imagem principal primeiro');
    if (imageUrls.length > MAX_MODEL_IMAGES) throw new HttpError(400, `Use até ${MAX_MODEL_IMAGES} imagens`);
    // only this product's own uploads: nothing else is sent to the external service
    assertOwnMedia(productId, imageUrls);

    const glb = await generateGlbFromImages(imageUrls);
    if (!GLB_MAGIC.every((b, i) => glb[i] === b)) throw new HttpError(502, 'O serviço de 3D retornou um arquivo inválido. Tente de novo.');
    if (glb.byteLength > FILE_KINDS.model.maxSize) throw new HttpError(502, 'O modelo 3D gerado ficou grande demais.');

    const path = `products/${productId}/${randomUUID()}-generated-3d.glb`;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(path, glb, {
      contentType: 'model/gltf-binary',
      cacheControl: '31536000', // the name never repeats
      upsert: false,
    });
    if (error) {
      console.error('3D model upload failed', error);
      throw new HttpError(500, 'Não foi possível salvar o modelo 3D');
    }

    const url = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl;
    return NextResponse.json({ url }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
