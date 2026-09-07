import { Bike, House, Lightbulb, ShieldCheck, Sun, Truck, Watch, Wrench, type LucideIcon } from 'lucide-react';
import type { Universe } from '@autohub360/config';
import { cn } from '../lib/cn';

const universeIcons: Record<string, LucideIcon> = {
  auto: Watch,
  moto: Bike,
  truck: Truck,
  tech: Watch,
  'casa-inteligente': House,
  energia: Sun,
  seguranca: ShieldCheck,
  pro: Wrench,
};

const fallback: Record<string, LucideIcon> = {
  auto: Lightbulb,
};

export function UniverseIcon({
  universe,
  className,
}: {
  universe: Pick<Universe, 'key'>;
  className?: string;
}) {
  const Icon = universeIcons[universe.key] ?? Watch;
  return <Icon aria-hidden="true" className={cn('h-6 w-6', className)} />;
}
