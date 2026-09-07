import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import {
  Badge,
  Breadcrumbs,
  Container,
  ProductCard,
  Section,
  SectionHeader,
  UniverseIcon,
} from '@autohub360/ui';
import { UNIVERSES, getUniverse, type Universe } from '@autohub360/config';
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
  getProductsByUniverse,
  getUniverseCategories,
} from '@autohub360/catalog/server';;
import { isSortId, sortProducts } from '@/lib/sort';
import { SortSelect } from '@/components/sort-select';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

/** Universe slugs and category slugs share this route. */
export function generateStaticParams() {
  return [
    ...UNIVERSES.map((u) => ({ slug: u.slug })),
    ...getCategories().map((c) => ({ slug: c.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const universe = getUniverse(slug);
  if (universe) {
    return {
      title: `${universe.label} — ${universe.description}`,
      description: `Explore a linha ${universe.label} da AutoHub360 Store: ${universe.description.toLowerCase()}. Entrega para todo o Brasil e instalação especializada em Anápolis - GO.`,
    };
  }
  const category = getCategoryBySlug(slug);
  if (category) {
    return {
      title: category.name,
      description: `${category.name} na AutoHub360 Store: ${category.description} Entrega nacional, compra segura e retirada em Anápolis - GO.`,
    };
  }
  return { title: 'Categoria não encontrada' };
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort } = await searchParams;
  const sortId = isSortId(sort) ? sort : undefined;

  const universe = getUniverse(slug);
  const category = universe ? undefined : getCategoryBySlug(slug);
  if (!universe && !category) notFound();

  const iconUniverse: Universe =
    universe ?? (universeOf(category!.universe) as Universe);

  const products = universe
    ? sortProducts(getProductsByUniverse(universe.key), sortId)
    : sortProducts(getProductsByCategory(category!.slug), sortId);

  const categories = universe ? getUniverseCategories(universe.key) : [];

  return (
    <>
      <Container className="pt-4">
        <Breadcrumbs
          items={
            universe
              ? [{ label: universe.label }]
              : [
                  { label: universeOf(category!.universe)?.label ?? 'Loja', href: `/categoria/${category!.universe}` },
                  { label: category!.name },
                ]
          }
        />
      </Container>

      {/* Intro header */}
      <Container className="py-6 sm:py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-ahblue-500/15 to-ahblue-500/5 text-ahblue-600">
            <UniverseIcon universe={iconUniverse} className="h-9 w-9" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">
              {universe ? universe.label : category!.name}
            </h1>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-ink-500">
              {universe
                ? `${universe.description}. Tudo o que você precisa em ${universe.label.toLowerCase()}, com entrega nacional e instalação especializada em Anápolis - GO.`
                : category!.description}
            </p>
          </div>
        </div>

        {/* Universe → categories chips */}
        {universe && categories.length > 0 && (
          <nav aria-label={`Categorias de ${universe.label}`} className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-surface-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ahblue-400 hover:text-ahblue-600"
              >
                {c.name}
                <ArrowRight className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        )}
      </Container>

      <Section ariaLabel="Produtos" className="bg-surface-50 py-8 sm:py-10">
        <Container>
          <SectionHeader
            overline={universe ? `Universo ${universe.label}` : 'Categoria'}
            title={`${products.length} ${products.length === 1 ? 'produto' : 'produtos'}`}
            action={
              <SortSelect
                basePath={`/categoria/${slug}`}
                current={sortId}
              />
            }
          />
          {products.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {products.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} className="w-full" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-surface-200 bg-white p-10 text-center">
              <h2 className="font-display text-lg font-extrabold text-ink-900">
                Nenhum produto nesta linha por enquanto
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-500">
                Estamos ampliando o catálogo. Fale com a equipe pelo WhatsApp — encontramos o que
                você precisa.
              </p>
              <Badge tone="blue" className="mt-4">
                Catálogo em expansão
              </Badge>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

function universeOf(universeKey: string): Universe | undefined {
  return UNIVERSES.find((u) => u.key === universeKey);
}
