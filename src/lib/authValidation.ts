import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8)
  .max(72)
  .refine((password) => new TextEncoder().encode(password).length <= 72);

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
  password: passwordSchema,
});

// Login applies the same email normalization and bcrypt-safe password limits as signup.
export const loginSchema = signupSchema;

export const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export const verificationTokenSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/i),
});
