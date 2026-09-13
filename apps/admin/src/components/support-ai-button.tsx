'use client';

import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SupportAIButton({ caseId }: { caseId: string }) {
  const router=useRouter(); const [busy,setBusy]=useState(false); const [msg,setMsg]=useState('');
  async function generate(){setBusy(true);setMsg('');const res=await fetch('/api/admin/support/ai-draft',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({caseId})});const data=(await res.json()) as {ok?:boolean;error?:string};setMsg(data.ok?'Rascunho criado':data.error??'Falha');setBusy(false);router.refresh();}
  return <div className="flex items-center gap-2"><span className="text-[10px] text-slate-500">{msg}</span><button onClick={generate} disabled={busy} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 text-[10px] font-bold text-violet-200 hover:bg-violet-500/15 disabled:opacity-50">{busy?<Loader2 className="h-3 w-3 animate-spin"/>:<Bot className="h-3 w-3"/>}Gerar rascunho IA</button></div>;
}
