import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { HttpError, handleError, requireUser } from '@/lib/companyAccess';

const MAX_SIZE = 2 * 1024 * 1024;

const TYPES: Record<string, { ext: string; valid: (b: Buffer) => boolean }> = {
  'image/png': { ext: 'png', valid: (b) => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) },
  'image/jpeg': { ext: 'jpg', valid: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/svg+xml': {
    ext: 'svg',
    valid: (b) => {
      const text = b.toString('utf8');
      return text.includes('<svg') && !/<script|\son\w+\s*=|javascript:/i.test(text);
    },
  },
};

export async function POST(req: Request) {
  try {
    await requireUser();
    const file = (await req.formData()).get('file');
    if (!(file instanceof File)) throw new HttpError(400, 'No file sent');
    if (file.size > MAX_SIZE) throw new HttpError(400, 'Logo must be up to 2 MB');

    const kind = TYPES[file.type];
    if (!kind) throw new HttpError(400, 'Use a PNG, JPG or SVG file');

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!kind.valid(buffer)) throw new HttpError(400, 'The file content does not match its type');

    const dir = path.join(process.cwd(), 'public', 'uploads', 'companies');
    await mkdir(dir, { recursive: true });
    const name = `${randomUUID()}.${kind.ext}`;
    await writeFile(path.join(dir, name), buffer);

    return NextResponse.json({ url: `/uploads/companies/${name}` }, { status: 201 });
  } catch (e) {
    return handleError(e);
  }
}