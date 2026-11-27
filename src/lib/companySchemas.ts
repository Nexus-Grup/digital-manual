import { z } from 'zod';
import { isCompanyLogoUrl } from '@/lib/logoUrl';

const emptyToNull = (v: string | null | undefined) => (v ? v : null);

export const companyInput = z.object({
  name: z.string().trim().min(2, 'O nome da empresa é obrigatório').max(120),
  description: z.string().trim().max(2000).nullish().transform(emptyToNull),
  website: z
    .string()
    .trim()
    .max(300)
    .nullish()
    .transform(emptyToNull)
    .refine((v) => !v || /^https?:\/\//i.test(v), 'O site precisa começar com http:// ou https://'),
  // só aceita arquivos enviados pela nossa rota de upload
  logoUrl: z
    .string()
    .trim()
    .nullish()
    .transform(emptyToNull)
    .refine(
      (v) =>
        !v ||
        isCompanyLogoUrl(v) ||
        /^\/uploads\/companies\/[\w.-]+$/.test(v),'Logo inválido'
  ),
});

const companyRole = z.enum(['OWNER', 'MANAGER', 'MEMBER']);

export const addMemberInput = z.object({
  userId: z.number().int().positive(),
  companyRole: companyRole.default('MEMBER'),
});

export const newMemberInput = z.object({
  firstName: z.string().trim().min(1, 'O nome é obrigatório').max(60),
  lastName: z.string().trim().min(1, 'O sobrenome é obrigatório').max(60),
  username: z
    .string()
    .trim()
    .min(3, 'O nome de usuário precisa ter pelo menos 3 caracteres')
    .max(40)
    .regex(/^[a-zA-Z0-9._-]+$/, 'O nome de usuário só pode ter letras, números, pontos, hifens e sublinhados'),
  email: z.string().trim().toLowerCase().email('Digite um e-mail válido').max(160),
  password: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres').max(100),
  companyRole: companyRole.default('MEMBER'),
});

export const roleInput = z.object({ companyRole: companyRole });