import { NextResponse } from 'next/server';
import { HttpError, handleError, parseId } from '@/lib/companyAccess';
import { requireProductAccess } from '@/lib/productAccess';
import { FILE_KINDS, isFileKind } from '@/lib/productFiles';
import { PRODUCT_BUCKET } from '@/lib/productMedia';
import { cutoutProductImage } from '@/lib/imageCutout';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type Ctx = { params: Promise<{ productId: string }> };

type Supabase = ReturnType<typeof getSupabaseAdmin>;

// the background removal (BiRefNet on Hugging Face) takes a few seconds, more when the Space wakes up
export const maxDuration = 90;

// Product photos (main image and gallery): background removed and cropped to the product, saved as WebP.
// If anything fails, the original upload is kept, so the upload itself never fails because of the cutout.
async function storeCutout(supabase: Supabase, path: string, originalUrl: string): Promise<{ url: string; cutout: boolean }> {
  try {
    const { data: blob, error } = await supabase.storage.from(PRODUCT_BUCKET).download(path);
    if (error || !blob) throw error ?? new Error('empty download');

    const { data, method } = await cutoutProductImage(new Uint8Array(await blob.arrayBuffer()));
    const cutPath = path.replace(/\.[^./]+$/, '') + '-cutout.webp';
    const up = await supabase.storage.from(PRODUCT_BUCKET).upload(cutPath, data, {
      contentType: 'image/webp',
      cacheControl: '31536000', // the name never repeats
      upsert: false,
    });
    if (up.error) throw up.error;

    await supabase.storage.from(PRODUCT_BUCKET).remove([path]);
    return { url: supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(cutPath).data.publicUrl, cutout: method !== 'none' };
  } catch (e) {
    console.error('Image cutout failed, keeping the original', e);
    return { url: originalUrl, cutout: false };
  }
}

// POST { kind, path, cutout? }  -> depois do envio, confere o arquivo de verdade (tipo e tamanho).
// Como o upload foi direto ao Supabase, esta é a única hora em que o servidor olha o conteúdo.
export async function POST(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');

    const { kind, path, cutout } = (await req.json().catch(() => null)) ?? {};
    if (!isFileKind(kind) || typeof path !== 'string' || !path.startsWith(`products/${productId}/`) || path.includes('..')) {
      throw new HttpError(400, 'Arquivo inválido');
    }

    const supabase = getSupabaseAdmin();
    const url = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl;

    const reject = async (message: string) => {
      await supabase.storage.from(PRODUCT_BUCKET).remove([path]); // não deixa arquivo inválido guardado
      throw new HttpError(400, message);
    };

    // só os primeiros bytes (Range): não baixa o arquivo inteiro
    const res = await fetch(url, { headers: { Range: 'bytes=0-31' }, cache: 'no-store' });
    if (!res.ok && res.status !== 206) throw new HttpError(404, 'Arquivo não encontrado. Tente enviar de novo');

    const total = Number(res.headers.get('content-range')?.split('/')[1] ?? res.headers.get('content-length'));
    if (Number.isFinite(total) && total > FILE_KINDS[kind].maxSize) return reject('O arquivo é grande demais');

    const bytes = new Uint8Array(await res.arrayBuffer());
    if (!FILE_KINDS[kind].rules.some((r) => r.valid(bytes))) return reject('O conteúdo do arquivo não corresponde ao tipo');

    if (kind === 'image' && cutout === true) {
      return NextResponse.json(await storeCutout(supabase, path, url));
    }

    return NextResponse.json({ url });
  } catch (e) {
    return handleError(e);
  }
}