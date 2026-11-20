import { z } from 'zod';
import { isCompanyLogoUrl } from '@/lib/logoUrl';

const emptyToNull = (v: string | null | undefined) => (v ? v : null);

// Enum BrandRole do Prisma
const brandRole = z.enum(['EDITOR', 'VIEWER']);

export const brandInput = z.object({
  name: z.string().trim().min(2, 'Brand name is required').max(120),
  description: z.string().trim().max(2000).nullish().transform(emptyToNull),
  // só aceita arquivos enviados pela nossa rota de upload (mesmo bucket dos logos de empresa)
  logoUrl: z
    .string()
    .trim()
    .nullish()
    .transform(emptyToNull)
    .refine((v) => !v || isCompanyLogoUrl(v), 'Invalid logo'),
});

export const createBrandInput = brandInput.extend({
  companyId: z.number().int().positive(),
});

// Ativar / desativar a marca
export const brandStatusInput = z.object({ isActive: z.boolean() });

export const addBrandMemberInput = z.object({
  userId: z.number().int().positive(),
  brandRole: brandRole.default('VIEWER'),
});

export const brandRoleInput = z.object({ brandRole });
