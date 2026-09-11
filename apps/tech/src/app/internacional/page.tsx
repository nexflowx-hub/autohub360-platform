import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Globe2, ShieldCheck } from 'lucide-react';
import { Badge, Button, Container, Section } from '@autohub360/ui';

export const metadata: Metadata = {
  title: 'AutoHub360 Internacional — Em preparação',
  description:
    'Expansão internacional da AutoHub360 para Europa e outros mercados. Operação internacional em preparação, com Brasil como mercado comercial ativo.',
};

export default function InternacionalPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#031326] py-16 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(30,111,235,.28),transparent_32%),radial-gradient(circle_at_82%_85%,rgba(249,115,22,.10),transparent_24%)]" />
        <Container className="relative">
          <Badge tone="blue">Internacional • Em preparação</Badge>
          <div className="mt-5 grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.03] sm:text-5xl lg:text-6xl">
                Um ecossistema AutoHub360 preparado para operar além do Brasil.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                A operação comercial brasileira é o nosso mercado ativo. A expansão para Europa e outros países está sendo estruturada com catálogo, logística, pagamentos, atendimento e requisitos legais próprios por mercado.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="https://autohub360.store">Comprar no Brasil <ArrowRight className="h-4 w-4" /></Button>
                <Button href="/contato" variant="outline-light">Interesse internacional</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.055] p-6 backdrop-blur-xl sm:p-8">
              <Globe2 className="h-10 w-10 text-ahblue-400" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-ahblue-300">Próximo mercado</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold">Europa</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                AutoHub360 Europe é uma marca comercial operada pela Auto Lux Europe SAS — SIREN 924 799 356, RCS Paris, TVA FR06924799356.
              </p>
              <p className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
                Checkout e vendas internacionais ainda não estão ativos. Nenhum pedido para a Europa deve ser aceito até a ativação formal do mercado.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section ariaLabel="Estratégia internacional" className="bg-white">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['Brasil', 'Mercado ativo', 'Catálogo, checkout, entrega nacional e instalação local em desenvolvimento operacional.'],
              ['Europa', 'Em preparação', 'Estrutura legal, catálogo EUR, logística, política de devolução e meios de pagamento por país.'],
              ['Outros mercados', 'Planejado', 'Expansão somente depois de validar procura, margens, fiscalidade, importação e suporte local.'],
            ].map(([title, status, text]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-ahblue-600">{status}</p>
                <h2 className="mt-2 font-display text-xl font-extrabold text-ink-900">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-6 rounded-2xl bg-navy-900 p-7 text-white lg:grid-cols-2 lg:p-9">
            <div>
              <ShieldCheck className="h-8 w-8 text-ahblue-400" />
              <h2 className="mt-4 font-display text-2xl font-extrabold">Operação por mercado, não uma cópia do Brasil</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Cada país terá meios de pagamento, preços, impostos, entrega, garantia, privacidade e informação legal próprios. A plataforma já foi desenhada para separar ofertas e checkout por mercado.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-200">
              {['Catálogo e preços por moeda', 'Logística e prazos por país', 'Pagamentos e antifraude por mercado', 'Políticas legais e fiscais localizadas', 'Atendimento e pós-venda internacional'].map((item) => (
                <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{item}</li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-center text-sm text-ink-500">
            Quer ser avisado quando o mercado europeu abrir? <Link href="/contato" className="font-semibold text-ahblue-600 hover:underline">Registe o seu interesse</Link>.
          </p>
        </Container>
      </Section>
    </>
  );
}
