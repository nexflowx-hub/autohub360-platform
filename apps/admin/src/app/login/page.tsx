import { redirect } from 'next/navigation';
import { Bot, PackageCheck, ShieldCheck, UsersRound, Workflow } from 'lucide-react';
import { LogoHorizontal } from '@autohub360/ui';
import { LoginForm } from '@/components/login-form';
import { adminSessionConfigured, hasAdminSession } from '@/lib/admin-session';

export const metadata = { title: 'Acesso ao Control Plane' };

const FEATURES = [
  { label: 'CRM & jornada', icon: UsersRound },
  { label: 'Tracking físico', icon: PackageCheck },
  { label: 'Pós-venda IA', icon: Bot },
  { label: 'Automações', icon: Workflow },
] as const;

export default async function LoginPage() {
  if (await hasAdminSession()) redirect('/dashboard');
  const configured = adminSessionConfigured();
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
      <section className="hidden border-r border-white/8 p-12 lg:flex lg:flex-col lg:justify-between">
        <LogoHorizontal size="md" tagline tone="dark" />
        <div className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[.24em] text-blue-400">Operations Control Plane</p>
          <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-[-.04em] text-white">Da campanha à entrega. Da entrega à recompra.</h1>
          <p className="mt-5 text-base leading-relaxed text-slate-400">CRM, webtracking, pedidos, tracking logístico, pós-venda assistido por IA e automações de comunicação no mesmo plano operacional.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-slate-300">
            {FEATURES.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.035] p-3"><Icon className="h-4 w-4 text-blue-400" />{label}</div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-slate-600">AutoHub360 · ambiente administrativo não indexado</p>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.045] p-7 shadow-[0_30px_100px_rgba(0,0,0,.32)] backdrop-blur-xl sm:p-9">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300"><ShieldCheck className="h-5 w-5" /></div>
          <h2 className="mt-5 text-2xl font-black text-white">Acesso administrativo</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">Proteção MVP por segredo server-side. A fase seguinte substitui esta camada por Supabase Auth + RBAC de equipa.</p>
          <LoginForm configured={configured} />
        </div>
      </section>
    </main>
  );
}
