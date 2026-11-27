import { NextResponse } from 'next/server';
import { getPublicProduct } from '@/_data/publicProduct';
import { getAssembly } from '@/_data/getAssembly';
import { answerQuestion, suggestions } from '@/lib/assistant/answer';
import { getManualChunks } from '@/lib/assistant/manualChunks';

type Ctx = { params: Promise<{ productId: string }> };

const MAX_QUESTION = 300;

// simple per-visitor limit (in memory, per server instance): 20 questions per minute
const WINDOW_MS = 60_000;
const LIMIT = 20;
const hits = new Map<string, { count: number; reset: number }>();

function limited(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

function manualPdf(product: NonNullable<Awaited<ReturnType<typeof getPublicProduct>>>) {
  const m = product.manuals.find((x) => x.documentType === 'USER_MANUAL') ?? product.manuals[0];
  return m?.fileUrl ?? null;
}

// GET: starter questions for this product
export async function GET(_req: Request, { params }: Ctx) {
  const { productId } = await params;
  const [product, assembly] = await Promise.all([getPublicProduct(productId), getAssembly(productId)]);
  if (!product) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
  return NextResponse.json({ suggestions: suggestions(product, assembly) });
}

// POST { question } -> { paragraphs, sources }. Public (product pages are public); answers come only
// from the product's own data: sheet, highlights, description, assembly steps and the manual PDF.
export async function POST(req: Request, { params }: Ctx) {
  if (limited(req)) {
    return NextResponse.json({ error: 'Muitas perguntas seguidas. Espere um pouco e tente de novo.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const question = typeof body?.question === 'string' ? body.question.trim() : '';
  if (!question) return NextResponse.json({ error: 'Escreva sua pergunta.' }, { status: 400 });
  if (question.length > MAX_QUESTION) {
    return NextResponse.json({ error: `A pergunta pode ter até ${MAX_QUESTION} caracteres.` }, { status: 400 });
  }

  const { productId } = await params;
  const [product, assembly] = await Promise.all([getPublicProduct(productId), getAssembly(productId)]);
  if (!product) return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });

  const pdfUrl = manualPdf(product);
  const manual = pdfUrl ? await getManualChunks(pdfUrl) : [];

  return NextResponse.json(answerQuestion(question, product, assembly, manual, pdfUrl));
}
