import Link from 'next/link';
import {
  ArrowRight,
  ShoppingCart,
  MapPin,
  Percent,
  ShieldCheck,
  Truck,
  Wrench,
  BadgeCheck,
  ClipboardCheck,
  MessageCircle,
} from 'lucide-react';
import {
  Button,
  Card,
  Container,
  ProductCard,
  Section,
  SectionHeader,
  TrustStrip,
  UniverseCard,
  LogoHorizontal,
} from '@autohub360/ui';
import { GENEROSO, UNIVERSES, whatsappLink } from '@autohub360/config';
import {
  getBestSellers,
  getFeatured,
  getOffers,
} from '@autohub360/catalog/server';;
import { VehicleSelector } from '@/components/vehicle-selector';

export const metadata = {
  title: 'AutoHub360 Store — Tudo para o seu veículo e muito mais',
  description:
    'Peças, acessórios, eletrônicos, segurança, gadgets e soluções inteligentes em um só lugar. Entrega para todo o Brasil e instalação especializada em Anápolis - GO.',
};

const heroHighlights = [
  { icon: BadgeCheck, label: 'Qualidade e procedência' },
  { icon: ShieldCheck, label: 'Compra segura' },
  { icon: Truck, label: 'Entrega nacional' },
  { icon: MapPin, label: 'Instalação em Anápolis' },
];

