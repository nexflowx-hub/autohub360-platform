'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { resolveProductMarketOffer, type CatalogProduct } from '@autohub360/catalog';
import { useCart } from '@autohub360/commerce';
import { ProductThumb } from './product-thumb';
import { Price } from './price';
import { useMarket } from './market-context';
import { cn } from '../lib/cn';

/** Dense commerce card matching the approved AutoHub360.store visual rhythm. */
export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: CatalogProduct;
  className?: string;
  priority?: boolean;
}) {
  const add = useCart((s) => s.add);
  const { market, marketConfig } = useMarket();
  const offer = resolveProductMarketOffer(product, market);
  const purchasable = Boolean(offer?.active && offer.stock > 0 && marketConfig.checkoutEnabled);

  return (
    <article
      className={cn(
        'ah-product-card group flex h-full min-w-0 flex-col overflow-hidden rounded-[12px] border border-slate-200/90 bg-white shadow-[0_5px_18px_rgba(15,23,42,.06)] transition-all duration-250 hover:border-ahblue-500/35',
        className,
      )}
    >
      <Link
        href={`/produto/${product.slug}`}
        className="relative block px-2 pt-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ahblue-400"
        tabIndex={priority ? 0 : 0}
      >
        <ProductThumb
          imageKey={product.imageKey}
          alt={product.title}
          size="md"
          className="ah-product-thumb aspect-[1.12/1] w-full"
        />
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <Link
          href={`/produto/${product.slug}`}
          className="line-clamp-2 min-h-[2.25rem] text-[12.5px] font-semibold leading-[1.35] text-ink-900 transition-colors hover:text-ahblue-600 focus-visible:outline-2 sm:text-[13px]"
        >
          {product.title}
        </Link>
        <div className="mt-auto pt-2.5">
          {offer ? (
            <Price
              cents={offer.priceCents}
              compareAtCents={offer.compareAtCents}
              currency={offer.currency}
              size="md"
              showInstallments={false}
            />
          ) : (
            <p className="font-display text-sm font-bold text-ink-700">Disponível em breve na Europa</p>
          )}
          <p className="mt-0.5 text-[9.5px] leading-tight text-ink-500">
            {market === 'BR' ? 'Condições de pagamento no checkout' : 'Catálogo e logística europeia em preparação'}
          </p>
          <div className="mt-2 flex min-h-[20px] items-center">
            {product.installable && market === 'BR' ? (
              <span className="text-[9.5px] font-semibold text-ahblue-600">
                Instalação disponível em Anápolis
              </span>
            ) : market === 'EU' ? (
              <span className="text-[9.5px] font-semibold text-ahblue-600">Preço e disponibilidade por mercado</span>
            ) : null}
          </div>
          <button
            type="button"
            disabled={!purchasable}
            onClick={() => {
              if (!offer || !purchasable) return;
              add(
                {
                  productId: product.id,
                  slug: product.slug,
                  title: product.title,
                  sku: product.sku,
                  imageKey: product.imageKey,
                  unitPriceCents: offer.priceCents,
                  compareAtCents: offer.compareAtCents,
                  installation: false,
                  installable: product.installable && market === 'BR',
                  universal: product.universal,
                  maxStock: offer.stock,
                },
                1,
              );
            }}
            aria-label={purchasable ? `Adicionar ${product.title} ao carrinho` : `${product.title} indisponível neste mercado`}
            className={cn(
              'ah-button mt-2.5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[7px] font-display text-[12px] font-bold transition-all',
              purchasable
                ? 'bg-ahblue-500 text-white shadow-[0_5px_13px_rgba(30,111,235,.24)] hover:bg-ahblue-600 hover:shadow-[0_7px_18px_rgba(30,111,235,.33)]'
                : 'cursor-not-allowed bg-slate-100 text-slate-400',
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
            {purchasable ? 'Adicionar' : market === 'EU' ? 'Europa em preparação' : 'Indisponível'}
          </button>
        </div>
      </div>
    </article>
  );
}
