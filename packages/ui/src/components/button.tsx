import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

type Variant = 'primary' | 'accent' | 'outline-dark' | 'outline-light' | 'ghost-dark' | 'ghost-light' | 'white';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
}

const base =
  'ah-button inline-flex items-center justify-center gap-2 font-display font-bold rounded-[10px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ahblue-400 disabled:opacity-50 disabled:pointer-events-none select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-ahblue-500 text-white hover:bg-ahblue-600 active:bg-ahblue-700 shadow-[0_4px_14px_rgb(30_111_235/0.35)]',
  accent:
    'bg-ahorange-500 text-white hover:bg-ahorange-600 active:brightness-95 shadow-[0_4px_14px_rgb(249_115_22/0.35)]',
  'outline-dark':
    'border-2 border-ahorange-500 text-ahorange-400 hover:bg-ahorange-500/10 active:bg-ahorange-500/20',
  'outline-light':
    'border-2 border-white/70 text-white hover:bg-white/10 active:bg-white/20',
  'ghost-dark': 'text-ink-900 hover:bg-surface-100 active:bg-surface-200',
  'ghost-light': 'text-slate-200 hover:bg-white/10 active:bg-white/15',
  white: 'bg-white text-navy-900 hover:bg-surface-100 active:bg-surface-200',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', href, className, children, ...props },
  ref,
) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (href) {
    const external = href.startsWith('http');
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} data-variant={variant}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} data-variant={variant}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} className={classes} data-variant={variant} {...props}>
      {children}
    </button>
  );
});
