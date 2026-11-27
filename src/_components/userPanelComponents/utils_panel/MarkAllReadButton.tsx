'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

/** "Marcar todas como lidas" on the notifications page (the bell has the same action). */
export function MarkAllReadButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function markAll() {
    setBusy(true);
    const res = await fetch('/api/notifications/read-all', { method: 'PATCH' }).catch(() => null);
    setBusy(false);
    if (!res?.ok) return void toast.error('Não foi possível marcar as notificações. Tente de novo.');
    toast.success('Todas as notificações foram marcadas como lidas.');
    router.refresh();
  }

  return (
    <button type="button" className={className} onClick={markAll} disabled={busy}>
      <CheckCheck size={16} aria-hidden="true" />
      {busy ? 'Marcando...' : 'Marcar todas como lidas'}
    </button>
  );
}
