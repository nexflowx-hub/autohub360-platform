import { Truck, MapPin, Headset, ShieldCheck, Package, CalendarClock, Star, Users, Zap, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

const icons: Record<string, LucideIcon> = {
  truck: Truck,
  pin: MapPin,
  headset: Headset,
  shield: ShieldCheck,
  package: Package,
  calendar: CalendarClock,
  star: Star,
  users: Users,
  zap: Zap,
};

export interface TrustItem {
  icon: string;
  title: string;
  subtitle?: string;
}

/** Trust strip used across both apps (matches the mockup pattern). */
export function TrustStrip({
  items,
  className,
  dark = false,
}: {
  items: TrustItem[];
  className?: string;
  dark?: boolean;
}) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-4 lg:grid-cols-4',
        className,
      )}
    >
      {items.map((item) => {
        const Icon = icons[item.icon] ?? ShieldCheck;
        return (
          <li key={item.title} className="flex items-center gap-3">
            <span
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                dark ? 'bg-white/10 text-ahblue-300' : 'bg-ahblue-500/10 text-ahblue-600',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  'block truncate text-sm font-semibold',
                  dark ? 'text-white' : 'text-ink-900',
                )}
              >
                {item.title}
              </span>
              {item.subtitle && (
                <span className={cn('block truncate text-xs', dark ? 'text-slate-400' : 'text-ink-500')}>
                  {item.subtitle}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
