'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { BarChart3, Boxes, Bot, ExternalLink, LayoutDashboard, LogOut, Megaphone, PackageCheck, UsersRound, Workflow } from 'lucide-react';
import { LogoHorizontal } from '@autohub360/ui';

const NAV: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/dashboard/crm', label: 'CRM & Webtracking', icon: UsersRound },
  { href: '/dashboard/operacoes', label: 'Pedidos & Tracking', icon: PackageCheck },
  { href: '/dashboard/marketing', label: 'Marketing', icon: Megaphone },
  { href: '/dashboard/automacoes', label: 'Automações', icon: Workflow },
  { href: '/dashboard/suporte', label: 'Pós-venda IA', icon: Bot },
  { href: '/dashboard/catalogo', label: 'Catálogo & Sourcing', icon: Boxes },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  async function logout() {
    await fetch('/api/session', { method: 'DELETE' });
    window.location.assign('/login');
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[248px_1fr]">
      <aside className="border-b border-white/8 bg-[#030b18]/95 px-4 py-4 backdrop-blur md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between md:block">
          <Link href="/dashboard" className="inline-flex">
            <LogoHorizontal size="sm" tagline={false} tone="dark" />
          </Link>
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-blue-300">Ops MVP</span>
        </div>
        <nav className="mt-4 flex gap-1 overflow-x-auto pb-1 md:mt-7 md:flex-col md:overflow-visible" aria-label="Control Plane">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${active ? 'bg-blue-500/15 text-blue-200' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <Icon className="h-4 w-4" />{label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 hidden border-t border-white/8 pt-5 md:block">
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-[11px] text-slate-500">
            <div className="flex items-center justify-between"><span>Brasil</span><span className="font-bold text-emerald-300">LIVE</span></div>
            <div className="mt-2 flex items-center justify-between"><span>Europa</span><span className="font-bold text-amber-300">PREVIEW</span></div>
          </div>
          <a href="https://autohub360.store" target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white"><ExternalLink className="h-4 w-4" />Abrir Store</a>
          <button onClick={logout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-500 hover:bg-red-500/10 hover:text-red-300"><LogOut className="h-4 w-4" />Sair</button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/8 bg-[#020817]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500"><BarChart3 className="h-4 w-4 text-blue-400" /><span>Control Plane</span><span>/</span><span className="text-slate-300">{pathname.split('/').filter(Boolean).at(-1) ?? 'dashboard'}</span></div>
          <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.7)]" /><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DB connected</span></div>
        </header>
        <main className="admin-grid min-h-[calc(100vh-3.5rem)] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
