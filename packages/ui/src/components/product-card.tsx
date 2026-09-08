'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { CatalogProduct } from '@autohub360/catalog';
import { useCart } from '@autohub360/commerce';
import { Badge } from './primitives';
import { ProductThumb } from './product-thumb';
import { Price, Rating } from './price';
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
  const inStock = product.stock > 0;

  return (
    <article
      className={cn(
        'group flex h-full min-w-0 flex-col overflow-hidden rounded-[12px] border border-slate-200/90 bg-white shadow-[0_5px_18px_rgba(15,23,42,.06)] transition-all duration-250 hover:-translate-y-1 hover:border-ahblue-500/35 hover:shadow-[0_16px_34px_rgba(15,23,42,.13)]',
        className,
      )}
    >
      <Link
        href={`/produto/${product.slug}`}
        className="relative block px-2 pt-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ahblue-400"
        tabIndex={priority ? 0 : 0}
      >
        {product.compareAtCents && product.compareAtCents > product.priceCents && (
          <span className="absolute left-3 top-3 z-10 rounded-[5px] bg-red-500 px-1.5 py-0.5 text-[10px] font-display font-extrabold text-white shadow-sm">
            -{Math.round((1 - product.priceCents / product.compareAtCents) * 100)}%
          </span>
        )}
        <ProductThumb
          imageKey={product.imageKey}
          alt={product.title}
          size="md"
          className="aspect-[1.12/1] w-full"
        />
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <Link
          href={`/produto/${product.slug}`}
          className="line-clamp-2 min-h-[2.25rem] text-[12.5px] font-semibold leading-[1.35] text-ink-900 transition-colors hover:text-ahblue-600 focus-visible:outline-2 sm:text-[13px]"
        >
          {product.title}
        </Link>
        <div className="mt-1.5 scale-[.92] origin-left">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-auto pt-1.5">
          <Price cents={product.priceCents} compareAtCents={product.compareAtCents} size="md" />
          <p className="mt-0.5 text-[9.5px] leading-tight text-ink-500">em até 6x no cartão</p>
          <div className="mt-2 flex min-h-[20px] items-center">
            {product.badges.includes('Mais vendido') ? (
              <Badge tone="orange" className="text-[9px]">Mais vendido</Badge>
            ) : product.installable ? (
              <span className="text-[9.5px] font-semibold text-ahblue-600">Instalação disponível</span>
            ) : null}
          </div>
          <button
            type="button"
            disabled={!inStock}
            onClick={() =>
              add(
                {
                  productId: product.id,
                  slug: product.slug,
                  title: product.title,
                  sku: product.sku,
                  imageKey: product.imageKey,
                  unitPriceCents: product.priceCents,
                  compareAtCents: product.compareAtCents,
                  installation: false,
                  installable: product.installable,
                  universal: product.universal,
                  maxStock: product.stock,
                },
                1,
              )
            }
            aria-label={`Adicionar ${product.title} ao carrinho`}
            className={cn(
              'mt-2.5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[7px] font-display text-[12px] font-bold transition-all',
              inStock
                ? 'bg-ahblue-500 text-white shadow-[0_5px_13px_rgba(30,111,235,.24)] hover:bg-ahblue-600 hover:shadow-[0_7px_18px_rgba(30,111,235,.33)]'
                : 'cursor-not-allowed bg-slate-100 text-slate-400',
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
            {inStock ? 'Adicionar' : 'Esgotado'}
          </button>
        </div>
      </div>
    </article>
  );
}
