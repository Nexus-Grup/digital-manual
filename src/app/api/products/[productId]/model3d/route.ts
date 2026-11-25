import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { HttpError, handleError, parseId } from '@/lib/companyAccess';
import { assertOwnMedia, requireProductAccess } from '@/lib/productAccess';
import { FILE_KINDS } from '@/lib/productFiles';
import { PRODUCT_BUCKET } from '@/lib/productMedia';
import { generateGlbFromImage } from '@/lib/model3dGenerator';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type Ctx = { params: Promise<{ productId: string }> };

// image-to-3D takes ~1–2 minutes on the free GPU
export const maxDuration = 300;

const GLB_MAGIC = [0x67, 0x6c, 0x54, 0x46]; // "glTF"

// POST { imageUrl } -> generates a .glb from the product photo and stores it like an upload.
// Returns { url }; the wizard saves it with the rest of the media (PUT /media), as with uploads.
export async function POST(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');

    const { imageUrl } = (await req.json().catch(() => null)) ?? {};
    if (typeof imageUrl !== 'string' || !imageUrl) throw new HttpError(400, 'Upload the main image first');
    // only this product's own uploads: nothing else is sent to the external service
    assertOwnMedia(productId, [imageUrl]);

    const glb = await generateGlbFromImage(imageUrl);
    if (!GLB_MAGIC.every((b, i) => glb[i] === b)) throw new HttpError(502, 'The 3D service returned an invalid file. Try again.');
    if (glb.byteLength > FILE_KINDS.model.maxSize) throw new HttpError(502, 'The generated 3D model is too large.');

    const path = `products/${productId}/${randomUUID()}-generated-3d.glb`;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(path, glb, {
      contentType: 'model/gltf-binary',
      cacheControl: '31536000', // the name never repeats
      upsert: false,
    });
    if (error) {
      console.error('3D model upload failed', error);
      throw new HttpError(500, 'Could not store the 3D model');
    }

    const url = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl;
    return NextResponse.json({ url }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}