export default function StoreHomePage() {
  const featured = getFeatured();
  const bestSellers = getBestSellers();
  const offers = getOffers();

  return (
    <>
      {/* ===== HERO — cinematic, matches mockup direction ===== */}
      <section className="ah-hero-glow relative overflow-hidden text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,176,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(124,176,255,0.25) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-ahblue-500/25 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-ahorange-500/15 blur-[110px]"
        />
        <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-ahblue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-ahorange-500" aria-hidden="true" />
              Auto • Tech • Smart Living
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Tudo para o seu veículo{' '}
              <span className="bg-gradient-to-r from-ahblue-300 to-ahblue-500 bg-clip-text text-transparent">
                e muito mais.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Peças, acessórios, eletrônicos, segurança, gadgets e soluções inteligentes em um só
              lugar — com entrega para todo o Brasil e instalação especializada em Anápolis.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/ofertas" size="lg" variant="primary">
                Comprar agora
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button href="/instalacao" size="lg" variant="outline-dark">
                <MapPin className="h-5 w-5" aria-hidden="true" />
                Ver instalação em Anápolis
              </Button>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4">
              {heroHighlights.map((h) => (
                <li key={h.label} className="flex items-center gap-2">
                  <h.icon className="h-4.5 w-4.5 shrink-0 text-ahblue-400" aria-hidden="true" />
                  <span className="leading-tight">{h.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product collage — recreated with design system placeholders (not pasted mockup) */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="ah-glass relative ml-auto grid w-full max-w-lg grid-cols-2 gap-4 rounded-2xl p-5">
              <div className="ah-glass col-span-2 flex items-center justify-between rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <LogoHorizontal size="sm" tagline={false} />
                </div>
                <span className="text-[11px] italic text-slate-400">
                  &ldquo;Tecnologia que te leva mais longe.&rdquo;
                </span>
              </div>
              {featured.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`ah-glass rounded-xl p-3 ${i % 2 === 1 ? 'translate-y-2' : ''}`}
                >
                  <div
                    className="mb-2 aspect-[4/3] w-full rounded-lg"
                    style={{
                      background: `linear-gradient(140deg, ${
                        [' #10459b', '#0d1b30', '#e05e04', '#1559c4'][i]
                      } 0%, ${['#1e6feb', '#27436b', '#ff9433', '#4d90ff'][i]} 100%)`,
                    }}
                  />
                  <p className="truncate text-xs font-semibold text-white">{p.title}</p>
                  <p className="text-[11px] text-ahblue-300">{p.categoryName}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ===== Vehicle fitment selector ===== */}
      <Container className="relative z-10 -mt-7 sm:-mt-9">
        <div className="rounded-2xl bg-white p-1 shadow-[var(--ah-shadow-float)] sm:p-2">
          <div className="p-3 sm:p-4">
            <VehicleSelector />
          </div>
        </div>
      </Container>

      {/* ===== Universe cards ===== */}
      <Section ariaLabel="Universos de produtos">
        <Container>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 lg:gap-4">
            {UNIVERSES.map((u) => (
              <li key={u.key}>
                <UniverseCard universe={u} href={`/categoria/${u.slug}`} className="h-full" />
              </li>
            ))}
            <li className="col-span-2 sm:col-span-1">
              <Link
                href="/ofertas"
                className="group flex h-full flex-col items-center gap-2.5 rounded-xl border border-ahorange-500/40 bg-gradient-to-b from-ahorange-500/10 to-white px-3 py-5 text-center transition-all hover:-translate-y-1 hover:shadow-[var(--ah-shadow-float)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ahorange-500/15 text-ahorange-600 transition-transform group-hover:scale-110">
                  <Percent className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-bold text-ink-900">Ofertas</span>
                <span className="text-[11px] leading-snug text-ink-500">As melhores oportunidades</span>
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      {/* ===== Featured products ===== */}
      <Section ariaLabel="Produtos em destaque" className="bg-surface-50">
        <Container>
          <SectionHeader
            overline="Seleção AutoHub360"
            title="Produtos em destaque"
            action={
              <Button href="/buscar" variant="ghost-dark" size="sm">
                Ver todos os produtos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {featured.slice(0, 6).map((p) => (
              <li key={p.id} className="flex">
                <ProductCard product={p} className="w-full" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ===== Compra + Instalação em Anápolis (Generoso) ===== */}
      <Section ariaLabel="Compra com instalação em Anápolis" dark className="bg-navy-900">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ahorange-400">
                Compra + Instalação
              </p>
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                Compre na loja e instale com confiança em Anápolis
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300">
                Escolha <strong className="text-white">&ldquo;Produto + instalação&rdquo;</strong> no
                checkout e conte com a experiência do {GENEROSO.name}, nosso parceiro oficial de
                instalação em Anápolis - GO. Qualidade, confiança e atendimento especializado.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/instalacao" variant="accent" size="lg">
                  Saiba mais
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button href="/kits" variant="outline-light" size="lg">
                  Ver kits com instalação
                </Button>
              </div>
            </div>
            <div className="ah-glass rounded-2xl p-6">
              <p className="mb-4 font-display text-lg font-extrabold text-white">
                {GENEROSO.name}
                <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-widest text-ahorange-400">
                  nosso parceiro em Anápolis
                </span>
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {GENEROSO.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 text-sm text-slate-200">
                    {h === 'Atendimento local' ? (
                      <MapPin className="h-4.5 w-4.5 shrink-0 text-ahblue-300" aria-hidden="true" />
                    ) : h === 'Mão de obra qualificada' ? (
                      <ClipboardCheck className="h-4.5 w-4.5 shrink-0 text-ahblue-300" aria-hidden="true" />
                    ) : h === 'Instalação especializada' ? (
                      <Wrench className="h-4.5 w-4.5 shrink-0 text-ahblue-300" aria-hidden="true" />
                    ) : (
                      <MessageCircle className="h-4.5 w-4.5 shrink-0 text-ahblue-300" aria-hidden="true" />
                    )}
                    {h}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-white/10 pt-4 text-sm italic text-slate-400">
                &ldquo;{GENEROSO.tagline}&rdquo;
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ===== Ofertas da semana ===== */}
      <Section ariaLabel="Ofertas da semana">
        <Container>
          <SectionHeader
            overline="Ofertas da semana"
            title="Descontos de verdade, por tempo limitado"
            action={
              <Button href="/ofertas" variant="ghost-dark" size="sm">
                Ver todas as ofertas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {offers.slice(0, 5).map((p) => (
              <li key={p.id} className="flex">
                <ProductCard product={p} className="w-full" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ===== Mais vendidos ===== */}
      <Section ariaLabel="Mais vendidos" className="bg-surface-50">
        <Container>
          <SectionHeader
            overline="Preferidos dos clientes"
            title="Mais vendidos"
            subtitle="O que mais sai no dia a dia de quem trabalha com o que ama."
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {bestSellers.slice(0, 5).map((p) => (
              <li key={p.id} className="flex">
                <ProductCard product={p} className="w-full" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ===== Tech/Gadgets + Smart Home + Energy blocks ===== */}
      <Section ariaLabel="Tech, casa inteligente e energia">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Tech & Gadgets',
                desc: 'Eletrônicos que fazem diferença na rotina: carregadores GaN, power banks, som e acessórios.',
                universe: 'tech',
                accent: 'from-ahblue-500/15',
              },
              {
                title: 'Casa Inteligente',
                desc: 'Comece sua casa conectada: lâmpadas Wi-Fi, câmeras, tomadas inteligentes e automação.',
                universe: 'casa-inteligente',
                accent: 'from-violet-500/15',
              },
              {
                title: 'Energia',
                desc: 'Estações portáteis, placas solares e soluções para nunca mais ficar no escuro.',
                universe: 'energia',
                accent: 'from-ahorange-500/15',
              },
            ].map((block) => (
              <Card key={block.title} hover className="overflow-hidden">
                <div className={`bg-gradient-to-br ${block.accent} to-transparent p-6`}>
                  <h3 className="font-display text-xl font-extrabold text-ink-900">{block.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{block.desc}</p>
                  <Button
                    href={`/categoria/${block.universe}`}
                    variant="ghost-dark"
                    size="sm"
                    className="mt-4"
                  >
                    Explorar
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ===== Trust strip ===== */}
      <Section ariaLabel="Vantagens da loja" className="bg-surface-100 py-8 sm:py-10">
        <Container>
          <TrustStrip
            items={[
              { icon: 'truck', title: 'Entrega nacional', subtitle: 'Com rastreamento' },
              { icon: 'pin', title: 'Retirada local', subtitle: 'Em Anápolis - GO' },
              { icon: 'shield', title: 'Compra segura', subtitle: 'Seus dados protegidos' },
              { icon: 'headset', title: 'Suporte especializado', subtitle: 'Antes e depois da compra' },
            ]}
          />
        </Container>
      </Section>

      {/* ===== CTA final ===== */}
      <Section dark className="bg-navy-950">
        <Container className="text-center">
          <h2 className="mx-auto max-w-2xl font-display text-2xl font-extrabold text-white sm:text-3xl">
            Não achou o que procurava? Nossa equipe encontra pra você.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-slate-300">
            Fale com um especialista no WhatsApp: consultoria de produto, compatibilidade e
            instalação — tudo no mesmo lugar.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={whatsappLink('general')} variant="accent" size="lg">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              Falar no WhatsApp
            </Button>
            <Button href="/atendimento" variant="outline-light" size="lg">
              Canais de atendimento
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
