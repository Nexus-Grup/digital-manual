import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, parseId, requireUser } from '@/lib/companyAccess';

type Ctx = { params: Promise<{ notificationId: string }> };

// PATCH /api/notifications/{id}/read -> marks one of the signed-in user's notifications as read.
// The user comes from the session: nobody can mark someone else's notification.
export async function PATCH(_req: Request, { params }: Ctx) {
  try {
    const me = await requireUser();
    const id = parseId((await params).notificationId);
    await prisma.notification.updateMany({
      where: { id, userId: me.id, read: false },
      data: { read: true, readAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
