'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { CatalogProduct } from '@autohub360/catalog';
import { useCart } from '@autohub360/commerce';
import { Badge } from './primitives';
import { ProductThumb } from './product-thumb';
import { Price, Rating } from './price';
import { Button } from './button';
import { cn } from '../lib/cn';

/** Commerce product card — light surface, matches the mockup grid. */
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
        'group flex h-full flex-col rounded-xl border border-surface-200 bg-white p-3.5 shadow-[var(--ah-shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-ahblue-500/40 hover:shadow-[var(--ah-shadow-float)]',
        className,
      )}
    >
      <Link
        href={`/produto/${product.slug}`}
        className="relative block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ahblue-400"
        tabIndex={priority ? 0 : 0}
      >
        {product.compareAtCents && product.compareAtCents > product.priceCents && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-ahorange-500 px-2 py-0.5 text-[11px] font-display font-extrabold text-white">
            -{Math.round((1 - product.priceCents / product.compareAtCents) * 100)}%
          </span>
        )}
        <ProductThumb
          imageKey={product.imageKey}
          alt={product.title}
          size="md"
          className="aspect-square w-full"
        />
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <Link
          href={`/produto/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 transition-colors hover:text-ahblue-600 focus-visible:outline-2"
        >
          {product.title}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex flex-col gap-2.5 pt-1.5">
          <Price cents={product.priceCents} compareAtCents={product.compareAtCents} size="md" />
          {product.badges.includes('Mais vendido') && <Badge tone="orange">Mais vendido</Badge>}
          <Button
            size="sm"
            variant={inStock ? 'primary' : 'ghost-dark'}
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
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {inStock ? 'Adicionar' : 'Esgotado'}
          </Button>
        </div>
      </div>
    </article>
  );
}
