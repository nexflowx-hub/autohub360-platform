import {
  Lightbulb,
  Zap,
  Camera,
  ShieldCheck,
  MonitorSmartphone,
  BatteryCharging,
  Bike,
  Truck,
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

/** Deterministic product artwork per imageKey — crisp SVG placeholders, no external images. */

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
  const iconSize = size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-28 w-28' : 'h-20 w-20';
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-lg',
        className,
      )}
      style={{ background: `linear-gradient(140deg, ${def.from} 0%, ${def.to} 100%)` }}
    >
      <div
        aria-hidden="true"
        className="absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
      />
      <Icon aria-hidden="true" className={cn(iconSize, 'relative text-white/95')} strokeWidth={1.4} />
    </div>
  );
}
