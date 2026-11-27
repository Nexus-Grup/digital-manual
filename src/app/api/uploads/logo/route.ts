import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { HttpError, handleError, requireUser } from '@/lib/companyAccess';
import { LOGO_BUCKET } from '@/lib/logoUrl';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const MAX_SIZE = 2 * 1024 * 1024;

const TYPES: Record<string, { ext: string; valid: (b: Buffer) => boolean }> = {
  'image/png': { ext: 'png', valid: (b) => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) },
  'image/jpeg': { ext: 'jpg', valid: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/svg+xml': {
    ext: 'svg',
    valid: (b) => {
      const text = b.toString('utf8');
      return text.includes('<svg') && !/<script|<foreignObject|\son\w+\s*=|javascript:/i.test(text);
    },
  },
};

export async function POST(req: Request) {
  try {
    await requireUser();
    const file = (await req.formData()).get('file');
    if (!(file instanceof File)) throw new HttpError(400, 'Nenhum arquivo enviado');
    if (file.size > MAX_SIZE) throw new HttpError(400, 'O logo pode ter até 2 MB');

    const kind = TYPES[file.type];
    if (!kind) throw new HttpError(400, 'Use um arquivo PNG, JPG ou SVG');

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!kind.valid(buffer)) throw new HttpError(400, 'O conteúdo do arquivo não corresponde ao tipo');

    // Nome aleatório: ninguém adivinha a URL nem sobrescreve o arquivo de outro
    const objectPath = `companies/${randomUUID()}.${kind.ext}`;

    const supabase = getSupabaseAdmin();

    const { error } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(objectPath, buffer, {
        contentType: file.type,
        cacheControl: '31536000', // 1 ano (o nome nunca se repete)
        upsert: false,
      });

    if (error) {
      console.error('Logo upload failed', error);
      throw new HttpError(500, 'Não foi possível enviar o logo');
    }

    const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(objectPath);

    return NextResponse.json({ url: data.publicUrl }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}