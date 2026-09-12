import { Star, StarHalf } from 'lucide-react';
import { formatPrice, installmentLabel } from '@autohub360/commerce';
import type { Currency } from '@autohub360/catalog';
import { cn } from '../lib/cn';

export function Rating({
  value,
  count,
  className,
  size = 'sm',
}: {
  value: number;
  count?: number;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const px = size === 'md' ? 'h-4.5 w-4.5' : 'h-3.5 w-3.5';
  const full = Math.floor(value);
  const half = value - full >= 0.25 && value - full < 0.85;
  const stars = Array.from({ length: 5 }, (_, i) => i);
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)} aria-label={`Nota ${value.toFixed(1)} de 5`}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {stars.map((i) => {
          if (i < full)
            return <Star key={`f-${i}`} className={cn(px, 'fill-amber-400 text-amber-400')} />;
          if (i === full && half)
            return (
              <span key={`h-${i}`} className="relative inline-flex">
                <Star className={cn(px, 'fill-surface-300 text-surface-300')} />
                <StarHalf className={cn(px, 'absolute inset-0 fill-amber-400 text-amber-400')} />
              </span>
            );
          return <Star key={`e-${i}`} className={cn(px, 'fill-surface-300 text-surface-300')} />;
        })}
      </span>
      {typeof count === 'number' && (
        <span className="text-xs font-medium text-ink-500">({count})</span>
      )}
    </span>
  );
}

export function Price({
  cents,
  compareAtCents,
  currency = 'BRL',
  showInstallments = true,
  size = 'md',
  className,
}: {
  cents: number;
  compareAtCents?: number;
  currency?: Currency;
  showInstallments?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const priceSize =
    size === 'lg'
      ? 'text-3xl'
      : size === 'sm'
        ? 'text-base'
        : 'text-xl';
  const hasDiscount = Boolean(compareAtCents && compareAtCents > cents);
  const discountPct = hasDiscount && compareAtCents
    ? Math.round((1 - cents / compareAtCents) * 100)
    : 0;
  const inst = currency === 'BRL' ? installmentLabel(cents) : null;

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      {hasDiscount && compareAtCents && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-500 line-through">{formatPrice(compareAtCents, currency)}</span>
          <span className="rounded bg-ahorange-500/15 px-1.5 py-0.5 text-[11px] font-bold text-ahorange-600">
            -{discountPct}%
          </span>
        </div>
      )}
      <span className={cn('font-display font-extrabold text-ink-900', priceSize)}>
        {formatPrice(cents, currency)}
      </span>
      {showInstallments && inst && (
        <span className="text-xs text-ink-500">{inst} sem juros</span>
      )}
    </div>
  );
}
