import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { HttpError, handleError, parseId } from '@/lib/companyAccess';
import { requireProductAccess } from '@/lib/productAccess';
import { FILE_KINDS, isFileKind, ruleForName } from '@/lib/productFiles';
import { PRODUCT_BUCKET } from '@/lib/productMedia';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type Ctx = { params: Promise<{ productId: string }> };

// POST { kind, fileName, size }  ->  URL assinada para o NAVEGADOR enviar o arquivo direto ao Supabase.
// O arquivo não passa pela Vercel, então o limite de 4,5 MB não vale.
export async function POST(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');

    const body = await req.json().catch(() => null);
    const { kind, fileName, size } = body ?? {};
    if (!isFileKind(kind) || typeof fileName !== 'string' || !Number.isFinite(size) || size <= 0) {
      throw new HttpError(400, 'Invalid file');
    }

    const rule = ruleForName(kind, fileName);
    if (!rule) throw new HttpError(400, 'This file type is not supported');
    const max = FILE_KINDS[kind].maxSize;
    if (size > max) throw new HttpError(400, `The file must be up to ${Math.round(max / 1024 / 1024)} MB`);

    const safeName = fileName
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
    const path = `products/${productId}/${randomUUID()}${safeName ? `-${safeName}` : ''}.${rule.ext}`;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(PRODUCT_BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
      console.error('createSignedUploadUrl failed', error);
      throw new HttpError(500, 'Could not start the upload');
    }

    return NextResponse.json({
      bucket: PRODUCT_BUCKET,
      path,
      token: data.token,
      publicUrl: supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl,
    });
  } catch (e) {
    return handleError(e);
  }
}