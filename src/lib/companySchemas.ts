import { z } from 'zod';

const emptyToNull = (v: string | null | undefined) => (v ? v : null);

export const companyInput = z.object({
  name: z.string().trim().min(2, 'Company name is required').max(120),
  description: z.string().trim().max(2000).nullish().transform(emptyToNull),
  website: z
    .string()
    .trim()
    .max(300)
    .nullish()
    .transform(emptyToNull)
    .refine((v) => !v || /^https?:\/\//i.test(v), 'Website must start with http:// or https://'),
  // só aceita arquivos enviados pela nossa rota de upload
  logoUrl: z
    .string()
    .trim()
    .nullish()
    .transform(emptyToNull)
    .refine((v) => !v || /^\/uploads\/companies\/[\w.-]+$/.test(v), 'Invalid logo'),
});

const companyRole = z.enum(['OWNER', 'MEMBER']);

export const addMemberInput = z.object({
  userId: z.number().int().positive(),
  companyRole: companyRole.default('MEMBER'),
});

export const newMemberInput = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(60),
  lastName: z.string().trim().min(1, 'Last name is required').max(60),
  username: z
    .string()
    .trim()
    .min(3, 'Username must have at least 3 characters')
    .max(40)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only use letters, numbers, dot, dash and underscore'),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(160),
  password: z.string().min(8, 'Password must have at least 8 characters').max(100),
  companyRole: companyRole.default('MEMBER'),
});

export const roleInput = z.object({ companyRole: companyRole });