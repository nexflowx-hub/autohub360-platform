import Link from 'next/link';
import type { Universe } from '@autohub360/config';
import { cn } from '../lib/cn';
import { ProductThumb } from './product-thumb';

const universeArtwork: Record<Universe['key'], string> = {
  auto: 'led-kit',
  moto: 'moto-usb',
  truck: 'power-station',
  tech: 'head-unit',
  'casa-inteligente': 'smart-home',
  energia: 'solar-panel',
  seguranca: 'cam-360',
  pro: 'scanner',
};

/** Compact visual universe tile inspired by the approved storefront rail. */
export function UniverseCard({
  universe,
  href,
  dark = false,
  className,
}: {
  universe: Universe;
  href: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex min-h-[148px] flex-col overflow-hidden rounded-xl border text-center transition-all duration-250 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ahblue-400',
        dark
          ? 'border-white/10 bg-white/[0.055] hover:border-ahblue-400/50 hover:bg-white/10'
          : 'border-surface-200 bg-white shadow-[0_5px_18px_rgba(15,23,42,.06)] hover:-translate-y-1 hover:border-ahblue-500/35 hover:shadow-[0_16px_34px_rgba(15,23,42,.13)]',
        className,
      )}
    >
      <div className={cn('relative mx-2 mt-2 overflow-hidden rounded-lg', dark && 'opacity-95')}>
        <ProductThumb
          imageKey={universeArtwork[universe.key]}
          alt=""
          size="sm"
          className={cn(
            'h-[70px] w-full border-0 transition-transform duration-500 group-hover:scale-[1.03]',
            dark && 'bg-white/95',
          )}
        />
        <span className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-ahblue-400/60 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col items-center px-2.5 pb-3 pt-2">
        <span className={cn('font-display text-[13px] font-extrabold leading-tight', dark ? 'text-white' : 'text-ink-900')}>
          {universe.label}
        </span>
        <span className={cn('mt-1 line-clamp-2 text-[10px] leading-[1.25]', dark ? 'text-slate-400' : 'text-ink-500')}>
          {universe.description}
        </span>
      </div>
    </Link>
  );
}
