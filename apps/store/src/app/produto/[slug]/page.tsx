import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { CalendarClock, HelpCircle, ShieldCheck, Wrench } from 'lucide-react';
import {
  Accordion,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Container,
  ProductCard,
  ProductMediaThumb,
  Section,
  SectionHeader,
} from '@autohub360/ui';
import { STORE_URL, whatsappLink } from '@autohub360/config';
import { resolveProductMarketOffer, type CatalogMarket } from '@autohub360/catalog';
import {
  getAllProducts,
  getCatalogProduct,
  getComplementary,
} from '@autohub360/catalog/server';
import { ProductMarketCommerce } from '@/components/product-market-commerce';
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
      ...(product.imageUrl
        ? { images: [{ url: product.imageUrl, alt: product.title }] }
        : {}),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) notFound();

  const cookieStore = await cookies();
  const market: CatalogMarket = cookieStore.get('ah_market')?.value === 'EU' ? 'EU' : 'BR';
  const offer = resolveProductMarketOffer(product, market);
  const complementary = getComplementary(product);
  const faq = productFaq(product, market);
  const publicBadges = product.badges.filter((badge) => badge !== 'Mais vendido');
  const realMedia = [product.imageUrl, ...(product.galleryUrls ?? [])].filter(
    (url): url is string => Boolean(url),
  );

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brandName },
    category: product.categoryName,
    ...(realMedia.length > 0 ? { image: realMedia } : {}),
    ...(offer?.active
      ? {
          offers: {
            '@type': 'Offer',
            url: `${STORE_URL}/produto/${product.slug}`,
            priceCurrency: offer.currency,
            price: (offer.priceCents / 100).toFixed(2),
            availability:
              offer.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
          },
        }
      : {}),
  };

  const marketLabel = market === 'BR' ? 'Brasil' : 'Europa';

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
          <div className="flex flex-col gap-3">
            <Card className="overflow-hidden p-3">
              <ProductMediaThumb
                imageUrl={realMedia[0]}
                imageKey={product.imageKey}
                alt={product.title}
                size="lg"
                className="aspect-[4/3] w-full"
              />
            </Card>

            {realMedia.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {realMedia.slice(0, 4).map((url, index) => (
                  <Card key={url} className="p-1.5 opacity-90 transition-opacity hover:opacity-100">
                    <ProductMediaThumb
                      imageUrl={url}
                      imageKey={product.imageKey}
                      alt={`${product.title} — imagem ${index + 1}`}
                      size="sm"
                      className="aspect-square w-full"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone="outline">{product.brandName}</Badge>
                <Badge tone="blue">{product.categoryName}</Badge>
                <Badge tone="outline">{marketLabel}</Badge>
                {publicBadges.map((badge) => (
                  <Badge key={badge} tone="blue">{badge}</Badge>
                ))}
              </div>
              <h1 className="font-display text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
                {product.title}
              </h1>
              <p className="mt-1.5 text-[15px] text-ink-500">{product.subtitle}</p>
              <p className="mt-3 text-xs text-ink-500">SKU: {product.sku}</p>
            </div>

            <ProductMarketCommerce product={product} />

            <a
              href={whatsappLink('product', {
                product: product.title,
                sku: product.sku,
                url: `${STORE_URL}/produto/${product.slug}`,
                market,
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
                  {market === 'BR' ? 'Garantia e trocas no Brasil' : 'Proteção do consumidor na Europa'}
                </h3>
                <p className="text-sm leading-relaxed text-ink-700">
                  {market === 'BR'
                    ? 'Aplicam-se os direitos previstos na legislação brasileira e eventual garantia contratual somente quando identificada para o SKU. Consulte as políticas publicadas antes da compra.'
                    : 'As condições de garantia, devolução, entrega e direito de retratação serão publicadas por mercado antes da ativação do checkout europeu.'}
                </p>
                <Link
                  href="/legal/garantia"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ahblue-600 hover:underline"
                >
                  Ver políticas aplicáveis
                </Link>
              </Card>

              {market === 'BR' && product.installable && (
                <Card className="border-ahorange-500/30 p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-ink-900">
                    <Wrench className="h-5 w-5 text-ahorange-500" aria-hidden="true" />
                    Instalação especializada
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-700">
                    Para produtos homologados para instalação, a equipe confirma compatibilidade,
                    valor e agenda com o parceiro oficial em Anápolis - GO.
                  </p>
                  <Button href="/instalacao" variant="accent" size="sm" className="mt-3">
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                    Consultar instalação
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

      {complementary.length > 0 && (
        <Section ariaLabel="Produtos complementares" className="bg-surface-50">
          <Container>
            <SectionHeader overline="Combina com" title="Produtos complementares" />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {complementary.map((item) => (
                <li key={item.id} className="flex">
                  <ProductCard product={item} className="w-full" />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}