import { cn } from '../lib/cn';

/** Orbital ring icon — the AutoHub360 mark, recreated as flat SVG (per brand board). */
export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn('h-9 w-9', className)} aria-hidden="true">
      <defs>
        <linearGradient id="ah-orbit" x1="8" y1="36" x2="40" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#10459b" />
          <stop offset="0.55" stopColor="#1e6feb" />
          <stop offset="1" stopColor="#4d90ff" />
        </linearGradient>
      </defs>
      <ellipse
        cx="24"
        cy="24"
        rx="17"
        ry="10.5"
        stroke="url(#ah-orbit)"
        strokeWidth="6.5"
        transform="rotate(-28 24 24)"
      />
    </svg>
  );
}

function Wordmark({ mono, tone, className }: { mono?: boolean; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span
      className={cn(
        'font-display font-extrabold tracking-tight leading-none whitespace-nowrap',
        className,
      )}
    >
      {mono ? (
        <span className="text-current">AUTOHUB360</span>
      ) : (
        <>
          <span className={tone === 'dark' ? 'text-ink-900' : 'text-white'}>AUTO</span>
          <span className="text-ahblue-500">HUB</span>
          <span className="text-ahorange-500">360</span>
        </>
      )}
    </span>
  );
}

/** Flat horizontal logo — navigation, checkout, footer, small UI.
 *  tone='light' for dark backgrounds (AUTO in white); tone='dark' for light surfaces. */
export function LogoHorizontal({
  className,
  mono,
  tagline = true,
  size = 'md',
  tone = 'light',
}: {
  className?: string;
  mono?: boolean;
  tagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'light' | 'dark';
}) {
  const text = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl';
  const tag = size === 'lg' ? 'text-xs' : 'text-[10px]';
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoIcon className={size === 'lg' ? 'h-11 w-11' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'} />
      <span className="flex flex-col gap-0.5">
        <Wordmark mono={mono} tone={tone} className={text} />
        {tagline && (
          <span
            className={cn(
              'font-medium tracking-[0.18em] uppercase text-slate-400 leading-none',
              tag,
            )}
          >
            Auto • Tech • Smart Living
          </span>
        )}
      </span>
    </span>
  );
}

/** Stacked logo — footers, covers, splash contexts. */
export function LogoStacked({
  className,
  mono,
  size = 'md',
}: {
  className?: string;
  mono?: boolean;
  size?: 'md' | 'lg';
}) {
  return (
    <span className={cn('inline-flex flex-col items-center gap-1.5', className)}>
      <LogoIcon className={size === 'lg' ? 'h-14 w-14' : 'h-10 w-10'} />
      <Wordmark mono={mono} className={size === 'lg' ? 'text-3xl' : 'text-2xl'} />
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
        Auto • Tech • Smart Living
      </span>
    </span>
  );
}
