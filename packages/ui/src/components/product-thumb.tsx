import {
  Lightbulb,
  Zap,
  Camera,
  ShieldCheck,
  MonitorSmartphone,
  BatteryCharging,
  Watch,
  Plug,
  House,
  Cctv,
  Sun,
  Wrench,
  Speaker,
  Usb,
  Cable,
  BatteryFull,
  AlarmClock,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../lib/cn';

/**
 * Deterministic product artwork per imageKey.
 *
 * The first V1 rendered saturated gradient placeholders. They were technically
 * useful but visually too far from the approved store board, whose product
 * cards use bright catalogue photography on clean white/ice surfaces. Until
 * real supplier photography lands in Supabase Storage, these illustrations
 * intentionally imitate that catalogue treatment: light background, grounded
 * product silhouette and a restrained brand-colour accent.
 */

const registry: Record<string, { icon: LucideIcon; from: string; to: string }> = {
  'led-kit': { icon: Lightbulb, from: '#10459b', to: '#1e6feb' },
  'led-bulb': { icon: Lightbulb, from: '#10459b', to: '#1e6feb' },
  'fog-light': { icon: Lightbulb, from: '#0d1b30', to: '#1559c4' },
  halogen: { icon: Lightbulb, from: '#3a5a8c', to: '#7cb0ff' },
  'parking-sensor': { icon: Zap, from: '#10459b', to: '#1e6feb' },
  alarm: { icon: AlarmClock, from: '#0d1b30', to: '#e05e04' },
  module: { icon: Zap, from: '#16273f', to: '#27436b' },
  inverter: { icon: Plug, from: '#10459b', to: '#1e6feb' },
  compressor: { icon: Zap, from: '#1559c4', to: '#4d90ff' },
  'rear-cam': { icon: Camera, from: '#0d1b30', to: '#1e6feb' },
  dashcam: { icon: Camera, from: '#16273f', to: '#1e6feb' },
  tracker: { icon: ShieldCheck, from: '#0a1628', to: '#1559c4' },
  'head-unit': { icon: MonitorSmartphone, from: '#0d1b30', to: '#1e6feb' },
  amp: { icon: Speaker, from: '#10459b', to: '#4d90ff' },
  speaker: { icon: Speaker, from: '#16273f', to: '#3a5a8c' },
  mic: { icon: Speaker, from: '#27436b', to: '#4d90ff' },
  booster: { icon: BatteryCharging, from: '#e05e04', to: '#ff9433' },
  charger: { icon: BatteryCharging, from: '#10459b', to: '#1e6feb' },
  'moto-usb': { icon: Usb, from: '#1559c4', to: '#4d90ff' },
  powerbank: { icon: BatteryFull, from: '#10459b', to: '#1e6feb' },
  'car-charger': { icon: Plug, from: '#0d1b30', to: '#1e6feb' },
  'speaker-bt': { icon: Speaker, from: '#1d3252', to: '#4d90ff' },
  'phone-mount': { icon: Watch, from: '#16273f', to: '#3a5a8c' },
  tag: { icon: Watch, from: '#1e6feb', to: '#7cb0ff' },
  cable: { icon: Cable, from: '#10459b', to: '#4d90ff' },
  'wall-charger': { icon: Plug, from: '#1559c4', to: '#4d90ff' },
  'wireless-charge': { icon: Zap, from: '#1e6feb', to: '#7cb0ff' },
  'smart-bulb': { icon: Lightbulb, from: '#7c3aed', to: '#4d90ff' },
  'smart-plug': { icon: Plug, from: '#0d1b30', to: '#1e6feb' },
  'smart-switch': { icon: Zap, from: '#16273f', to: '#3a5a8c' },
  hub: { icon: House, from: '#10459b', to: '#7cb0ff' },
  'led-strip': { icon: Lightbulb, from: '#e05e04', to: '#ff9433' },
  'cam-360': { icon: Cctv, from: '#10459b', to: '#4d90ff' },
  'cam-solar': { icon: Cctv, from: '#0a1628', to: '#1559c4' },
  sensor: { icon: Zap, from: '#1d3252', to: '#4d90ff' },
  doorbell: { icon: Camera, from: '#0d1b30', to: '#1e6feb' },
  'power-station': { icon: BatteryCharging, from: '#10459b', to: '#ff9433' },
  'solar-panel': { icon: Sun, from: '#e05e04', to: '#ffb46b' },
  'solar-light': { icon: Sun, from: '#f97316', to: '#ff9433' },
  multimeter: { icon: Wrench, from: '#16273f', to: '#3a5a8c' },
  scanner: { icon: Wrench, from: '#10459b', to: '#1e6feb' },
  'impact-wrench': { icon: Wrench, from: '#0d1b30', to: '#27436b' },
  gadget: { icon: Watch, from: '#10459b', to: '#1e6feb' },
  'smart-home': { icon: House, from: '#10459b', to: '#4d90ff' },
};

export function productThumbRegistryKeys(): string[] {
  return Object.keys(registry);
}

export function ProductThumb({
  imageKey,
  alt,
  className,
  size = 'md',
}: {
  imageKey: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const def = registry[imageKey] ?? registry.gadget!;
  const Icon = def.icon;
  const iconSize = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-24 w-24' : 'h-16 w-16';

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-white',
        className,
      )}
      style={{
        background:
          'radial-gradient(circle at 72% 18%, rgba(96,165,250,.20) 0%, transparent 27%), linear-gradient(145deg, #ffffff 0%, #f8fafc 58%, #eef4fb 100%)',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-[18%] bottom-[15%] h-3 rounded-full bg-slate-950/10 blur-md"
      />
      <div
        aria-hidden="true"
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30"
        style={{ background: `radial-gradient(circle, ${def.to}55 0%, transparent 68%)` }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-3 h-1 w-8 rounded-full"
        style={{ background: `linear-gradient(90deg, ${def.from}, ${def.to})` }}
      />
      <Icon
        aria-hidden="true"
        className={cn(iconSize, 'relative drop-shadow-[0_8px_12px_rgba(15,23,42,.18)]')}
        style={{ color: def.to }}
        strokeWidth={1.55}
      />
    </div>
  );
}
