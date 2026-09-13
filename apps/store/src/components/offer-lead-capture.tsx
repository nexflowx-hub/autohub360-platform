'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Mail, Sparkles } from 'lucide-react';
import { useMarket } from '@autohub360/ui';

function currentSessionId() {
  try { return sessionStorage.getItem('autohub360.websession') || undefined; } catch { return undefined; }
}

export function OfferLeadCapture({ slug }: { slug: string }) {
  const { market } = useMarket();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError('');
    const form = new FormData(e.currentTarget);
    const query = new URLSearchParams(window.location.search);
    const body = {
      kind: 'consumer',
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      source: `offer:${slug}`,
      landingPath: window.location.pathname,
      market,
      sessionId: currentSessionId(),
      utmSource: query.get('utm_source') || undefined,
      utmMedium: query.get('utm_medium') || undefined,
      utmCampaign: query.get('utm_campaign') || slug,
      consentMarketing: form.get('consent') === 'on',
    };
    const res = await fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (data.ok) { setDone(true); e.currentTarget.reset(); } else setError(data.error ?? 'Não foi possível registrar o seu interesse.');
    setLoading(false);
  }

  return <section className="border-t border-white/10 bg-[#020b16] py-10 text-white sm:py-14"><div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8"><div className="grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-ahblue-500/15 to-white/[0.03] p-6 shadow-[0_25px_80px_rgba(0,0,0,.28)] sm:p-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><div className="inline-flex items-center gap-2 rounded-full border border-ahblue-300/20 bg-ahblue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-ahblue-200"><Sparkles className="h-3.5 w-3.5"/>Receba a condição atual</div><h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">Quer receber disponibilidade, preço e compatibilidade por mensagem?</h2><p className="mt-3 text-sm leading-relaxed text-slate-400">Registre o interesse. A origem desta campanha fica ligada ao CRM e a equipa pode continuar o atendimento com contexto.</p></div>{done?<div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300"/><p className="mt-3 font-bold text-white">Interesse registrado.</p><p className="mt-1 text-sm text-slate-300">A AutoHub360 recebeu o seu pedido de contacto.</p></div>:<form onSubmit={submit} className="grid gap-3 sm:grid-cols-2"><input required name="name" placeholder="Nome" className="h-11 rounded-xl border border-white/12 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-ahblue-400/60"/><input required type="email" name="email" placeholder="E-mail" className="h-11 rounded-xl border border-white/12 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-ahblue-400/60"/><input name="phone" placeholder="WhatsApp (opcional)" className="h-11 rounded-xl border border-white/12 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-ahblue-400/60 sm:col-span-2"/><label className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400 sm:col-span-2"><input required type="checkbox" name="consent" className="mt-0.5 h-4 w-4 accent-ahblue-500"/>Aceito receber comunicações relacionadas a esta solicitação e ofertas AutoHub360. Posso cancelar a qualquer momento.</label>{error?<p className="text-xs text-red-300 sm:col-span-2">{error}</p>:null}<button disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ahblue-500 px-5 font-display text-sm font-bold text-white hover:bg-ahblue-600 disabled:opacity-50 sm:col-span-2">{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<Mail className="h-4 w-4"/>}Quero receber os detalhes<ArrowRight className="h-4 w-4"/></button></form>}</div></div></section>;
}
