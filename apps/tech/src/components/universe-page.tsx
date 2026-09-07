import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronRight,
  MessageCircle,
  ShoppingCart,
  Truck,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Accordion,
  Breadcrumbs,
  breadcrumbJsonLd,
  Button,
  Container,
  ProductThumb,
  Section,
  SectionHeader,
} from '@autohub360/ui';
import { storeSite, techSite, whatsappLink } from '@autohub360/config';

export interface UniverseSolution {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface UniverseFaq {
  question: string;
  answer: string;
}

export interface RelatedLink {
  label: string;
  description: string;
  href: string;
  external?: boolean;
}

export interface UniversePageProps {
  /** Route path, e.g. "/auto-mobility" — used for canonical + JSON-LD. */
  path: string;
  breadcrumbLabel: string;
  heroOverline: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string[];
  benefits: string[];
  solutionsTitle: string;
  solutionsIntro: string;
  solutions: UniverseSolution[];
  faq: UniverseFaq[];
  relatedLinks: RelatedLink[];
  /** Universe slug in the store, e.g. "auto". */
  storeCategorySlug: string;
  imageKey: string;
  ctaNote: string;
}

export function UniversePage({
  path,
  breadcrumbLabel,
  heroOverline,
  heroTitle,
  heroSubtitle,
  intro,
  benefits,
  solutionsTitle,
  solutionsIntro,
  solutions,
  faq,
  relatedLinks,
  storeCategorySlug,
  imageKey,
  ctaNote,
}: UniversePageProps) {
  const storeCategoryUrl = `${storeSite.url}/categoria/${storeCategorySlug}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbJsonLdData = breadcrumbJsonLd([{ label: breadcrumbLabel, href: path }], techSite.url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLdData) }}
      />

      <Container className="py-4">
        <Breadcrumbs items={[{ label: breadcrumbLabel, href: path }]} />
      </Container>

      {/* Hero */}
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
        <Container className="relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-ahblue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-ahorange-500" aria-hidden="true" />
              {heroOverline}
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.9rem]">
              {heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {heroSubtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={storeCategoryUrl} size="lg" variant="primary">
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                Ver produtos na loja
              </Button>
              <Button href={whatsappLink('general')} size="lg" variant="outline-light">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Falar com especialista
              </Button>
            </div>
          </div>

          <div className="relative" aria-hidden="true">
            <div className="ah-glass relative ml-auto w-full max-w-md rounded-2xl p-4">
              <ProductThumb
                imageKey={imageKey}
                alt=""
                className="aspect-[4/3] w-full rounded-xl"
                size="lg"
              />
              <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-300">
                <li className="rounded-lg bg-white/5 px-2 py-2.5">
                  <Truck className="mx-auto mb-1 h-4 w-4 text-ahblue-300" aria-hidden="true" />
                  Entrega nacional
                </li>
                <li className="rounded-lg bg-white/5 px-2 py-2.5">
                  <Wrench className="mx-auto mb-1 h-4 w-4 text-ahorange-300" aria-hidden="true" />
                  Instalação Anápolis
                </li>
                <li className="rounded-lg bg-white/5 px-2 py-2.5">
                  <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-ahblue-300" aria-hidden="true" />
                  Garantia real
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <Section ariaLabel={`Sobre ${breadcrumbLabel}`}>
        <Container>
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
              {`Por que ${breadcrumbLabel}?`}
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink-700 sm:text-base">
              {intro.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section ariaLabel="Benefícios" className="bg-surface-50">
        <Container>
          <SectionHeader
            overline="Por que comprar com a AutoHub360"
            title="Vantagens que fazem diferença no dia a dia"
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 rounded-xl border border-surface-200 bg-white p-4 shadow-[var(--ah-shadow-card)]"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ahblue-500/15 text-ahblue-600">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium leading-snug text-ink-900">{benefit}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Solutions */}
      <Section ariaLabel="Soluções">
        <Container>
          <SectionHeader overline="O que você encontra" title={solutionsTitle} subtitle={solutionsIntro} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution) => (
              <li key={solution.title}>
                <div className="ah-card-hover h-full rounded-xl border border-surface-200 bg-white p-5 shadow-[var(--ah-shadow-card)]">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-ahblue-500/15 to-ahblue-500/5 text-ahblue-600">
                    <solution.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-base font-extrabold text-ink-900">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{solution.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={storeCategoryUrl} variant="ghost-dark" size="sm">
              Explorar {breadcrumbLabel} na loja
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* CTA band */}
      <section aria-label="Próximos passos" className="ah-dark bg-navy-900">
        <Container className="py-12 sm:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ahorange-400">
                Próximo passo
              </p>
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                Do conteúdo para a prática, com quem entende
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300">{ctaNote}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={storeCategoryUrl} variant="primary" size="lg">
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  Comprar na loja
                </Button>
                <Button href={whatsappLink('general')} variant="outline-light" size="lg">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Tirar dúvidas no WhatsApp
                </Button>
              </div>
            </div>
            <div className="ah-glass rounded-2xl p-6">
              <p className="font-display text-sm font-bold uppercase tracking-wider text-ahblue-300">
                Como funciona
              </p>
              <ol className="mt-4 space-y-3.5 text-sm text-slate-200">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ahblue-500/20 text-xs font-bold text-ahblue-200">
                    1
                  </span>
                  Escolha o produto ideal na loja — com filtro por veículo quando aplicável.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ahblue-500/20 text-xs font-bold text-ahblue-200">
                    2
                  </span>
                  Receba em casa com envio para todo o Brasil ou retire em Anápolis.
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ahblue-500/20 text-xs font-bold text-ahblue-200">
                    3
                  </span>
                  Precisa de instalação? Agende com o parceiro oficial em Anápolis - GO.
                </li>
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <Section ariaLabel="Perguntas frequentes">
        <Container>
          <SectionHeader
            overline="Dúvidas frequentes"
            title="Perguntas que recebemos toda semana"
          />
          <div className="max-w-3xl">
            <Accordion items={faq} />
          </div>
        </Container>
      </Section>

      {/* Related */}
      <Section ariaLabel="Continue explorando" className="bg-surface-50">
        <Container>
          <SectionHeader overline="Continue explorando" title="Talvez você também queira ver" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-xl border border-surface-200 bg-white p-5 shadow-[var(--ah-shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--ah-shadow-float)]"
                  >
                    <span className="flex items-center justify-between font-display text-base font-extrabold text-ink-900">
                      {link.label}
                      <ChevronRight
                        className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-2 text-sm leading-relaxed text-ink-500">
                      {link.description}
                    </span>
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="group flex h-full flex-col rounded-xl border border-surface-200 bg-white p-5 shadow-[var(--ah-shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--ah-shadow-float)]"
                  >
                    <span className="flex items-center justify-between font-display text-base font-extrabold text-ink-900">
                      {link.label}
                      <ChevronRight
                        className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-2 text-sm leading-relaxed text-ink-500">
                      {link.description}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
