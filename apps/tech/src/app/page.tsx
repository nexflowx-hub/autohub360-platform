import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Camera,
  Car,
  Check,
  ClipboardCheck,
  Cpu,
  Cctv,
  House,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  ShoppingCart,
  ShieldCheck,
  Speaker,
  Truck,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  Badge,
  Button,
  Container,
  LogoHorizontal,
  ProductThumb,
  Section,
  SectionHeader,
  TrustStrip,
  UniverseCard,
} from '@autohub360/ui';
import { BRAND, GENEROSO, storeSite, techSite, UNIVERSES, whatsappLink } from '@autohub360/config';
import {
  getArticles,
} from '@autohub360/catalog/server';;
import { NewsletterForm } from '@/components/newsletter-form';

export const metadata = {
  title: { absolute: techSite.title },
  description: techSite.description,
  alternates: { canonical: '/' },
};

const heroHighlights: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Car, label: 'Mobilidade mais inteligente' },
  { icon: House, label: 'Casas mais seguras' },
  { icon: Zap, label: 'Energia mais eficiente' },
  { icon: Wifi, label: 'Um dia a dia mais conectado' },
];

const collageTiles: Array<{ icon: LucideIcon; label: string; sub: string; from: string; to: string }> = [
  { icon: Camera, label: 'Segurança 24/7', sub: 'Câmeras e monitoramento', from: '#0d1b30', to: '#1e6feb' },
  { icon: House, label: 'Casa inteligente', sub: 'Automação e conforto', from: '#10459b', to: '#7cb0ff' },
  { icon: Car, label: 'Mobilidade conectada', sub: 'Multimídia e rastreamento', from: '#16273f', to: '#27436b' },
  { icon: Lightbulb, label: 'Iluminação LED', sub: 'Visibilidade e economia', from: '#e05e04', to: '#ff9433' },
];

const subBrandIcons: Record<string, LucideIcon> = {
  auto: Car,
  tech: Cpu,
  energy: BatteryCharging,
  vision: Cctv,
  pro: Wrench,
};

const autoFeatureItems = [
  'Centrais multimídia, som e conectividade a bordo',
  'Rastreamento veicular 4G com bloqueio pelo app',
  'Kits LED com corte de luz preciso e regulagem de farol',
  'Elétrica 12V, alarmes e acessórios com garantia real',
];

