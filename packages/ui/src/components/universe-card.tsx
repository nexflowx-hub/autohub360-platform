import Link from 'next/link';
import type { Universe } from '@autohub360/config';
import { UniverseIcon } from './universe-icon';
import { cn } from '../lib/cn';

/** Universe category card — matches the mockup's white rounded tile with icon + label. */
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
        'group flex flex-col items-center gap-2.5 rounded-xl border px-3 py-5 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ahblue-400',
        dark
          ? 'border-white/10 bg-white/[0.06] hover:border-ahblue-400/50 hover:bg-white/10'
          : 'border-surface-200 bg-white shadow-[var(--ah-shadow-card)] hover:border-ahblue-500/40 hover:shadow-[var(--ah-shadow-float)]',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110',
          dark ? 'bg-ahblue-500/15 text-ahblue-300' : 'bg-gradient-to-br from-ahblue-500/15 to-ahblue-500/5 text-ahblue-600',
        )}
      >
        <UniverseIcon universe={universe} className="h-7 w-7" />
      </span>
      <span className={cn('font-display text-sm font-bold', dark ? 'text-white' : 'text-ink-900')}>
        {universe.label}
      </span>
      <span className={cn('text-[11px] leading-snug', dark ? 'text-slate-400' : 'text-ink-500')}>
        {universe.description}
      </span>
    </Link>
  );
}
