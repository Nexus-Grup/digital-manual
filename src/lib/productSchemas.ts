import { z } from 'zod';
import {
  ALL_SUBCATEGORIES, ASSEMBLY_TYPES, AUDIO_TYPES, CATEGORIES, DOCUMENT_TYPES, INFO_ICONS, SUBCATEGORIES, tuple,
} from '@/_lib/productConstants';
import { isProductMediaUrl } from '@/lib/productMedia';

const emptyToNull = (v: string | null | undefined) => (v ? v : null);
const optText = (max: number) => z.string().trim().max(max).nullish().transform(emptyToNull);
const mediaUrl = z.string().trim().refine((v) => isProductMediaUrl(v), 'Arquivo inválido');
const optMediaUrl = mediaUrl.nullish().transform(emptyToNull);
const httpUrl = (msg: string) => z.string().trim().max(500).refine((v) => /^https?:\/\/\S+$/i.test(v), msg);

const subOk = (v: { category: string; subcategory?: string | null }) =>
  !v.subcategory || (SUBCATEGORIES[v.category] ?? []).some((s) => s.value === v.subcategory);
const SUB_MSG = 'Esta subcategoria não pertence à categoria selecionada';

/* ---------- Etapa 1 ---------- */
const basicShape = z.object({
  name: z.string().trim().min(2, 'O nome do produto é obrigatório').max(160),
  model: z.string().trim().min(1, 'O modelo do produto é obrigatório').max(120),
  code: z.string().trim().min(2, 'O SKU / código é obrigatório').max(80),
  category: z.enum(tuple(CATEGORIES)),
  subcategory: z.enum(tuple(ALL_SUBCATEGORIES)).nullish().transform((v) => v ?? null),
  description: optText(4000),
});

export const updateBasicInput = basicShape.refine(subOk, { message: SUB_MSG, path: ['subcategory'] });
export const createProductInput = basicShape
  .extend({ brandId: z.number().int().positive('Selecione uma marca') })
  .refine(subOk, { message: SUB_MSG, path: ['subcategory'] });

/* ---------- Etapa 2 ---------- */
export const mediaInput = z.object({
  imgUrl: optMediaUrl,
  gallery: z.array(mediaUrl).max(7, 'A galeria aceita até 7 imagens').default([]),
  model3dUrl: httpUrl('Digite uma URL válida para o modelo 3D').nullish().transform(emptyToNull),
  videos: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'O título do vídeo é obrigatório').max(160),
        url: httpUrl('Digite uma URL de vídeo válida'),
        code: optText(80),
        description: optText(1000),
      }),
    )
    .max(20)
    .default([]),
  audios: z
    .array(z.object({ audioUrl: mediaUrl, audioType: z.enum(tuple(AUDIO_TYPES)) }))
    .max(10)
    .default([]),
});

/* ---------- Etapa 3 ---------- */
/** "1.8 kg", "1,8", "500 g" -> kg (ou null se não for número) */
export function parseWeightKg(raw: string): number | null {
  const m = /^(\d+(?:[.,]\d+)?)\s*(kg|g)?$/i.exec(raw.trim());
  if (!m) return null;
  const n = Number(m[1].replace(',', '.'));
  const kg = m[2]?.toLowerCase() === 'g' ? n / 1000 : n;
  return Math.round(kg * 100) / 100;
}

export const technicalInput = z.object({
  title: z.string().trim().min(2, 'O título da ficha técnica é obrigatório').max(160),
  description: optText(2000),
  material: optText(120),
  dimensions: optText(120),
  weight: z
    .string()
    .trim()
    .max(40)
    .nullish()
    .transform(emptyToNull)
    .refine((v) => !v || parseWeightKg(v) !== null, 'Enter the weight as a number, e.g. 1.8 kg'),
  specs: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(80),
        unit: optText(20),
        value: z.string().trim().min(1, 'O valor da especificação é obrigatório').max(80),
      }),
    )
    .max(40)
    .default([]),
});

/* ---------- Etapa 4 ---------- */
export const manualsInput = z.object({
  manuals: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'O título do manual é obrigatório').max(160),
        fileUrl: mediaUrl,
        documentType: z.enum(tuple(DOCUMENT_TYPES)),
        language: optText(10),
        version: optText(40),
      }),
    )
    .max(20)
    .default([]),
});

/* ---------- Etapa 5 ---------- */
const infoCard = z.object({
  title: z.string().trim().min(1, 'O título do card é obrigatório').max(120),
  icon: z.enum(tuple(INFO_ICONS)).nullish().transform((v) => v ?? null),
  description: optText(500),
});
const guideStep = z.object({
  title: z.string().trim().min(1, 'O título do passo é obrigatório').max(160),
  description: optText(2000),
  imageUrl: optMediaUrl,
});

export const guidesInput = z.object({
  information: z
    .object({
      title: z.string().trim().min(2, 'O título da informação é obrigatório').max(160),
      description: optText(2000),
      cards: z.array(infoCard).max(30).default([]),
    })
    .nullish()
    .transform((v) => v ?? null),
  assemblies: z
    .array(
      z.object({
        title: z.string().trim().min(2, 'O título do guia é obrigatório').max(160),
        type: z.enum(tuple(ASSEMBLY_TYPES)),
        description: optText(4000),
        imageUrl: optMediaUrl,
        steps: z.array(guideStep).max(60).default([]),
      }),
    )
    .max(10)
    .default([]),
});

/* ---------- Outros ---------- */
export const statusInput = z.object({ status: z.enum(['DRAFT', 'PUBLISHED']) });
export const qrPatchInput = z.object({ isActive: z.boolean() });
