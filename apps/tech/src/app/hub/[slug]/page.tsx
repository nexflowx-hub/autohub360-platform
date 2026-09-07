import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Clock, CheckCircle2, Share2 } from 'lucide-react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Container,
  ProductThumb,
  Section,
  SectionHeader,
} from '@autohub360/ui';
import { techSite, whatsappLink } from '@autohub360/config';
import {
  getArticle,
  getArticles,
} from '@autohub360/catalog/server';;
import { CopyLinkButton } from '@/components/copy-link-button';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: 'Artigo não encontrado' };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${techSite.url}/hub/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
    },
  };
}

/** Maps an article category to the most relevant store category. */
function storeLinkFor(categoryLabel: string): { href: string; label: string } {
  const map: Record<string, { href: string; label: string }> = {
    Iluminação: { href: 'https://autohub360.store/categoria/iluminacao-automotiva', label: 'ver kits de iluminação' },
    Segurança: { href: 'https://autohub360.store/categoria/cameras-e-dashcams', label: 'ver câmeras e dashcams' },
    'Smart Living': { href: 'https://autohub360.store/categoria/casa-inteligente', label: 'ver casa inteligente' },
    Energia: { href: 'https://autohub360.store/categoria/energia-portatil', label: 'ver soluções de energia' },
    'Auto & Tech': { href: 'https://autohub360.store/categoria/cameras-e-dashcams', label: 'ver dashcams' },
  };
  return map[categoryLabel] ?? { href: 'https://autohub360.store', label: 'explorar a loja' };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const others = getArticles().filter((a) => a.slug !== article.slug).slice(0, 2);
  const storeLink = storeLinkFor(article.categoryLabel);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: 'AutoHub360', url: techSite.url },
    publisher: {
      '@type': 'Organization',
      name: 'AutoHub360',
      url: techSite.url,
    },
    mainEntityOfPage: `${techSite.url}/hub/${article.slug}`,
  };

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Container className="py-5">
        <Breadcrumbs items={[{ label: 'Hub', href: '/hub' }, { label: article.title }]} />
      </Container>

      <Section ariaLabel="Artigo" className="bg-white py-8 sm:py-12">
        <Container>
          <article className="mx-auto max-w-3xl">
            <Badge tone="blue">{article.categoryLabel}</Badge>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {article.readMinutes} min de leitura
              </span>
              <CopyLinkButton />
            </div>

            <div className="mt-6">
              <ProductThumb
                imageKey={article.imageKey}
                alt={article.title}
                size="lg"
                className="aspect-[16/8] w-full"
              />
            </div>

            <p className="mt-7 border-l-4 border-ahblue-500 pl-4 text-lg leading-relaxed text-ink-700">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-col gap-8">
              {article.body.map((section, i) => (
                <section key={i} aria-label={section.heading}>
                  <h2 className="mb-3 font-display text-xl font-extrabold text-ink-900 sm:text-2xl">
                    {section.heading}
                  </h2>
                  <div className="flex flex-col gap-3.5">
                    {section.body.map((paragraph, j) => (
                      <p key={j} className="text-[16px] leading-relaxed text-ink-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* CTA band */}
            <div className="mt-10 rounded-xl bg-navy-900 p-6 text-white sm:p-8">
              <h2 className="font-display text-xl font-extrabold">
                Pronto para colocar em prática?
              </h2>
              <p className="mt-2 text-[15px] text-slate-300">
                Encontre os produtos deste guia na loja — com entrega para todo o Brasil e
                instalação especializada em Anápolis - GO.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href={storeLink.href}>
                  {storeLink.label}
                  <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
                </Button>
                <Button href={whatsappLink('fitment')} variant="outline-light">
                  Tirar dúvidas no WhatsApp
                </Button>
              </div>
            </div>
          </article>
        </Container>
      </Section>

      {/* More articles */}
      <Section ariaLabel="Leia também" className="bg-surface-50">
        <Container>
          <SectionHeader overline="Continue lendo" title="Leia também" />
          <ul className="grid gap-5 sm:grid-cols-2">
            {others.map((a) => (
              <li key={a.slug} className="flex">
                <Link
                  href={`/hub/${a.slug}`}
                  className="group flex w-full flex-col overflow-hidden rounded-xl border border-surface-200 bg-white shadow-[var(--ah-shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--ah-shadow-float)] sm:flex-row"
                >
                  <ProductThumb
                    imageKey={a.imageKey}
                    alt={a.title}
                    className="aspect-[16/10] w-full rounded-b-none sm:aspect-auto sm:w-44"
                  />
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <Badge tone="outline">{a.categoryLabel}</Badge>
                    <h3 className="font-display text-base font-bold leading-snug text-ink-900 group-hover:text-ahblue-600">
                      {a.title}
                    </h3>
                    <p className="line-clamp-2 flex-1 text-sm text-ink-500">{a.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-ahblue-600">
                      Ler artigo
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-2 text-sm text-ink-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            Conteúdo editorial da AutoHub360 — sem influência de fabricantes.
            <Share2 className="ml-2 h-4 w-4 text-ink-300" aria-hidden="true" />
          </div>
        </Container>
      </Section>
    </>
  );
}
