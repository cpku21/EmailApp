import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().trim().min(1),
});

type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const result = envSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
  });

  if (!result.success) {
    throw new Error(
      'Invalid environment variable MONGODB_URI: expected a non-empty string.',
    );
  }

  return result.data;
}
