import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, PackageOpen, Wrench } from 'lucide-react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Price,
  ProductThumb,
  Section,
} from '@autohub360/ui';
import { KITS } from '@autohub360/config';
import {
  getAllProducts,
} from '@autohub360/catalog/server';;
import { formatBRL } from '@autohub360/commerce';

export const metadata: Metadata = {
  title: 'Kits e Combos',
  description:
    'Combos com desconto da AutoHub360: iluminação, segurança veicular, casa inteligente e energia portátil — com opção de instalação especializada em Anápolis - GO.',
};

export default function KitsPage() {
  const bySlug = new Map(getAllProducts().map((p) => [p.slug, p]));

  const kits = KITS.map((kit) => {
    const products = kit.productSlugs
      .map((slug) => bySlug.get(slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    return { kit, products };
  });

  return (
    <>
      <Container className="pt-4">
        <Breadcrumbs items={[{ label: 'Kits e Combos' }]} />
      </Container>

      <Section ariaLabel="Kits e combos com desconto" className="py-8 sm:py-10">
        <Container>
          <div className="mb-8 max-w-2xl sm:mb-10">
            <p className="mb-1.5 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahorange-500">
              Economia em conjunto
            </p>
            <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
              Kits e Combos
            </h1>
            <p className="mt-2 text-[15px] text-ink-500">
              Combinações pensadas para funcionar juntas — com desconto aplicado no conjunto. A
              instalação dos kits veiculares pode ser feita pelo nosso parceiro oficial em Anápolis
              - GO.
            </p>
          </div>

          <ul className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {kits.map(({ kit, products }) => {
              const totalCents = products.reduce((s, p) => s + p.priceCents, 0);
              const bundleCents = Math.round(totalCents * (1 - kit.discountPct / 100));
              const savings = totalCents - bundleCents;
              const complete = products.length === kit.productSlugs.length;
              const inStock = complete && products.every((p) => p.stock > 0);
              const installable = complete && products.some((p) => p.installable);
              return (
                <li key={kit.slug}>
                  <Card hover className="flex h-full flex-col p-4 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <Link
                        href={`/kits/${kit.slug}`}
                        className="relative block shrink-0 self-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ahblue-400"
                        aria-label={`Ver detalhes do ${kit.title}`}
                      >
                        <span className="absolute -left-1 -top-1 z-10 rounded-md bg-ahorange-500 px-2 py-0.5 text-[11px] font-display font-extrabold text-white">
                          -{kit.discountPct}%
                        </span>
                        <ProductThumb
                          imageKey={kit.imageKey}
                          alt={kit.title}
                          size="md"
                          className="aspect-square w-full sm:w-44"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h2 className="font-display text-lg font-extrabold text-ink-900">
                          <Link href={`/kits/${kit.slug}`} className="transition-colors hover:text-ahblue-600">
                            {kit.title}
                          </Link>
                        </h2>
                        <p className="mt-0.5 text-sm font-semibold text-ahblue-600">{kit.subtitle}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">
                          {kit.description}
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {products.map((p) => (
                            <li
                              key={p.id}
                              className="rounded-md bg-surface-100 px-2 py-1 text-[11px] font-medium text-ink-700"
                            >
                              {p.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-surface-100 pt-4">
                      <div>
                        <p className="text-xs text-ink-500">
                          {products.length} {products.length === 1 ? 'item' : 'itens'} ·{' '}
                          <span className="line-through">{formatBRL(totalCents)}</span> separados
                        </p>
                        <Price cents={bundleCents} size="md" showInstallments={false} />
                        <p className="mt-0.5 text-xs font-semibold text-emerald-600">
                          Você economiza {formatBRL(savings)}
                        </p>
                      </div>
                      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        {installable && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ahorange-600">
                            <Wrench className="h-4 w-4" aria-hidden="true" />
                            Instalável em Anápolis
                          </span>
                        )}
                        <Button href={`/kits/${kit.slug}`} variant="primary" size="md" disabled={!inStock}>
                          {inStock ? 'Ver kit' : 'Estoque limitado'}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>

          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
            <PackageOpen className="h-4.5 w-4.5 shrink-0 text-ahblue-500" aria-hidden="true" />
            Kits montados com produtos do catálogo AutoHub360 — sujeitos à disponibilidade de
            estoque.
            <Badge tone="outline">Condições válidas enquanto durar o combo</Badge>
          </p>
        </Container>
      </Section>
    </>
  );
}
