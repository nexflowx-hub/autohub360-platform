import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchX, MessageCircle } from 'lucide-react';
import {
  Button,
  Container,
  ProductCard,
  Section,
} from '@autohub360/ui';
import { UNIVERSES, whatsappLink } from '@autohub360/config';
import {
  searchProducts,
} from '@autohub360/catalog/server';;
import { isSortId } from '@/lib/sort';
import { SortSelect } from '@/components/sort-select';
import { SearchTracker } from '@/components/search-tracker';

interface Props {
  searchParams: Promise<{ q?: string; universo?: string; sort?: string }>;
}

export const metadata: Metadata = {
  title: 'Busca',
  description:
    'Busque peças, acessórios, eletrônicos, segurança e soluções inteligentes em toda a loja AutoHub360.',
  robots: { index: false, follow: true },
};

export default async function BuscarPage({ searchParams }: Props) {
  const { q = '', universo, sort } = await searchParams;
  const query = q.trim();
  const universe = universo && UNIVERSES.some((u) => u.slug === universo) ? universo : undefined;
  const sortId = isSortId(sort) ? sort : undefined;

  const results = query || universe ? searchProducts(query, { universe, sort: sortId }) : [];

  function chipHref(slug?: string) {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (slug) params.set('universo', slug);
    if (sortId && sortId !== 'relevance') params.set('sort', sortId);
    const qs = params.toString();
    return qs ? `/buscar?${qs}` : '/buscar';
  }

  return (
    <>
      <SearchTracker q={query} resultCount={results.length} />

      <Container className="py-6 sm:py-8">
        <BreadcrumbsAlt />
        <h1 className="mt-4 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
          Busca
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-500">
          Encontre peças, acessórios e tecnologia para o seu veículo e a sua casa.
        </p>

        {/* Search form (GET — works without JavaScript) */}
        <form role="search" action="/buscar" method="get" className="mt-6 flex max-w-2xl gap-2">
          <label htmlFor="q" className="sr-only">
            O que você procura?
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Ex.: kit LED, câmera de ré, lâmpada inteligente…"
            className="h-12 w-full rounded-[10px] border-2 border-surface-300 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-300 focus:border-ahblue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-[10px] bg-ahblue-500 px-5 font-display font-bold text-white transition-colors hover:bg-ahblue-600"
          >
            Buscar
          </button>
        </form>

        {/* Universe filter chips */}
        <nav aria-label="Filtrar por universo" className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={chipHref()}
            aria-current={!universe ? 'true' : undefined}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              !universe
                ? 'bg-navy-900 text-white'
                : 'border border-surface-300 bg-white text-ink-700 hover:border-ahblue-400'
            }`}
          >
            Todos os universos
          </Link>
          {UNIVERSES.map((u) => (
            <Link
              key={u.slug}
              href={chipHref(u.slug)}
              aria-current={universe === u.slug ? 'true' : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                universe === u.slug
                  ? 'bg-navy-900 text-white'
                  : 'border border-surface-300 bg-white text-ink-700 hover:border-ahblue-400'
              }`}
            >
              {u.label}
            </Link>
          ))}
        </nav>
      </Container>

      <Section ariaLabel="Resultados da busca" className="bg-surface-50 py-8 sm:py-10">
        <Container>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-700" role="status" aria-live="polite">
              {!query && !universe ? (
                <>Digite um termo ou escolha um universo para começar.</>
              ) : (
                <>
                  <strong className="font-display">{results.length}</strong>{' '}
                  {results.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                  {query && (
                    <>
                      {' '}
                      para <span className="font-semibold">“{query}”</span>
                    </>
                  )}
                  {universe && (
                    <>
                      {' '}
                      em{' '}
                      <span className="font-semibold">
                        {UNIVERSES.find((u) => u.slug === universe)?.label}
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
            {(query || universe) && (
              <SortSelect basePath="/buscar" keep={{ q: query, universo: universe }} current={sortId} />
            )}
          </div>

          {results.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {results.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} className="w-full" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-surface-200 bg-white p-8 text-center sm:p-12">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-100 text-ink-500">
                <SearchX className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-xl font-extrabold text-ink-900">
                {query || universe
                  ? 'Nenhum produto encontrado com esses filtros'
                  : 'Comece a explorar a loja'}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-500">
                {query || universe
                  ? 'Tente outro termo, remova os filtros ou fale com a nossa equipe — encontramos o que você precisa.'
                  : 'Digite o que procura no campo acima, navegue por universo ou peça ajuda ao nosso time.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button href="/buscar" variant="primary">
                  Limpar a busca
                </Button>
                <Button href={whatsappLink('support')} variant="outline-dark">
                  <MessageCircle className="h-4.5 w-4.5" aria-hidden="true" />
                  Perguntar no WhatsApp
                </Button>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

function BreadcrumbsAlt() {
  return (
    <nav aria-label="Trilha de navegação" className="text-[13px] text-ink-500">
      <Link href="/" className="transition-colors hover:text-ahblue-600">
        Início
      </Link>
      <span className="mx-1.5 text-ink-300">/</span>
      <span className="font-medium text-ink-900" aria-current="page">
        Busca
      </span>
    </nav>
  );
}
