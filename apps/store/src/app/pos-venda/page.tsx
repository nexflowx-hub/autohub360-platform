import type { Metadata } from 'next';
import { Bot, Headphones, PackageSearch, ShieldCheck } from 'lucide-react';
import { Container } from '@autohub360/ui';
import { SupportCaseForm } from '@/components/support-case-form';

export const metadata: Metadata = {
  title: 'Pós-venda e assistência',
  description: 'Abra um atendimento AutoHub360 com contexto de pedido e rastreio.',
};

const BENEFITS = [
  { label: 'Pedido e tracking no mesmo contexto', icon: PackageSearch },
  { label: 'Rascunho IA supervisionado', icon: Bot },
  { label: 'Escalonamento para equipa', icon: Headphones },
  { label: 'Sem pedir dados sensíveis', icon: ShieldCheck },
] as const;

export default async function PostSalePage({ searchParams }: { searchParams: Promise<{ tracking?: string }> }) {
  const q = await searchParams;
  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <aside className="rounded-2xl bg-[#06182d] p-6 text-white sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-ahblue-300">AutoHub360 Care</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold">Pós-venda com contexto, não com filas cegas.</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Informe pedido ou tracking. O ticket fica ligado à jornada do cliente, à entrega e às comunicações. O copiloto IA prepara uma resposta para revisão da equipa.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {BENEFITS.map(({ label, icon: Icon }) => <li key={label} className="flex items-center gap-2"><Icon className="h-4 w-4 text-ahblue-300" />{label}</li>)}
            </ul>
          </aside>
          <section className="rounded-2xl border border-surface-200 bg-white p-6 shadow-[var(--ah-shadow-card)] sm:p-8">
            <h2 className="font-display text-2xl font-extrabold text-ink-900">Abrir atendimento</h2>
            <p className="mt-2 text-sm text-ink-500">Receberá um protocolo e o caso ficará disponível no Control Plane.</p>
            <div className="mt-6"><SupportCaseForm initialTrackingCode={q.tracking} /></div>
          </section>
        </div>
      </div>
    </Container>
  );
}
