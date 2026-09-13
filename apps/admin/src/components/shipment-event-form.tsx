'use client';

import { useState } from 'react';
import { Loader2, RadioTower } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LABELS: Record<string, string> = { created: 'Expedição criada', labeled: 'Etiqueta emitida', in_transit: 'Em trânsito', out_for_delivery: 'Saiu para entrega', delivered: 'Entregue', exception: 'Ocorrência logística', returned: 'Devolvido ao remetente' };

export function ShipmentEventForm() {
  const router = useRouter();
  const [shipment, setShipment] = useState('');
  const [status, setStatus] = useState('in_transit');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMessage('');
    try {
      const res = await fetch('/api/admin/shipments', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ shipment, status, title: LABELS[status], description, location }) });
      const data = (await res.json()) as { ok?: boolean; error?: string; publicCode?: string };
      setMessage(data.ok ? `Evento gravado · ${data.publicCode ?? ''}` : data.error ?? 'Falha ao gravar evento.');
      if (data.ok) { setDescription(''); setLocation(''); router.refresh(); }
    } catch { setMessage('Falha de ligação.'); } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 lg:grid-cols-2">
      <input required value={shipment} onChange={(e) => setShipment(e.target.value)} placeholder="Código público AH… ou tracking da transportadora" className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-xs text-white outline-none focus:border-blue-500/50 lg:col-span-2" />
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#071224] px-3 text-xs text-white outline-none">{Object.entries(LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select>
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Local / unidade (opcional)" className="h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-xs text-white outline-none" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição visível ao cliente" rows={3} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none lg:col-span-2" />
      <div className="flex items-center justify-between gap-3 lg:col-span-2"><p className="text-[11px] text-slate-500">{message}</p><button disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50">{loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RadioTower className="h-3.5 w-3.5" />}Registrar etapa</button></div>
    </form>
  );
}
