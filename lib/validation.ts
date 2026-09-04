import { z } from 'zod';
import { supportedLanguages } from '@/lib/constants';

const text = (max: number) => z.string().trim().min(1).max(max);
const code = z.string().max(50_000).refine((value) => value.trim().length > 0, 'required');
const optionalCode = z.string().max(50_000);

export const algorithmInputSchema = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title_en: text(160),
  title_ru: text(160),
  title_uz: text(160),
  description_en: text(2_000),
  description_ru: text(2_000),
  description_uz: text(2_000),
  codes: z.object({
    cpp: optionalCode,
    python: code,
    javascript: optionalCode,
    typescript: optionalCode,
    java: optionalCode,
    go: optionalCode,
    rust: optionalCode,
  }),
  published: z.boolean(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  password: z.string().min(1).max(256),
});

export type AlgorithmInput = z.infer<typeof algorithmInputSchema>;
export type AlgorithmCodeInput = AlgorithmInput['codes'];
export const algorithmLanguages = z.enum(supportedLanguages);