export default function TechHomePage() {
  const articles = getArticles().slice(0, 3);

  return (
    <>
      {/* ===== 1. HERO — cinematic, mockup order ===== */}
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
              {BRAND.tagline}
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Tecnologia para{' '}
              <span className="bg-gradient-to-r from-ahblue-300 to-ahblue-500 bg-clip-text text-transparent">
                o carro, para a casa
              </span>{' '}
              e para o seu dia.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Peças, acessórios, eletrônicos, segurança e instalação especializada em Anápolis.
              Conteúdo honesto, curadoria técnica e um ecossistema que conecta tudo isso — da
              garagem à sala de casa.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={storeSite.url} size="lg" variant="primary">
                Explorar produtos
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Button href="/instalacao-anapolis" size="lg" variant="outline-dark">
                <MapPin className="h-5 w-5" aria-hidden="true" />
                Instalação em Anápolis
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

          {/* Collage panel — recreated with design system tiles (no pasted imagery) */}
          <div className="relative" aria-hidden="true">
            <div className="ah-glass relative ml-auto grid w-full max-w-lg grid-cols-2 gap-4 rounded-2xl p-5">
              <div className="ah-glass col-span-2 flex items-center justify-between rounded-xl p-4">
                <LogoHorizontal size="sm" tagline={false} />
                <span className="text-[11px] italic text-slate-400">
                  &ldquo;{BRAND.supportingLine}&rdquo;
                </span>
              </div>
              {collageTiles.map((tile, i) => (
                <div
                  key={tile.label}
                  className={`ah-glass rounded-xl p-3 ${i % 2 === 1 ? 'translate-y-2' : ''}`}
                >
                  <div
                    className="mb-3 flex aspect-[4/3] w-full items-center justify-center rounded-lg"
                    style={{ background: `linear-gradient(140deg, ${tile.from} 0%, ${tile.to} 100%)` }}
                  >
                    <tile.icon className="h-10 w-10 text-white/95" strokeWidth={1.4} aria-hidden="true" />
                  </div>
                  <p className="text-xs font-semibold text-white">{tile.label}</p>
                  <p className="text-[11px] text-ahblue-300">{tile.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 2. Universe cards ===== */}
      <Section ariaLabel="Universos AutoHub360">
        <Container>
          <SectionHeader
            overline="Universos"
            title="Onde a sua necessidade se encaixa"
            subtitle="Oito universos de produto, um mesmo padrão de curadoria. Toque para explorar o catálogo completo na loja."
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 lg:gap-4">
            {UNIVERSES.map((u) => (
              <li key={u.key}>
                <UniverseCard
                  universe={u}
                  href={`${storeSite.url}/categoria/${u.slug}`}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ===== 3. Ecosystem ===== */}
      <Section dark ariaLabel="O ecossistema AutoHub360" className="bg-navy-900">
        <Container>
          <SectionHeader
            dark
            overline="Ecossistema"
            title="Um ecossistema, dois pontos de contato"
            subtitle="Aqui no autohub360.tech você encontra conteúdo, orientação técnica e informações de serviço. Na autohub360.store você compra com entrega para todo o Brasil. Mesma equipe, mesmos padrões, experiência completa."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <a
              href={storeSite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 transition-all hover:border-ahblue-400/50 hover:bg-white/10 sm:p-8"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-ahblue-500/20 text-ahblue-300">
                <ShoppingCart className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl font-extrabold text-white">Conheça a loja</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                Catálogo completo de peças, acessórios, eletrônicos e soluções inteligentes, com
                busca por veículo, ofertas reais e checkout seguro. Entrega nacional e retirada
                local em Anápolis.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-bold text-ahblue-300">
                Ir para autohub360.store
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
            <a
              href={whatsappLink('general')}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 transition-all hover:border-[#25d366]/50 hover:bg-white/10 sm:p-8"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#25d366]/20 text-[#4ade80]">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl font-extrabold text-white">Fale com especialista</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                Antes de comprar, converse com quem trabalha com isso todos os dias: compatibilidade
                com o seu veículo, dimensionamento de energia, indicação de produto e agendamento
                de instalação. Atendimento humano, sem robô.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-bold text-[#4ade80]">
                Chamar no WhatsApp
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </a>
          </div>

          <div className="mt-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-ahblue-300">
              Sub-marcas do grupo
            </p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {BRAND.subBrands.map((sub) => {
                const Icon = subBrandIcons[sub.key] ?? BadgeCheck;
                return (
                  <li
                    key={sub.key}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-ahblue-400/40"
                  >
                    <Icon className="mb-3 h-5 w-5 text-ahblue-300" aria-hidden="true" />
                    <p className="font-display text-sm font-extrabold text-white">{sub.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{sub.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ===== 4. Automotive technology feature ===== */}
      <Section ariaLabel="Tecnologia automotiva">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahblue-500">
                Auto &amp; Mobility
              </p>
              <h2 className="font-display text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
                Seu carro mais conectado, mais seguro e mais confortável
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700 sm:text-base">
                A eletrônica embarcada deixou de ser luxo: é o que separa um carro apenas
                utilizado de um carro bem equipado. Trabalhamos com multimídia, rastreamento,
                iluminação LED e elétrica automotiva com um critério simples — só indicamos o que
                instalaríamos no nosso próprio carro.
              </p>
              <ul className="mt-6 space-y-3">
                {autoFeatureItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-ink-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ahblue-500/15 text-ahblue-600">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Button href={`${storeSite.url}/categoria/auto`} variant="primary" size="lg">
                  Ver soluções automotivas
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="relative" aria-hidden="true">
              <div className="ah-glass grid w-full grid-cols-2 gap-4 rounded-2xl p-5">
                <div className="ah-glass col-span-2 flex items-center justify-between rounded-xl p-4">
                  <span className="font-display text-sm font-bold text-white">
                    Auto &amp; Mobility
                  </span>
                  <span className="text-[11px] italic text-slate-400">
                    compatibilidade guiada por veículo
                  </span>
                </div>
                {[
                  { icon: MonitorSmartphone, label: 'Central multimídia', from: '#0d1b30', to: '#1e6feb' },
                  { icon: Speaker, label: 'Som e amplificação', from: '#10459b', to: '#4d90ff' },
                  { icon: Lightbulb, label: 'Kit LED', from: '#e05e04', to: '#ff9433' },
                  { icon: ShieldCheck, label: 'Rastreador 4G', from: '#0a1628', to: '#1559c4' },
                ].map((tile, i) => (
                  <div key={tile.label} className={`ah-glass rounded-xl p-3 ${i % 2 === 1 ? 'translate-y-2' : ''}`}>
                    <div
                      className="mb-3 flex aspect-[5/2] w-full items-center justify-center rounded-lg"
                      style={{ background: `linear-gradient(140deg, ${tile.from} 0%, ${tile.to} 100%)` }}
                    >
                      <tile.icon className="h-7 w-7 text-white/95" strokeWidth={1.4} aria-hidden="true" />
                    </div>
                    <p className="text-xs font-semibold text-white">{tile.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ===== 5. Smart Living feature ===== */}
      <Section ariaLabel="Smart Living" className="bg-surface-50">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1" aria-hidden="true">
              <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-[var(--ah-shadow-card)]">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Lightbulb, label: 'Iluminação inteligente', sub: 'Cenas e rotinas por voz' },
                    { icon: Cctv, label: 'Câmeras Wi-Fi', sub: 'Casa monitorada de onde você estiver' },
                    { icon: Zap, label: 'Tomadas smart', sub: 'Consumo sob controle' },
                    { icon: Wifi, label: 'Automação', sub: 'Rotinas que trabalham por você' },
                  ].map((tile) => (
                    <div key={tile.label} className="rounded-xl border border-surface-200 bg-surface-50 p-4">
                      <tile.icon className="mb-3 h-6 w-6 text-ahblue-600" aria-hidden="true" />
                      <p className="text-sm font-semibold text-ink-900">{tile.label}</p>
                      <p className="mt-1 text-xs leading-snug text-ink-500">{tile.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="mb-1.5 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahblue-500">
                Smart Living
              </p>
              <h2 className="font-display text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
                Casa inteligente começa resolvendo problemas reais
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700 sm:text-base">
                Automação residencial não é sobre ter o gadget mais novo — é sobre luz que acende
                na hora certa, câmera que avisa quem chegou e a certeza de que o ferro ficou mesmo
                desligado. Comece pelo que incomoda, um cômodo por vez.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-700 sm:text-base">
                Selecionamos dispositivos compatíveis entre si, com suporte aos principais
                ecossistemas de voz, e publicamos guias práticos para você não errar na primeira
                compra.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={`${storeSite.url}/categoria/casa-inteligente`} variant="primary" size="lg">
                  Ver casa inteligente
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button href="/hub/casa-inteligente-por-onde-comecar" variant="ghost-dark" size="lg">
                  Guia: por onde começar
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ===== 6. Energy feature ===== */}
      <Section ariaLabel="Energia">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahblue-500">
                Energy
              </p>
              <h2 className="font-display text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
                Energia onde você precisa, na hora que você precisa
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700 sm:text-base">
                Estações de energia portáteis e placas solares dobráveis mudaram a relação das
                pessoas com a eletricidade: trabalhar de qualquer lugar, acampar com conforto e
                manter o essencial funcionando quando a rede cai.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-700 sm:text-base">
                Nossa equipe ajuda você a dimensionar a solução certa — capacidade em Wh, potência
                do inversor e recarga solar — para você investir exatamente no que a sua rotina
                exige, nem mais nem menos.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={`${storeSite.url}/categoria/energia`} variant="primary" size="lg">
                  Ver linha de energia
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button href="/hub/energia-solar-portatil-quando-faz-sentido" variant="ghost-dark" size="lg">
                  Ler: energia solar portátil
                </Button>
              </div>
            </div>
            <div className="relative" aria-hidden="true">
              <div className="grid w-full grid-cols-2 gap-4">
                <ProductThumb
                  imageKey="power-station"
                  alt=""
                  className="aspect-[4/3] w-full rounded-2xl"
                  size="lg"
                />
                <ProductThumb
                  imageKey="solar-panel"
                  alt=""
                  className="aspect-[4/3] w-full translate-y-4 rounded-2xl"
                  size="lg"
                />
                <div className="col-span-2 rounded-2xl border border-surface-200 bg-white p-4 shadow-[var(--ah-shadow-card)]">
                  <p className="text-sm font-semibold text-ink-900">
                    Dimensionamento guiado antes da compra
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    A equipe orienta por WhatsApp: o que você quer ligar, por quanto tempo e com
                    qual fonte de recarga — aí sim, a recomendação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ===== 7. Generoso installation ===== */}
      <section aria-label="Instalação e assistência em Anápolis" className="relative overflow-hidden bg-navy-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-ahorange-500/10 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-ahblue-500/15 blur-[100px]"
        />
        <Container className="relative grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ahorange-400">
              Compra + Instalação
            </p>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              Instalação e assistência em Anápolis
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300">
              Equipar o carro é só metade do trabalho — a outra metade é instalar direito. Por
              isso a AutoHub360 mantém parceria oficial com o {GENEROSO.name}, referência em
              instalação de acessórios em {GENEROSO.city} - {GENEROSO.state}: multimídia, câmeras
              de ré, rastreadores, LED com regulagem de farol, som e alarmes.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {GENEROSO.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ahorange-500/20 text-ahorange-300">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/instalacao-anapolis" variant="accent" size="lg">
                <Wrench className="h-5 w-5" aria-hidden="true" />
                Agendar instalação
              </Button>
              <Button href="/instalacao-anapolis#generoso" variant="ghost-light" size="lg">
                Conheça a {GENEROSO.name}
              </Button>
            </div>
          </div>
          <div className="ah-glass rounded-2xl p-6">
            <p className="font-display text-lg font-extrabold text-white">
              {GENEROSO.name}
              <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-widest text-ahorange-400">
                parceiro oficial
              </span>
            </p>
            <blockquote className="mt-5 border-l-2 border-ahorange-500/60 pl-4 text-[15px] italic leading-relaxed text-slate-300">
              &ldquo;{GENEROSO.tagline}&rdquo;
            </blockquote>
            <p className="mt-5 border-t border-white/10 pt-4 text-sm text-slate-400">
              Serviços com horário agendado, execução conforme especificação do fabricante e
              orientação de uso no final. {GENEROSO.region}.
            </p>
          </div>
        </Container>
        <div className="relative border-t border-white/10">
          <Container className="flex flex-wrap items-center gap-2 py-4 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-ahorange-400" aria-hidden="true" />
            <span className="font-semibold text-slate-200">Anápolis - GO</span>
            <span aria-hidden="true">—</span>
            <span>Tecnologia bem instalada para você.</span>
          </Container>
        </div>
      </section>

      {/* ===== 8. Pro / B2B ===== */}
      <Section ariaLabel="AutoHub360 Pro">
        <Container>
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-ahblue-600 via-ahblue-500 to-ahblue-700 p-6 text-white shadow-[0_20px_50px_rgb(30_111_235/0.35)] sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  AutoHub360 Pro
                </p>
                <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                  Soluções para profissionais e empresas
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-blue-50">
                  Oficinas, frotas, revendas e instaladores têm necessidades diferentes de quem
                  compra uma peça só. O time Pro atende com condições comerciais dedicadas,
                  curadoria de catálogo e suporte técnico de verdade.
                </p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {[
                    'Condições para revenda e volume',
                    'Curadoria de produtos por perfil de operação',
                    'Suporte técnico e pós-venda dedicado',
                    'Instalação para frotas em Anápolis - GO',
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-blue-50">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="/contato?assunto=pro" variant="white" size="lg">
                    Falar com o time Pro
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Button>
                  <a
                    href="mailto:pro@autohub360.tech"
                    className="inline-flex h-12 items-center gap-2 rounded-[10px] border-2 border-white/70 px-5 font-display text-base font-bold text-white transition-colors hover:bg-white/10"
                  >
                    <Mail className="h-5 w-5" aria-hidden="true" />
                    pro@autohub360.tech
                  </a>
                </div>
              </div>
              <div className="rounded-2xl bg-navy-950/30 p-6 backdrop-blur-sm">
                <p className="font-display text-sm font-bold uppercase tracking-wider text-blue-100">
                  Para quem é
                </p>
                <ul className="mt-4 space-y-3 text-sm text-blue-50">
                  {[
                    { icon: Wrench, label: 'Oficinas mecânicas e elétricas' },
                    { icon: Truck, label: 'Gestores de frota e logística' },
                    { icon: ShoppingCart, label: 'Revendas e lojas de acessórios' },
                    { icon: ClipboardCheck, label: 'Instaladores e integradores' },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      {item.label}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-white/15 pt-4 text-xs leading-relaxed text-blue-100">
                  Conte para a gente o tamanho da sua operação — montamos a proposta a partir
                  disso.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ===== 9. Editorial ===== */}
      <Section ariaLabel="Do nosso blog" className="bg-surface-50">
        <Container>
          <SectionHeader
            overline="Hub AutoHub360"
            title="Do nosso blog"
            subtitle="Guias práticos e análises honestas, escritos por quem instala e usa essas tecnologias todos os dias."
            action={
              <Button href="/hub" variant="ghost-dark" size="sm">
                Ver todos os posts
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug} className="flex">
                <article className="ah-card-hover flex w-full flex-col overflow-hidden rounded-xl border border-surface-200 bg-white shadow-[var(--ah-shadow-card)]">
                  <Link href={`/hub/${article.slug}`} className="flex h-full flex-col">
                    <div className="relative">
                      <ProductThumb
                        imageKey={article.imageKey}
                        alt={`Capa do artigo: ${article.title}`}
                        className="aspect-video w-full rounded-none"
                        size="md"
                      />
                      <Badge tone="blue" className="absolute left-3 top-3 bg-white/95">
                        {article.categoryLabel}
                      </Badge>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-base font-extrabold leading-snug text-ink-900 transition-colors group-hover:text-ahblue-600">
                        {article.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                        {article.excerpt}
                      </p>
                      <p className="mt-4 inline-flex items-center gap-2 font-display text-sm font-bold text-ahblue-600">
                        Ler mais
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </p>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ===== 10. Trust + newsletter ===== */}
      <Section ariaLabel="Confiança e novidades" className="bg-surface-100">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="mb-5 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahblue-500">
                Por que confiar
              </p>
              <TrustStrip
                items={[
                  { icon: 'truck', title: 'Entrega nacional', subtitle: 'Para todo o Brasil' },
                  { icon: 'pin', title: 'Instalação especializada', subtitle: 'Anápolis - GO' },
                  { icon: 'headset', title: 'Suporte especializado', subtitle: 'Antes e depois da compra' },
                  { icon: 'shield', title: 'Compra segura', subtitle: 'Na loja oficial' },
                ]}
              />
              <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-500">
                A AutoHub360 nasceu da rotina de instalação: sabemos o que funciona porque
                instalamos. A compra acontece na nossa loja oficial —{' '}
                <a
                  href={storeSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ahblue-600 underline underline-offset-2 hover:text-ahblue-700"
                >
                  autohub360.store
                </a>{' '}
                — com as mesmas pessoas que escrevem este site por trás do atendimento.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-[var(--ah-shadow-card)] sm:p-8">
              <NewsletterForm source="tech-home" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
