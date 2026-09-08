import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Car,
  House,
  MapPin,
  ShieldCheck,
  Users,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Container,
  ProductThumb,
  TrustStrip,
  UniverseCard,
} from '@autohub360/ui';
import { BRAND, GENEROSO, storeSite, techSite, UNIVERSES, whatsappLink } from '@autohub360/config';
import { getArticles } from '@autohub360/catalog/server';

export const metadata = {
  title: { absolute: techSite.title },
  description: techSite.description,
  alternates: { canonical: '/' },
};

const heroHighlights = [
  { icon: Car, title: 'Mobilidade', sub: 'mais inteligente' },
  { icon: House, title: 'Casas', sub: 'mais seguras' },
  { icon: Zap, title: 'Energia', sub: 'mais eficiente' },
  { icon: Users, title: 'Pessoas', sub: 'mais conectadas' },
];

const serviceHighlights = [
  { label: 'Instalação especializada', icon: Wrench },
  { label: 'Mão de obra qualificada', icon: ShieldCheck },
  { label: 'Atendimento local', icon: MapPin },
  { label: 'Mais tecnologia na sua rotina', icon: Wifi },
];

function GenerosoMark() {
  return (
    <div className="inline-flex flex-col items-center leading-none">
      <div className="relative px-2 pt-2">
        <span className="absolute left-1/2 top-0 h-[2px] w-[78%] -translate-x-1/2 -skew-x-[28deg] rounded-full bg-red-500" />
        <span className="-skew-x-[8deg] font-display text-2xl font-extrabold tracking-[-0.05em] text-white">
          GENEROSO
        </span>
      </div>
      <span className="mt-1 text-[10px] font-bold tracking-[0.28em] text-red-500">AUTO CENTER</span>
    </div>
  );
}

