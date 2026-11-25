import {
  Battery, Clock, Info, Lightbulb, Ruler, Shield, Thermometer, Volume2, Wrench, Zap, type LucideIcon,
} from 'lucide-react';

// Icons of the information highlights (same values as INFO_ICONS in productConstants).
// Plain module (no 'use client') so Server Components can use it too.
export const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  lightbulb: Lightbulb, zap: Zap, battery: Battery, shield: Shield, wrench: Wrench,
  clock: Clock, volume: Volume2, ruler: Ruler, thermometer: Thermometer, info: Info,
};

export const highlightIcon = (name: string | null): LucideIcon => (name && HIGHLIGHT_ICONS[name]) || Info;
