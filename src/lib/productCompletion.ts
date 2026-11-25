import type { Progress, StepKey } from '@/_lib/productTypes';

// Regra: "Basic Information" sempre conta (o produto só existe depois dela).
// As outras 5 etapas contam quando têm conteúdo. Completo = 100%.
const TOTAL_STEPS = 6;

export function computeProgress(
  has: Record<StepKey, boolean>,
  updatedAt: Date,
): Progress {
  const done = 1 + Object.values(has).filter(Boolean).length;
  return {
    completion: Math.round((done / TOTAL_STEPS) * 100),
    steps: has,
    updatedAt: updatedAt.toISOString(),
  };
}

type Counts = {
  galleries: number; videos: number; audios: number;
  technicalSheets: number; manuals: number; informations: number; assemblies: number; qrCodes: number;
};

export const COUNT_SELECT = {
  galleries: true, videos: true, audios: true, technicalSheets: true,
  manuals: true, informations: true, assemblies: true, qrCodes: true,
} as const;

export function stepsFromCounts(imgUrl: string | null, c: Counts): Record<StepKey, boolean> {
  return {
    media: !!imgUrl || c.galleries > 0 || c.videos > 0 || c.audios > 0,
    technical: c.technicalSheets > 0,
    manuals: c.manuals > 0,
    guides: c.informations > 0 || c.assemblies > 0,
    qr: c.qrCodes > 0,
  };
}
