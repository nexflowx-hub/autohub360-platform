import type { Metadata } from 'next';
import { BadgePercent, Flame, Info } from 'lucide-react';
import {
  Button,
  Container,
  ProductCard,
  Section,
  TrustStrip,
} from '@autohub360/ui';
import {
  getOffers,
} from '@autohub360/catalog/server';;
import { formatBRL } from '@autohub360/commerce';

export const metadata: Metadata = {
  title: 'Ofertas da semana',
  description:
    'Descontos reais da AutoHub360 em peças, acessórios, eletrônicos e soluções inteligentes. Ofertas com quantidade limitada — aproveite enquanto durar o estoque.',
};

export default function OfertasPage() {
  const offers = [...getOffers()].sort((a, b) => {
    const da = 1 - a.priceCents / (a.compareAtCents ?? a.priceCents);
    const db = 1 - b.priceCents / (b.compareAtCents ?? b.priceCents);
    return db - da;
  });

  const biggest = offers[0];
  const biggestPct = biggest
    ? Math.round((1 - biggest.priceCents / (biggest.compareAtCents ?? biggest.priceCents)) * 100)
    : 0;

  return (
    <>
      {/* Orange-accented hero banner */}
      <section className="ah-hero-glow relative overflow-hidden text-white" aria-labelledby="ofertas-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-ahorange-500/25 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-ahblue-500/20 blur-[100px]"
        />
        <Container className="relative py-12 sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-ahorange-400/40 bg-ahorange-500/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-ahorange-300">
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            Descontos de verdade
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1
                id="ofertas-title"
                className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl"
              >
                Ofertas da{' '}
                <span className="bg-gradient-to-r from-ahorange-300 to-ahorange-500 bg-clip-text text-transparent">
                  semana
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-lg">
                Preços promocionais aplicados direto no produto, sem cupom e sem enrolação.
                Estoque limitado — quando acaba, acabou.
              </p>
            </div>
            {biggest && biggestPct > 0 && (
              <div className="ah-glass w-full max-w-xs rounded-2xl p-5 lg:w-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Maior desconto hoje
                </p>
                <p className="mt-1 font-display text-5xl font-extrabold text-ahorange-400">
                  -{biggestPct}%
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-white">{biggest.title}</p>
                <p className="mt-1 text-sm text-ahblue-300">
                  por {formatBRL(biggest.priceCents)}
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      <Section ariaLabel="Produtos em oferta" className="bg-surface-50 py-8 sm:py-10">
        <Container>
          <p className="mb-6 flex items-center gap-2 text-sm text-ink-700">
            <Info className="h-4.5 w-4.5 shrink-0 text-ahblue-500" aria-hidden="true" />
            {offers.length} {offers.length === 1 ? 'oferta ativa' : 'ofertas ativas'} · Quantidades
            limitadas por item, sujeitas à disponibilidade de estoque.
          </p>

          {offers.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {offers.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} className="w-full" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-surface-200 bg-white p-10 text-center">
              <BadgePercent className="mx-auto h-8 w-8 text-ink-300" aria-hidden="true" />
              <h2 className="mt-3 font-display text-lg font-extrabold text-ink-900">
                Nenhuma oferta ativa neste momento
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-500">
                Novas promoções entram no ar regularmente. Explore a loja enquanto isso.
              </p>
              <Button href="/buscar" className="mt-5">
                Explorar a loja
              </Button>
            </div>
          )}
        </Container>
      </Section>

      <Section ariaLabel="Vantagens da loja" className="bg-white py-8 sm:py-10">
        <Container>
          <TrustStrip
            items={[
              { icon: 'shield', title: 'Compra segura', subtitle: 'Seus dados protegidos' },
              { icon: 'truck', title: 'Entrega nacional', subtitle: 'Com rastreamento' },
              { icon: 'pin', title: 'Retirada em Anápolis', subtitle: 'Sem custo de frete' },
              { icon: 'headset', title: 'Suporte especializado', subtitle: 'Antes e depois da compra' },
            ]}
          />
        </Container>
      </Section>
    </>
  );
}
