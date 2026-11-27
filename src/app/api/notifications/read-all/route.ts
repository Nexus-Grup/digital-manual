import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, requireUser } from '@/lib/companyAccess';

// PATCH /api/notifications/read-all -> marks every unread notification of the signed-in user as read.
export async function PATCH() {
  try {
    const me = await requireUser();
    const { count } = await prisma.notification.updateMany({
      where: { userId: me.id, read: false },
      data: { read: true, readAt: new Date() },
    });
    return NextResponse.json({ ok: true, count });
  } catch (e) {
    return handleError(e);
  }
}
