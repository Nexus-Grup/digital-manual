import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import type { ProductManual } from '@/_data/getManual';
import { parseManualPdf } from '@/lib/manual/parseManualPdf';

// Mock of the Manual table (prisma/schema.prisma) until manuals are uploaded through the panel:
// the PDF lives in public/manuals and is converted into sections automatically.
type ManualRecord = { file: string; version: string; language: string; updatedAt: string };

const db: Record<string, ManualRecord> = {
  '8': {
    file: 'manuals/furadeira-parafusadeira-trb0018.pdf',
    version: '1.0',
    language: 'Português (Brasil)',
    updatedAt: '2026-11-21',
  },
};

// Converting takes ~0.5 s, so each PDF is converted once per server process.
// In production this runs once on upload and the result is stored with the Manual record.
const converted = new Map<string, Promise<ProductManual>>();

async function convert(record: ManualRecord): Promise<ProductManual> {
  const data = await readFile(path.join(process.cwd(), 'public', record.file));
  const parsed = await parseManualPdf(new Uint8Array(data));
  return {
    title: parsed.title,
    productName: parsed.productName,
    version: record.version,
    language: record.language,
    updatedAt: record.updatedAt,
    pdfUrl: `/${record.file}`,
    sections: parsed.sections,
  };
}

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/products/[productId]/manual'>,
) {
  const { productId } = await ctx.params;
  const record = db[productId];
  if (!record) return NextResponse.json({ manual: null });

  let job = converted.get(record.file);
  if (!job) {
    job = convert(record);
    converted.set(record.file, job);
    job.catch(() => converted.delete(record.file)); // retry on the next request
  }

  try {
    return NextResponse.json({ manual: await job });
  } catch (err) {
    console.error('manual conversion failed:', record.file, err);
    return NextResponse.json({ manual: null, error: 'conversion_failed' }, { status: 500 });
  }
}
