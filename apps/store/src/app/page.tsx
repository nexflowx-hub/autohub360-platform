import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Headset,
  MapPin,
  Percent,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wrench,
} from 'lucide-react';
import {
  Button,
  Container,
  ProductCard,
  ProductThumb,
  TrustStrip,
  UniverseCard,
} from '@autohub360/ui';
import { GENEROSO, UNIVERSES } from '@autohub360/config';
import { getBestSellers, getFeatured, getOffers } from '@autohub360/catalog/server';
import { VehicleSelector } from '@/components/vehicle-selector';

export const metadata = {
  title: 'AutoHub360 Store — Tudo para o seu veículo e muito mais',
  description:
    'Peças, acessórios, eletrônicos, segurança, gadgets e soluções inteligentes em um só lugar. Entrega para todo o Brasil e instalação especializada em Anápolis - GO.',
};

const heroHighlights = [
  { icon: BadgeCheck, title: 'Qualidade', sub: 'e procedência' },
  { icon: ShieldCheck, title: 'As melhores', sub: 'marcas' },
  { icon: Truck, title: 'Tecnologia', sub: 'para o seu dia' },
  { icon: MapPin, title: 'Carro e casa', sub: 'mais conectados' },
];

function GenerosoMark() {
  return (
    <div className="inline-flex flex-col items-center leading-none">
      <div className="relative px-2 pt-2">
        <span className="absolute left-1/2 top-0 h-[2px] w-[78%] -translate-x-1/2 -skew-x-[28deg] rounded-full bg-red-500" />
        <span className="-skew-x-[8deg] font-display text-xl font-extrabold tracking-[-0.05em] text-white">GENEROSO</span>
      </div>
      <span className="mt-1 text-[8px] font-bold tracking-[0.28em] text-red-500">AUTO CENTER</span>
    </div>
  );
}

