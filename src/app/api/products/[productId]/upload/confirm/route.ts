import { NextResponse } from 'next/server';
import { HttpError, handleError, parseId } from '@/lib/companyAccess';
import { requireProductAccess } from '@/lib/productAccess';
import { FILE_KINDS, isFileKind } from '@/lib/productFiles';
import { PRODUCT_BUCKET } from '@/lib/productMedia';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type Ctx = { params: Promise<{ productId: string }> };

// POST { kind, path }  -> depois do envio, confere o arquivo de verdade (tipo e tamanho).
// Como o upload foi direto ao Supabase, esta é a única hora em que o servidor olha o conteúdo.
export async function POST(req: Request, { params }: Ctx) {
  try {
    const productId = parseId((await params).productId);
    await requireProductAccess(productId, 'edit');

    const { kind, path } = (await req.json().catch(() => null)) ?? {};
    if (!isFileKind(kind) || typeof path !== 'string' || !path.startsWith(`products/${productId}/`) || path.includes('..')) {
      throw new HttpError(400, 'Invalid file');
    }

    const supabase = getSupabaseAdmin();
    const url = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl;

    const reject = async (message: string) => {
      await supabase.storage.from(PRODUCT_BUCKET).remove([path]); // não deixa arquivo inválido guardado
      throw new HttpError(400, message);
    };

    // só os primeiros bytes (Range): não baixa o arquivo inteiro
    const res = await fetch(url, { headers: { Range: 'bytes=0-31' }, cache: 'no-store' });
    if (!res.ok && res.status !== 206) throw new HttpError(404, 'File not found. Try uploading again');

    const total = Number(res.headers.get('content-range')?.split('/')[1] ?? res.headers.get('content-length'));
    if (Number.isFinite(total) && total > FILE_KINDS[kind].maxSize) return reject('The file is too large');

    const bytes = new Uint8Array(await res.arrayBuffer());
    if (!FILE_KINDS[kind].rules.some((r) => r.valid(bytes))) return reject('The file content does not match its type');

    return NextResponse.json({ url });
  } catch (e) {
    return handleError(e);
  }
}