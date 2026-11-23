import {
  BatteryCharging, Clock, Info, Lightbulb, Ruler, ShieldCheck, Thermometer, Volume2, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  lightbulb: Lightbulb, zap: Zap, battery: BatteryCharging, shield: ShieldCheck, wrench: Wrench,
  clock: Clock, volume: Volume2, ruler: Ruler, thermometer: Thermometer, info: Info,
};

export function InfoIcon({ name, size = 20 }: { name: string | null; size?: number }) {
  const Icon = (name && MAP[name]) || Info;
  return <Icon size={size} aria-hidden />;
}
