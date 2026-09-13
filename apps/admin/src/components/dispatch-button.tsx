'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DispatchButton() {
  const router = useRouter(); const [busy,setBusy]=useState(false); const [msg,setMsg]=useState('');
  async function run() { setBusy(true); setMsg(''); const res=await fetch('/api/admin/automation/dispatch',{method:'POST'}); const data=(await res.json()) as {processed?:number;sent?:number;blocked?:number;error?:string}; setMsg(res.ok ? `${data.sent ?? 0} enviadas · ${data.blocked ?? 0} bloqueadas` : data.error ?? 'Falha'); setBusy(false); router.refresh(); }
  return <div className="flex items-center gap-2"><span className="hidden text-[10px] text-slate-500 sm:inline">{msg}</span><button onClick={run} disabled={busy} className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"><Send className="h-3.5 w-3.5" />{busy ? 'Processando…' : 'Despachar outbox'}</button></div>;
}
