import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BadgePercent, CircleCheck, PackageOpen, Wrench } from 'lucide-react';
import {
  Breadcrumbs,
  Button,
  Card,
  Container,
  Price,
  ProductCard,
  ProductThumb,
  Section,
  TrustStrip,
} from '@autohub360/ui';
import { KITS, getKit } from '@autohub360/config';
import {
  getAllProducts,
} from '@autohub360/catalog/server';;
import { formatBRL } from '@autohub360/commerce';
import { KitAddButton, type KitLineInput } from '@/components/kit-add-button';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return KITS.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) return { title: 'Kit não encontrado' };
  return {
    title: kit.title,
    description: `${kit.subtitle} — ${kit.description.slice(0, 140)}… Kit com ${kit.discountPct}% de desconto no conjunto, com entrega para todo o Brasil.`,
  };
}

export default async function KitDetailPage({ params }: Props) {
  const { slug } = await params;
  const kit = getKit(slug);
  if (!kit) notFound();

  const bySlug = new Map(getAllProducts().map((p) => [p.slug, p]));
  const products = kit.productSlugs
    .map((s) => bySlug.get(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const totalCents = products.reduce((s, p) => s + p.priceCents, 0);
  const bundleCents = Math.round(totalCents * (1 - kit.discountPct / 100));
  const savings = totalCents - bundleCents;
  const complete = products.length === kit.productSlugs.length;
  const inStock = complete && products.every((p) => p.stock > 0);
  const installable = complete && products.some((p) => p.installable);

  const lines: KitLineInput[] = products.map((p) => ({
    productId: p.id,
    slug: p.slug,
    title: p.title,
    sku: p.sku,
    imageKey: p.imageKey,
    unitPriceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    installable: p.installable,
    universal: p.universal,
    maxStock: p.stock,
  }));

  return (
    <>
      <Container className="pt-4">
        <Breadcrumbs items={[{ label: 'Kits e Combos', href: '/kits' }, { label: kit.title }]} />
      </Container>

      <Section ariaLabel={`Kit ${kit.title}`} className="py-8 sm:py-10">
        <Container>
          {/* Hero card */}
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative bg-surface-50 p-5 sm:p-8">
                <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-md bg-ahorange-500 px-2.5 py-1 text-[12px] font-display font-extrabold text-white">
                  <BadgePercent className="h-3.5 w-3.5" aria-hidden="true" />
                  -{kit.discountPct}% no conjunto
                </span>
                <ProductThumb
                  imageKey={kit.imageKey}
                  alt={kit.title}
                  size="lg"
                  className="aspect-[4/3] w-full"
                />
              </div>

              <div className="flex flex-col p-5 sm:p-8">
                <h1 className="font-display text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
                  {kit.title}
                </h1>
                <p className="mt-1 text-[15px] font-semibold text-ahblue-600">{kit.subtitle}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{kit.description}</p>

                <ul className="mt-4 space-y-2 text-sm text-ink-700">
                  {products.map((p) => (
                    <li key={p.id} className="flex items-start gap-2">
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                      {p.title}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-surface-100 pt-5">
                  <p className="text-sm text-ink-500">
                    <span className="line-through">{formatBRL(totalCents)}</span> comprando separado
                  </p>
                  <Price cents={bundleCents} size="lg" showInstallments={false} />
                  <p className="mt-1 text-sm font-semibold text-emerald-600">
                    Você economiza {formatBRL(savings)} neste kit
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    <KitAddButton kitTitle={kit.title} lines={lines} disabled={!inStock} />
                    {installable && (
                      <Button href="/instalacao" variant="accent" size="md">
                        <Wrench className="h-4.5 w-4.5" aria-hidden="true" />
                        Agendar instalação em Anápolis
                      </Button>
                    )}
                    {!inStock && (
                      <p className="flex items-center gap-2 text-sm text-ink-500">
                        <PackageOpen className="h-4 w-4" aria-hidden="true" />
                        Alguns itens do kit estão sem estoque neste momento.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Included products */}
          <div className="mt-10 sm:mt-12">
            <h2 className="mb-6 font-display text-xl font-extrabold text-ink-900">
              Produtos incluídos no kit
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {products.map((p) => (
                <li key={p.id} className="flex">
                  <ProductCard product={p} className="w-full" />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section ariaLabel="Vantagens da loja" className="bg-surface-100 py-8 sm:py-10">
        <Container>
          <TrustStrip
            items={[
              { icon: 'package', title: 'Kit completo', subtitle: 'Tudo chega junto, sem retrabalho' },
              { icon: 'shield', title: 'Garantia dos itens', subtitle: 'Conforme cada produto' },
              { icon: 'truck', title: 'Entrega nacional', subtitle: 'Com rastreamento' },
              { icon: 'pin', title: 'Instalação em Anápolis', subtitle: 'Parceiro oficial AutoHub360' },
            ]}
          />
        </Container>
      </Section>
    </>
  );
}
