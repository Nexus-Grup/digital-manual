import 'server-only';
import type { EventType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/** Usage events the public product pages may send (QR_SCAN is recorded only by the /qr route). */
export const CLIENT_EVENTS = [
  'PRODUCT_VIEW',
  'LANDING_PAGE_VIEW',
  'MANUAL_VIEW',
  'MANUAL_DOWNLOAD',
  'GALLERY_VIEW',
  'MODEL_3D_VIEW',
] as const satisfies readonly EventType[];

export type ClientEvent = (typeof CLIENT_EVENTS)[number];

export const isClientEvent = (v: unknown): v is ClientEvent =>
  typeof v === 'string' && (CLIENT_EVENTS as readonly string[]).includes(v);

/**
 * Records one usage event for the panel indicators. Never throws: analytics must not break the page
 * the visitor is opening.
 */
export async function recordEvent(productId: number, eventType: EventType, source?: string) {
  try {
    await prisma.productAnalyticsEvent.create({
      data: { productId, eventType, source: source ? source.slice(0, 40) : null },
    });
  } catch (err) {
    console.error('analytics event failed', err);
  }
}
