import type { ReactNode } from 'react';

export function PageHeading({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/8 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-blue-400">AutoHub360 Control Plane</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function Panel({ title, subtitle, children, className = '' }: { title?: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/8 bg-white/[0.035] shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur ${className}`}>
      {title || subtitle ? (
        <div className="border-b border-white/8 px-5 py-4">
          {title ? <h2 className="text-sm font-bold text-white">{title}</h2> : null}
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function MetricCard({ label, value, detail, icon, tone = 'blue' }: { label: string; value: string; detail?: string; icon?: ReactNode; tone?: 'blue' | 'orange' | 'green' | 'violet' }) {
  const tones = {
    blue: 'border-blue-500/20 bg-blue-500/[0.06] text-blue-300',
    orange: 'border-orange-500/20 bg-orange-500/[0.06] text-orange-300',
    green: 'border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300',
    violet: 'border-violet-500/20 bg-violet-500/[0.06] text-violet-300',
  };
  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">{label}</p>
        {icon ? <span className="opacity-90">{icon}</span> : null}
      </div>
      <p className="mt-3 text-2xl font-black tracking-tight text-white">{value}</p>
      {detail ? <p className="mt-1 text-[11px] text-slate-500">{detail}</p> : null}
    </div>
  );
}

export function StatusBadge({ value }: { value: string | null | undefined }) {
  const v = value ?? 'unknown';
  const positive = ['active','live','paid','delivered','sent','resolved','approved','customer','vip'].includes(v);
  const warning = ['queued','pending','pending_payment','preparing','in_transit','out_for_delivery','draft','waiting_customer','waiting_team','prospect'].includes(v);
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${positive ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : warning ? 'border-amber-500/25 bg-amber-500/10 text-amber-300' : 'border-slate-500/25 bg-slate-500/10 text-slate-300'}`}>
      {v.replaceAll('_', ' ')}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">{text}</div>;
}
