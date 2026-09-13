import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleHelp,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@autohub360/commerce';
import { STORE_URL, whatsappLink } from '@autohub360/config';
import { Accordion, Container, ProductThumb } from '@autohub360/ui';
import { getOfferPage, OFFER_PAGES } from '@/lib/offer-pages';
import { OfferCtaTracker, OfferTracker } from '@/components/offer-tracker';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return OFFER_PAGES.map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOfferPage(slug);
  if (!offer) return { title: 'Oferta não encontrada' };

  return {
    title: `${offer.productName} — Oferta AutoHub360`,
    description: offer.lead,
    alternates: { canonical: `${STORE_URL}/ofertas/${offer.slug}` },
    robots: offer.status === 'live' ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: offer.title,
      description: offer.lead,
      type: 'website',
      url: `${STORE_URL}/ofertas/${offer.slug}`,
    },
  };
}

export default async function OfferPageRoute({ params }: Props) {
  const { slug } = await params;
  const offer = getOfferPage(slug);
  if (!offer) notFound();

  const formattedPrice = formatPrice(offer.priceCents, offer.currency);
  const whatsapp = whatsappLink('product', {
    product: `${offer.productName} — campanha ${offer.slug}`,
    sku: offer.sku,
    url: `${STORE_URL}/ofertas/${offer.slug}`,
  });

  return (
    <>
      <OfferTracker slug={offer.slug} sku={offer.sku} />

      <section className="relative overflow-hidden bg-[#020b16] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
          <div className="absolute -left-28 top-12 h-80 w-80 rounded-full bg-ahblue-500/20 blur-[110px]" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-ahorange-500/10 blur-[100px]" />
        </div>
        <Container className="relative grid min-h-[560px] items-center gap-10 py-12 lg:grid-cols-[1.02fr_.98fr] lg:py-16">
          <div className="max-w-[650px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ahblue-300/20 bg-ahblue-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ahblue-200">
              <Sparkles className="h-3.5 w-3.5" />
              {offer.eyebrow}
            </div>
            <h1 className="font-display text-[2.55rem] font-extrabold leading-[.98] tracking-[-0.05em] sm:text-5xl lg:text-[3.65rem]">
              {offer.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-300 sm:text-lg">
              {offer.lead}
            </p>

            <div className="mt-7 flex flex-wrap items-end gap-x-6 gap-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Preço de referência</p>
                <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-white">{formattedPrice}</p>
              </div>
              <p className="max-w-[290px] text-[10.5px] leading-relaxed text-slate-400">{offer.availabilityNote}</p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <OfferCtaTracker
                slug={offer.slug}
                sku={offer.sku}
                href={whatsapp}
                className="ah-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ahblue-500 px-6 font-display text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(30,111,235,.30)] transition-all hover:-translate-y-0.5 hover:bg-ahblue-600"
              >
                <MessageCircle className="h-4.5 w-4.5" />
                {offer.cta}
              </OfferCtaTracker>
              <Link
                href="/buscar"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold text-slate-200 hover:bg-white/[0.08]"
              >
                Ver catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <ul className="mt-8 grid gap-2 text-[11px] text-slate-300 sm:grid-cols-3">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Compra orientada</li>
              <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-ahblue-300" /> Especificação conferida</li>
              <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-ahorange-300" /> Suporte humano + IA</li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[510px]">
            <div className="absolute inset-6 rounded-full bg-ahblue-500/12 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.025] p-5 shadow-[0_35px_90px_rgba(0,0,0,.42)] backdrop-blur-xl sm:p-7">
              <div className="rounded-[22px] bg-white p-4 shadow-2xl">
                <ProductThumb imageKey={offer.imageKey} alt={offer.productName} size="lg" className="aspect-[4/3] w-full" />
              </div>
              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ahblue-300">{offer.sku}</p>
                <h2 className="mt-1.5 font-display text-xl font-extrabold leading-tight text-white">{offer.productName}</h2>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-ahblue-600">Por que faz sentido</p>
            <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
              Benefícios claros. Sem promessa que o produto não consegue cumprir.
            </h2>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {offer.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 rounded-2xl border border-surface-200 bg-surface-50 p-4 text-sm leading-relaxed text-ink-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-y border-surface-200 bg-surface-50 py-12 sm:py-16">
        <Container>
          <div className="grid gap-4 lg:grid-cols-3">
            {offer.proofPoints.map((point, index) => (
              <article key={point.title} className="rounded-2xl border border-surface-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,.06)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ahblue-500/10 font-display text-sm font-extrabold text-ahblue-600">0{index + 1}</span>
                <h2 className="mt-4 font-display text-lg font-extrabold text-ink-900">{point.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{point.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <CircleHelp className="h-8 w-8 text-ahblue-500" />
              <h2 className="mt-4 font-display text-2xl font-extrabold text-ink-900">Antes de comprar</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                As dúvidas que normalmente decidem se este produto é ou não a escolha certa para você.
              </p>
              {offer.slug === 'camera-re-1080p' && (
                <p className="mt-5 flex items-start gap-2 rounded-xl border border-ahorange-500/20 bg-ahorange-500/[0.06] p-3 text-xs leading-relaxed text-ink-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ahorange-500" />
                  Em Anápolis - GO, podemos verificar a instalação e compatibilidade localmente.
                </p>
              )}
            </div>
            <Accordion items={offer.objections.map((item) => ({ title: item.q, content: item.a }))} />
          </div>
        </Container>
      </section>

      <section className="bg-[#06172a] py-12 text-white">
        <Container className="flex max-w-5xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ahblue-300">Próximo passo</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold">Confirme a opção certa antes de pagar.</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-400">A equipe valida compatibilidade, disponibilidade e condição comercial atual.</p>
          </div>
          <OfferCtaTracker
            slug={offer.slug}
            sku={offer.sku}
            href={whatsapp}
            className="ah-button inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-ahblue-500 px-6 font-display text-sm font-extrabold text-white hover:bg-ahblue-600"
          >
            <MessageCircle className="h-4.5 w-4.5" />
            {offer.cta}
          </OfferCtaTracker>
        </Container>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-white/10 bg-[#041326]/95 p-2.5 shadow-2xl backdrop-blur-xl sm:hidden">
        <OfferCtaTracker
          slug={offer.slug}
          sku={offer.sku}
          href={whatsapp}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ahblue-500 font-display text-sm font-extrabold text-white"
        >
          <MessageCircle className="h-4.5 w-4.5" />
          {offer.cta}
        </OfferCtaTracker>
      </div>
    </>
  );
}
