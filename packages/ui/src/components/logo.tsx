import { cn } from '../lib/cn';

/**
 * AutoHub360 orbital mark.
 *
 * The production mark is intentionally more aerodynamic than a simple ring:
 * a compressed orbital body, an open inner aperture and three velocity cuts
 * communicate 360º movement, electronics and automotive performance.
 */
export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 48"
      fill="none"
      className={cn('h-9 w-[3.35rem]', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ah-orbit-body" x1="8" y1="39" x2="63" y2="7" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#075fd8" />
          <stop offset="0.48" stopColor="#0788ff" />
          <stop offset="1" stopColor="#30b2ff" />
        </linearGradient>
        <linearGradient id="ah-orbit-edge" x1="14" y1="36" x2="60" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4dc6ff" stopOpacity="0.25" />
          <stop offset="0.55" stopColor="#9de2ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#34a8ff" stopOpacity="0.2" />
        </linearGradient>
        <filter id="ah-orbit-glow" x="-25%" y="-35%" width="150%" height="170%">
          <feGaussianBlur stdDeviation="1.15" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="rotate(-17 36 24)" filter="url(#ah-orbit-glow)">
        <path
          fill="url(#ah-orbit-body)"
          fillRule="evenodd"
          d="M66.1 18.2C69.2 26.7 59.2 37.1 43.7 41.5C28.3 45.9 12.8 42.6 8.9 34.4C5 26.2 14.4 15.7 29.9 10.9C45.4 6.1 62.9 9.6 66.1 18.2ZM56.3 20.8C58.3 26.1 51.4 32.8 40.9 35.8C30.5 38.8 20.2 36.6 17.7 31.5C15.3 26.4 21.7 19.8 32.2 16.5C42.7 13.3 54.3 15.5 56.3 20.8Z"
        />
        <path
          d="M13 28.9C19.9 22.7 27.8 17.8 37.9 14.6C30.1 19.8 24 25.2 19.9 31.4L13 28.9Z"
          fill="#06182e"
          opacity="0.96"
        />
        <path
          d="M22 38.1C30.1 32.7 38.7 29.2 49.9 27.1C41.5 31.1 34.4 35.2 29.4 39.6L22 38.1Z"
          fill="#06182e"
          opacity="0.96"
        />
        <path
          d="M45.1 13.1C51.2 13.3 57.1 14.6 63.3 17.6C56.9 16.5 51.6 16.3 47 17L45.1 13.1Z"
          fill="#06182e"
          opacity="0.78"
        />
        <path
          d="M14.4 32.9C19.8 37.2 30.7 39.4 41.8 36.3C52.9 33.1 60.7 26.4 62.2 20.2"
          stroke="url(#ah-orbit-edge)"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function Wordmark({ mono, tone, className }: { mono?: boolean; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex origin-left -skew-x-[8deg] items-baseline whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.055em]',
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

/** Flat horizontal lockup for navigation, checkout and footer. */
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
  const text = size === 'lg' ? 'text-[2rem]' : size === 'sm' ? 'text-[1.08rem]' : 'text-[1.48rem]';
  const tag = size === 'lg' ? 'text-[10px]' : size === 'sm' ? 'text-[7px]' : 'text-[8px]';
  const icon = size === 'lg' ? 'h-12 w-[4.25rem]' : size === 'sm' ? 'h-7 w-10' : 'h-9 w-[3.2rem]';

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoIcon className={icon} />
      <span className="flex flex-col">
        <Wordmark mono={mono} tone={tone} className={text} />
        {tagline && (
          <span
            className={cn(
              'mt-1 font-medium leading-none tracking-[0.12em] text-slate-400',
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

/** Stacked lockup for covers, splash contexts and selected footer placements. */
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
      <LogoIcon className={size === 'lg' ? 'h-16 w-24' : 'h-11 w-[4.2rem]'} />
      <Wordmark mono={mono} className={size === 'lg' ? 'text-3xl' : 'text-2xl'} />
      <span className="text-[9px] font-medium tracking-[0.15em] text-slate-400">
        Auto • Tech • Smart Living
      </span>
    </span>
  );
}
