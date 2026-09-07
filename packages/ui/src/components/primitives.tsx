import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export function Badge({
  children,
  tone = 'blue',
  className,
}: {
  children: ReactNode;
  tone?: 'blue' | 'orange' | 'dark' | 'green' | 'red' | 'outline';
  className?: string;
}) {
  const tones = {
    blue: 'bg-ahblue-500/15 text-ahblue-600',
    orange: 'bg-ahorange-500/15 text-ahorange-600',
    dark: 'bg-navy-900 text-white',
    green: 'bg-emerald-500/15 text-emerald-600',
    red: 'bg-red-500/15 text-red-600',
    outline: 'border border-surface-300 text-ink-500',
  } as const;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-display font-bold uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  hover = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        'rounded-xl border border-surface-200 bg-white shadow-[var(--ah-shadow-card)]',
        hover && 'ah-card-hover',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  dark = false,
  id,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn('py-12 sm:py-16', dark ? 'ah-dark' : 'bg-white', className)}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  overline,
  title,
  subtitle,
  action,
  dark = false,
  className,
}: {
  overline?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        {overline && (
          <p className="mb-1.5 text-xs font-display font-bold uppercase tracking-[0.2em] text-ahblue-500">
            {overline}
          </p>
        )}
        <h2
          className={cn(
            'font-display text-2xl font-extrabold leading-tight sm:text-3xl',
            dark ? 'text-white' : 'text-ink-900',
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={cn('mt-2 text-[15px]', dark ? 'text-slate-400' : 'text-ink-500')}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
