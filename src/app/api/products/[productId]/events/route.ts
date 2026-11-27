import { prisma } from '@/lib/prisma';
import { parseProductId, productVisibility } from '@/_data/publicProduct';
import { isClientEvent, recordEvent } from '@/lib/analytics';

type Ctx = { params: Promise<{ productId: string }> };

// per-visitor limit (in memory, per server instance): 60 events per minute
const WINDOW_MS = 60_000;
const LIMIT = 60;
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

// POST { type } (sent with navigator.sendBeacon by the public product pages) -> 204.
// Only published products count; the panel indicators read these events.
export async function POST(req: Request, { params }: Ctx) {
  const none = new Response(null, { status: 204 });
  if (limited(req)) return none;

  const id = parseProductId((await params).productId);
  const body = await req.json().catch(() => null);
  if (!id || !isClientEvent(body?.type)) return new Response(null, { status: 400 });

  const exists = await prisma.product.count({ where: { id, ...productVisibility } });
  if (exists) await recordEvent(id, body.type, 'web');
  return none;
}