export default function StoreHomePage() {
  const featured = getFeatured();
  const bestSellers = getBestSellers();
  const offers = getOffers();
  const storeUniverses = UNIVERSES.filter((u) => u.key !== 'pro');

  return (
    <>
      <section className="store-cinematic-hero relative overflow-hidden text-white">
        <div className="store-hero-vignette absolute inset-0" aria-hidden="true" />
        <Container className="relative grid min-h-[365px] items-center gap-7 py-9 lg:grid-cols-[0.88fr_1.12fr] lg:py-0">
          <div className="relative z-10 max-w-[560px] py-3">
            <p className="mb-2.5 text-[9.5px] font-bold uppercase tracking-[0.28em] text-ahblue-300">AutoHub360.store · Loja oficial</p>
            <h1 className="font-display text-[2.35rem] font-extrabold leading-[1.01] tracking-[-0.045em] sm:text-[3rem] lg:text-[3.35rem]">
              Tudo para o seu
              <br />
              veículo <span className="text-ahblue-400">e muito mais.</span>
            </h1>
            <p className="mt-3.5 max-w-[500px] text-[13.5px] leading-[1.5] text-slate-200 sm:text-[14.5px]">
              Peças, acessórios, eletrônicos, segurança, gadgets e soluções inteligentes em um só lugar.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/buscar" size="md" variant="primary" className="min-w-[150px]">
                Comprar agora <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="/instalacao" size="md" variant="outline-dark" className="min-w-[188px] bg-[#041326]/25 backdrop-blur-sm">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Ver instalação em Anápolis
              </Button>
            </div>
            <ul className="mt-5 grid max-w-[520px] grid-cols-2 gap-2.5 border-t border-white/10 pt-4 sm:grid-cols-4">
              {heroHighlights.map((item) => (
                <li key={item.title} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 shrink-0 text-ahblue-400" strokeWidth={1.8} aria-hidden="true" />
                  <span className="text-[8.5px] leading-[1.15] text-slate-400">
                    <strong className="block text-[9.5px] font-semibold text-white">{item.title}</strong>
                    {item.sub}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="store-device-stage relative hidden h-[350px] lg:block" aria-hidden="true">
            <div className="absolute bottom-[10px] left-[3%] w-[22%] -rotate-2 drop-shadow-2xl">
              <ProductThumb imageKey="led-kit" alt="" size="lg" className="aspect-square border-white/15 bg-white/95 shadow-[0_20px_45px_rgba(0,0,0,.34)]" />
            </div>
            <div className="absolute bottom-[14px] left-[23%] w-[28%] rotate-1 drop-shadow-2xl">
              <ProductThumb imageKey="rear-cam" alt="" size="lg" className="aspect-[1.25/1] border-white/15 bg-white/95 shadow-[0_20px_45px_rgba(0,0,0,.34)]" />
            </div>
            <div className="absolute bottom-[5px] right-[10%] w-[24%] rotate-2 drop-shadow-2xl">
              <ProductThumb imageKey="booster" alt="" size="lg" className="aspect-square border-white/15 bg-white/95 shadow-[0_20px_45px_rgba(0,0,0,.34)]" />
            </div>
            <div className="absolute right-[2%] top-[28px] w-[22%] -rotate-1 drop-shadow-2xl">
              <ProductThumb imageKey="smart-home" alt="" size="lg" className="aspect-[.9/1] border-white/15 bg-white/95 shadow-[0_20px_45px_rgba(0,0,0,.3)]" />
            </div>
          </div>
        </Container>
      </section>

      <Container className="relative z-20 -mt-5 sm:-mt-6">
        <div className="rounded-[13px] border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,.18)] sm:p-4">
          <VehicleSelector />
        </div>
      </Container>

      <section aria-label="Universos de produtos" className="bg-[#f8fafc] py-4">
        <Container>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {storeUniverses.map((u) => (
              <li key={u.key}>
                <UniverseCard universe={u} href={`/categoria/${u.slug}`} className="h-full" />
              </li>
            ))}
            <li>
              <Link
                href="/ofertas"
                className="group flex h-full min-h-[148px] flex-col overflow-hidden rounded-xl border border-ahorange-500/30 bg-white text-center shadow-[0_5px_18px_rgba(15,23,42,.06)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,.13)]"
              >
                <div className="relative mx-2 mt-2 flex h-[70px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 via-white to-orange-100">
                  <Percent className="h-10 w-10 text-ahorange-500 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.1} />
                  <span className="absolute right-2 top-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white">%</span>
                </div>
                <div className="flex flex-1 flex-col items-center px-2.5 pb-3 pt-2">
                  <span className="font-display text-[13px] font-extrabold text-ink-900">Ofertas</span>
                  <span className="mt-1 text-[10px] leading-[1.25] text-ink-500">As melhores oportunidades</span>
                </div>
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      <section aria-label="Produtos em destaque" className="bg-white pb-6 pt-4 sm:pb-8">
        <Container>
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <h2 className="font-display text-[20px] font-extrabold tracking-[-0.03em] text-ink-900">Produtos em destaque</h2>
            <Link href="/buscar" className="inline-flex items-center gap-1 text-[10px] font-bold text-ahblue-600 hover:text-ahblue-700">
              Ver todos os produtos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {featured.slice(0, 6).map((p) => (
              <li key={p.id} className="flex"><ProductCard product={p} className="w-full" /></li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="Compra com instalação em Anápolis" className="store-generoso relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#020b16]/98 via-[#031326]/86 to-[#020b16]/62" aria-hidden="true" />
        <Container className="relative grid min-h-[245px] items-center gap-7 py-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-[520px]">
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-ahorange-400">Compra + Instalação</p>
            <h2 className="mt-2 font-display text-[1.8rem] font-extrabold leading-[1.03] tracking-[-0.035em] sm:text-[2.25rem]">
              Compre online. Instale com confiança em Anápolis.
            </h2>
            <p className="mt-3 max-w-[490px] text-[12.5px] leading-relaxed text-slate-200">
              Escolha seus produtos na AutoHub360.store e conte com a experiência da {GENEROSO.name}, nosso parceiro oficial para instalação especializada.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/instalacao" variant="accent" size="sm">Saiba mais <ArrowRight className="h-3.5 w-3.5" /></Button>
              <Button href="/kits" variant="outline-light" size="sm">Ver kits com instalação</Button>
            </div>
          </div>
          <div className="ml-auto w-full max-w-[540px] rounded-2xl border border-white/12 bg-[#06162a]/72 p-5 shadow-[0_24px_60px_rgba(0,0,0,.38)] backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <GenerosoMark />
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Nosso parceiro em Anápolis</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-200 sm:grid-cols-4">
              {['Instalação especializada', 'Mão de obra qualificada', 'Agendamento local', 'Mais tecnologia na sua rotina'].map((label, i) => (
                <div key={label} className="flex flex-col gap-2 rounded-lg border border-white/8 bg-white/[0.035] p-3">
                  {i === 0 ? <Wrench className="h-4 w-4 text-ahblue-300" /> : i === 1 ? <ShieldCheck className="h-4 w-4 text-ahblue-300" /> : i === 2 ? <MapPin className="h-4 w-4 text-ahblue-300" /> : <Headset className="h-4 w-4 text-ahblue-300" />}
                  <span className="leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f8fafc] py-7 sm:py-9" aria-label="Ofertas e mais vendidos">
        <Container>
          <div className="grid gap-8 xl:grid-cols-2 xl:gap-5">
            <div>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">Ofertas da semana</p>
                  <h2 className="mt-0.5 font-display text-[18px] font-extrabold text-ink-900">Preços especiais</h2>
                </div>
                <Link href="/ofertas" className="text-[10px] font-bold text-ahblue-600">Ver todas →</Link>
              </div>
              <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {offers.slice(0, 3).map((p) => (
                  <li key={p.id} className="flex"><ProductCard product={p} className="w-full" /></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-ahblue-600">Preferidos dos clientes</p>
                  <h2 className="mt-0.5 font-display text-[18px] font-extrabold text-ink-900">Mais vendidos</h2>
                </div>
                <Link href="/buscar" className="text-[10px] font-bold text-ahblue-600">Ver todos →</Link>
              </div>
              <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {bestSellers.slice(0, 3).map((p) => (
                  <li key={p.id} className="flex"><ProductCard product={p} className="w-full" /></li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-slate-200 bg-white py-5" aria-label="Confiança AutoHub360">
        <Container>
          <TrustStrip
            items={[
              { icon: 'truck', title: 'Entrega para todo o Brasil', subtitle: 'Com rastreamento' },
              { icon: 'pin', title: 'Retirada local', subtitle: 'Em Anápolis - GO' },
              { icon: 'shield', title: 'Compra segura', subtitle: 'Seus dados protegidos' },
              { icon: 'headset', title: 'Suporte especializado', subtitle: 'Antes e depois da compra' },
            ]}
          />
        </Container>
      </section>

      <section className="bg-[#06172a] py-6 text-white">
        <Container className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-display text-[16px] font-extrabold">Tecnologia move melhores caminhos.</p>
            <p className="mt-1 text-[11px] text-slate-400">Auto, Tech e Smart Living em um único ecossistema.</p>
          </div>
          <Button href="/buscar" size="sm" variant="primary">
            <ShoppingCart className="h-4 w-4" /> Explorar catálogo
          </Button>
        </Container>
      </section>
    </>
  );
}
