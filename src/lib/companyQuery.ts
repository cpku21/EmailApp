import { z } from 'zod';

import { SPECIALIZATIONS } from '@/lib/specializations';

export const companyQuerySchema = z.object({
  specialization: z.enum(SPECIALIZATIONS).optional(),
  region: z
    .string()
    .regex(/^(EU|EUROPE|[A-Z]{2})$/i)
    .transform((value) => value.toUpperCase())
    .optional(),
});
