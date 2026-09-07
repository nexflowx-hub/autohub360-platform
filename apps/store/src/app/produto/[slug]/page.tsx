import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  MapPin,
  Wrench,
  CalendarClock,
  Package,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import {
  Accordion,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Price,
  ProductCard,
  ProductThumb,
  Rating,
  Section,
  SectionHeader,
} from '@autohub360/ui';
import { STORE_URL, whatsappLink } from '@autohub360/config';
import {
  getAllProducts,
  getCatalogProduct,
  getComplementary,
} from '@autohub360/catalog';
import { ProductBuyBox } from '@/components/product-buy-box';
import { ShareButton } from '@/components/share-button';
import { productFaq } from '@/lib/faq';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) return { title: 'Produto não encontrado' };
  return {
    title: product.title,
    description: `${product.subtitle} — ${product.description.slice(0, 140)}...`,
    alternates: { canonical: `${STORE_URL}/produto/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.subtitle,
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) notFound();

  const complementary = getComplementary(product);
  const faq = productFaq(product);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brandName },
    category: product.categoryName,
    offers: {
      '@type': 'Offer',
      url: `${STORE_URL}/produto/${product.slug}`,
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Container className="py-4">
        <Breadcrumbs
          items={[
            { label: product.categoryName, href: `/categoria/${product.categorySlug}` },
            { label: product.title },
          ]}
        />
      </Container>

      <Container>
        <div className="grid gap-8 pb-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <Card className="overflow-hidden p-3">
              <ProductThumb
                imageKey={product.imageKey}
                alt={product.title}
                size="lg"
                className="aspect-[4/3] w-full"
              />
            </Card>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-1.5 opacity-80 transition-opacity hover:opacity-100">
                  <ProductThumb
                    imageKey={product.imageKey}
                    alt={`${product.title} — visão ${i}`}
                    size="sm"
                    className="aspect-square w-full"
                  />
                </Card>
              ))}
            </div>
          </div>

          {/* Buy column */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone="outline">{product.brandName}</Badge>
                <Badge tone="blue">{product.categoryName}</Badge>
                {product.badges.map((b) => (
                  <Badge key={b} tone={b === 'Mais vendido' ? 'orange' : 'blue'}>
                    {b}
                  </Badge>
                ))}
              </div>
              <h1 className="font-display text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
                {product.title}
              </h1>
              <p className="mt-1.5 text-[15px] text-ink-500">{product.subtitle}</p>
              <div className="mt-3 flex items-center gap-3">
                <Rating value={product.rating} count={product.reviewCount} size="md" />
                <span className="text-xs text-ink-500">SKU: {product.sku}</span>
              </div>
            </div>

            <Card className="p-5">
              <Price
                cents={product.priceCents}
                compareAtCents={product.compareAtCents}
                size="lg"
                showInstallments={false}
              />
              <p className="mt-1 text-sm text-ink-500">
                no Pix, ou em até 12x sem juros no cartão*
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <Package className="h-4.5 w-4.5" aria-hidden="true" />
                {product.stock > 0 ? 'Em estoque — pronto para envio' : 'Sem estoque no momento'}
              </p>
              <ProductBuyBox product={product} />
            </Card>

            {/* Trust mini strip */}
            <ul className="grid grid-cols-2 gap-2.5 text-[13px] text-ink-700">
              <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
                <Truck className="h-4.5 w-4.5 shrink-0 text-ahblue-500" aria-hidden="true" />
                Entrega para todo o Brasil
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
                <MapPin className="h-4.5 w-4.5 shrink-0 text-ahorange-500" aria-hidden="true" />
                Retirada em Anápolis
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
                <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-emerald-500" aria-hidden="true" />
                Garantia de {product.warrantyMonths} meses
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2.5">
                <RotateCcw className="h-4.5 w-4.5 shrink-0 text-ahblue-500" aria-hidden="true" />
                7 dias para arrependimento
              </li>
            </ul>

            {/* WhatsApp contextual */}
            <a
              href={whatsappLink('product', {
                product: product.title,
                sku: product.sku,
                url: `${STORE_URL}/produto/${product.slug}`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-[10px] border-2 border-[#25d366] px-4 py-2.5 text-sm font-semibold text-[#128c4b] transition-colors hover:bg-[#25d366]/10"
            >
              <HelpCircle className="h-4.5 w-4.5" aria-hidden="true" />
              Dúvidas sobre este produto? Fale no WhatsApp
            </a>
          </div>
        </div>
      </Container>

      {/* Description + specs */}
      <Section ariaLabel="Descrição do produto" className="bg-white py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="mb-4 font-display text-xl font-extrabold text-ink-900">Descrição</h2>
              <p className="text-[15px] leading-relaxed text-ink-700">{product.description}</p>

              <h2 className="mb-4 mt-8 font-display text-xl font-extrabold text-ink-900">
                Especificações técnicas
              </h2>
              <dl className="overflow-hidden rounded-xl border border-surface-200">
                {product.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`grid grid-cols-[140px_1fr] gap-3 px-4 py-3 text-sm sm:grid-cols-[220px_1fr] ${
                      i % 2 === 0 ? 'bg-surface-50' : 'bg-white'
                    }`}
                  >
                    <dt className="font-semibold text-ink-900">{spec.label}</dt>
                    <dd className="text-ink-700">{spec.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[140px_1fr] gap-3 bg-surface-50 px-4 py-3 text-sm sm:grid-cols-[220px_1fr]">
                  <dt className="font-semibold text-ink-900">Garantia</dt>
                  <dd className="text-ink-700">{product.warrantyMonths} meses</dd>
                </div>
              </dl>

              <h2 className="mb-4 mt-8 font-display text-xl font-extrabold text-ink-900">
                Perguntas frequentes
              </h2>
              <Accordion items={faq} />
            </div>

            <aside className="flex flex-col gap-4">
              <Card className="p-5">
                <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-ink-900">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  Garantia e trocas
                </h3>
                <p className="text-sm leading-relaxed text-ink-700">
                  {product.warrantyMonths} meses de garantia contratual + garantia legal de 90 dias
                  para vícios ocultos (CDC). Direito de arrependimento em até 7 dias corridos após o
                  recebimento.
                </p>
                <Link
                  href="/legal/garantia"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ahblue-600 hover:underline"
                >
                  Política de garantia
                </Link>
              </Card>
              {product.installable && (
                <Card className="border-ahorange-500/30 p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-ink-900">
                    <Wrench className="h-5 w-5 text-ahorange-500" aria-hidden="true" />
                    Instalação especializada
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-700">
                    Este produto pode ser instalado pelo nosso parceiro oficial em Anápolis - GO.
                    Escolha <strong>&ldquo;Produto + instalação&rdquo;</strong> no carrinho ou
                    agende somente o serviço.
                  </p>
                  <Button href="/instalacao" variant="accent" size="sm" className="mt-3">
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                    Agendar instalação
                  </Button>
                </Card>
              )}
              <Card className="p-5">
                <h3 className="mb-2 font-display text-base font-bold text-ink-900">Compartilhar</h3>
                <ShareButton title={product.title} />
              </Card>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Complementary products */}
      <Section ariaLabel="Produtos complementares" className="bg-surface-50">
        <Container>
          <SectionHeader overline="Combina com" title="Produtos complementares" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {complementary.map((p) => (
              <li key={p.id} className="flex">
                <ProductCard product={p} className="w-full" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
