import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Badge, Button, Container, ProductThumb, Section } from '@autohub360/ui';
import { techSite } from '@autohub360/config';
import {
  getArticles,
} from '@autohub360/catalog/server';;

export const metadata: Metadata = {
  title: 'Hub AutoHub360 — Guias, novidades e tecnologia',
  description:
    'Conteúdo prático sobre tecnologia automotiva, casa inteligente, energia e segurança: guias de compra, comparações e dicas de quem instala todos os dias.',
  alternates: { canonical: `${techSite.url}/hub` },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function HubPage() {
  const articles = getArticles();

  return (
    <>
      <section className="ah-hero-glow relative overflow-hidden text-white">
        <Container className="relative py-14 sm:py-20">
          <p className="mb-3 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahblue-300">
            Hub AutoHub360
          </p>
          <h1 className="max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Conteúdo para quem vive{' '}
            <span className="bg-gradient-to-r from-ahblue-300 to-ahblue-500 bg-clip-text text-transparent">
              tecnologia todos os dias
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Guias de compra, comparações honestas e dicas práticas de instalação — escritos por
            quem entende de eletrônica automotiva, casa inteligente e energia no mundo real.
          </p>
        </Container>
      </section>

      <Section ariaLabel="Artigos do hub" className="bg-surface-50">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug} className="flex">
                <Link
                  href={`/hub/${article.slug}`}
                  className="group flex w-full flex-col overflow-hidden rounded-xl border border-surface-200 bg-white shadow-[var(--ah-shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--ah-shadow-float)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ahblue-400"
                >
                  <ProductThumb
                    imageKey={article.imageKey}
                    alt={article.title}
                    className="aspect-[16/9] w-full rounded-b-none"
                  />
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <div className="flex items-center gap-2">
                      <Badge tone="blue">{article.categoryLabel}</Badge>
                    </div>
                    <h2 className="font-display text-lg font-bold leading-snug text-ink-900 transition-colors group-hover:text-ahblue-600">
                      {article.title}
                    </h2>
                    <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">
                      {article.excerpt}
                    </p>
                    <div className="mt-1 flex items-center justify-between border-t border-surface-100 pt-3 text-xs text-ink-500">
                      <span>{formatDate(article.publishedAt)}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {article.readMinutes} min de leitura
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ahblue-600">
                      Ler mais
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

          <div className="mt-10 rounded-xl border border-ahblue-500/25 bg-gradient-to-br from-ahblue-500/[0.07] to-white p-6 text-center sm:p-8">
            <h2 className="font-display text-xl font-extrabold text-ink-900">
              Gostou de algum produto dos nossos guias?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-500">
              Tudo o que testamos e recomendamos está na loja — com entrega nacional e instalação
              especializada em Anápolis.
            </p>
            <Button href="https://autohub360.store" className="mt-4">
              Explorar a loja
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
