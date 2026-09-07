import { Card, Container } from '@autohub360/ui';

export const metadata = {
  title: 'Dashboard — AutoHub360 Admin',
};

const MODULES = [
  ['Produtos', 'CRUD de catálogo, variantes e ofertas por mercado.'],
  ['Estoque', 'Saldo por local (CD Goiás, retirada Anápolis, oficina parceira).'],
  ['Pedidos', 'Fila de pedidos, status de pagamento e expedição.'],
  ['Clientes', 'Perfis, endereços e garagem veicular.'],
  ['Instalações', 'Agenda de vagas e agendamentos com o parceiro.'],
  ['Conteúdo', 'Editorial do Hub e páginas institucionais.'],
  ['Promoções', 'Cupons, ofertas e kits.'],
] as const;

export default function DashboardPage() {
  return (
    <Container className="py-12">
      <h1 className="font-display text-2xl font-extrabold text-white">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
        Este é o esqueleto do backoffice (V1). Os módulos abaixo estão planejados e o modelo de
        dados já os suporta. A autenticação de equipe será feita via Supabase Auth com papéis
        verificados no servidor — nunca por metadata editável no cliente.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(([title, desc]) => (
          <li key={title}>
            <Card className="h-full border-white/10 bg-white/[0.04] p-5">
              <p className="font-display text-base font-bold text-white">{title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{desc}</p>
              <p className="mt-3 inline-flex rounded-md bg-white/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Em preparação
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </Container>
  );
}