export default function TechHomePage() {
  const articles = getArticles().slice(0, 3);

  return (
    <>
      <section className="tech-cinematic-hero relative overflow-hidden text-white">
        <div className="tech-hero-vignette absolute inset-0" aria-hidden="true" />
        <Container className="relative grid min-h-[485px] items-center gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-0">
          <div className="relative z-10 max-w-[600px] py-4 lg:py-10">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-ahblue-300">
              AutoHub360 · {BRAND.tagline}
            </p>
            <h1 className="font-display text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-[3.1rem] lg:text-[3.65rem]">
              Tecnologia para o carro,
              <br />
              para a casa e para o seu dia.
            </h1>
            <p className="mt-4 max-w-[520px] text-[14px] leading-[1.55] text-slate-200 sm:text-[15px]">
              Peças, acessórios, eletrônicos, segurança e instalação especializada em Anápolis —
              com curadoria técnica de quem realmente instala e usa estas soluções.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={storeSite.url} size="md" variant="primary" className="min-w-[168px]">
                Explorar produtos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="/instalacao-anapolis" size="md" variant="outline-dark" className="min-w-[190px] bg-[#041326]/25 backdrop-blur-sm">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Instalação em Anápolis
              </Button>
            </div>
            <ul className="mt-7 grid max-w-[560px] grid-cols-2 gap-x-5 gap-y-3 border-t border-white/10 pt-5 sm:grid-cols-4">
              {heroHighlights.map((item) => (
                <li key={item.title} className="flex items-center gap-2.5">
                  <item.icon className="h-[18px] w-[18px] shrink-0 text-ahblue-400" strokeWidth={1.7} aria-hidden="true" />
                  <span className="text-[9.5px] leading-[1.2] text-slate-300">
                    <strong className="block text-[10px] font-semibold text-white">{item.title}</strong>
                    {item.sub}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tech-device-stage relative hidden h-[455px] lg:block" aria-hidden="true">
            <div className="absolute bottom-[19px] left-[2%] w-[35%] -rotate-2 drop-shadow-2xl">
              <ProductThumb imageKey="head-unit" alt="" size="lg" className="aspect-[1.35/1] border-white/20 shadow-[0_22px_50px_rgba(0,0,0,.35)]" />
            </div>
            <div className="absolute bottom-[27px] left-[36%] w-[19%] rotate-1 drop-shadow-2xl">
              <ProductThumb imageKey="led-kit" alt="" size="lg" className="aspect-square border-white/15 shadow-[0_22px_50px_rgba(0,0,0,.35)]" />
            </div>
            <div className="absolute right-[3%] top-[35px] w-[22%] rotate-1 drop-shadow-2xl">
              <ProductThumb imageKey="smart-home" alt="" size="lg" className="aspect-[.88/1] border-white/20 shadow-[0_22px_50px_rgba(0,0,0,.32)]" />
            </div>
            <div className="absolute right-[22%] top-[28px] w-[25%] -rotate-2 drop-shadow-2xl">
              <ProductThumb imageKey="dashcam" alt="" size="lg" className="aspect-[1.3/1] border-white/15 shadow-[0_22px_50px_rgba(0,0,0,.32)]" />
            </div>
            <div className="absolute bottom-[26px] right-[4%] rounded-xl border border-white/10 bg-[#041326]/72 px-4 py-3 text-right backdrop-blur-md">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-ahblue-300">Mais tecnologia</p>
              <p className="mt-1 text-[12px] italic text-white">para o que importa.</p>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="Universos AutoHub360" className="border-b border-slate-200 bg-[#f8fafc] py-3.5 sm:py-4">
        <Container>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {UNIVERSES.map((u) => (
              <li key={u.key}>
                <UniverseCard universe={u} href={`${storeSite.url}/categoria/${u.slug}`} className="h-full" />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="Instalação e assistência em Anápolis" className="generoso-cinematic relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#020b16]/98 via-[#031326]/82 to-[#020b16]/65" aria-hidden="true" />
        <Container className="relative grid min-h-[320px] items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-[560px]">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.3em] text-slate-400">Serviço local</p>
            <h2 className="mt-2 font-display text-[2rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-[2.55rem]">
              Instalação e assistência
              <br />
              em <span className="text-ahblue-400">Anápolis.</span>
            </h2>
            <p className="mt-4 max-w-[500px] text-[13.5px] leading-relaxed text-slate-200">
              Conte com a experiência da {GENEROSO.name}, nosso parceiro oficial, para instalação
              especializada de acessórios, eletrônicos automotivos e segurança veicular.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/instalacao-anapolis" variant="accent" size="md">
                Agendar instalação
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <a href="#generoso" className="inline-flex h-11 items-center px-3 text-[12px] font-semibold text-ahblue-300 underline decoration-ahblue-400/40 underline-offset-4 hover:text-white">
                Conheça a Generoso Auto Center
              </a>
            </div>
          </div>

          <div id="generoso" className="ml-auto w-full max-w-[475px] rounded-2xl border border-white/12 bg-[#06162a]/72 p-5 shadow-[0_24px_60px_rgba(0,0,0,.38)] backdrop-blur-md sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <GenerosoMark />
              <span className="rounded-full border border-ahblue-400/30 bg-ahblue-500/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-ahblue-300">Parceiro em Anápolis</span>
            </div>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {serviceHighlights.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-[12px] text-slate-200">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-ahblue-300">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/10 pt-4 text-right text-[13px] italic text-slate-300">“{GENEROSO.tagline}”</p>
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 bg-white py-5" aria-label="Confiança AutoHub360">
        <Container>
          <TrustStrip
            items={[
              { icon: 'truck', title: 'Entrega nacional', subtitle: 'Para todo o Brasil' },
              { icon: 'pin', title: 'Retirada local', subtitle: 'Em Anápolis - GO' },
              { icon: 'headset', title: 'Suporte especializado', subtitle: 'Antes e depois da compra' },
              { icon: 'shield', title: 'Compra segura', subtitle: 'Seus dados protegidos' },
            ]}
          />
        </Container>
      </section>

      <section className="bg-[#f8fafc] py-9 sm:py-11" aria-label="Do nosso blog">
        <Container>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ahblue-600">Hub AutoHub360</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.03em] text-ink-900">Do nosso blog</h2>
              <p className="mt-1 text-[12px] text-ink-500">Dicas, novidades e tecnologia para o seu dia a dia.</p>
            </div>
            <Link href="/hub" className="hidden items-center gap-1.5 text-[11px] font-bold text-ahblue-600 hover:text-ahblue-700 sm:flex">
              Ver todos os posts <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-3 md:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link href={`/hub/${article.slug}`} className="group grid h-full grid-cols-[112px_1fr] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_5px_18px_rgba(15,23,42,.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,.1)] sm:grid-cols-[132px_1fr]">
                  <ProductThumb imageKey={article.imageKey} alt="" className="h-full min-h-[112px] rounded-none border-0 border-r border-slate-200" />
                  <div className="p-4">
                    <Badge tone="outline" className="mb-2 text-[8px]">{article.categoryLabel}</Badge>
                    <h3 className="line-clamp-2 font-display text-[14px] font-extrabold leading-[1.25] text-ink-900 group-hover:text-ahblue-600">{article.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[10.5px] leading-relaxed text-ink-500">{article.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-ahblue-600">Ler mais <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-y border-ahblue-400/15 bg-[#06172a] py-6 text-white" aria-label="AutoHub360 Pro">
        <Container className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ahblue-400/20 bg-ahblue-500/10 text-ahblue-300"><Building2 className="h-5 w-5" /></span>
            <div>
              <p className="font-display text-[15px] font-extrabold">AutoHub360 Pro</p>
              <p className="mt-0.5 text-[11px] text-slate-400">Oficinas, instaladores, empresas, frotas e revendedores.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button href="/pro" variant="outline-light" size="sm">Conhecer soluções Pro</Button>
            <Button href={whatsappLink('pro')} variant="primary" size="sm">Falar com especialista</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
