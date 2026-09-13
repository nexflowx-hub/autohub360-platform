'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AutomationToggle({ code, status }: { code: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const active = status === 'active';
  async function toggle() {
    setBusy(true);
    await fetch('/api/admin/automation/rules', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code, status: active ? 'paused' : 'active' }) });
    setBusy(false); router.refresh();
  }
  return <button onClick={toggle} disabled={busy} className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${active ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border-slate-500/25 bg-slate-500/10 text-slate-400'}`}>{busy ? '…' : active ? 'Ativa' : 'Pausada'}</button>;
}
