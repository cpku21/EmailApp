import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().trim().min(1).startsWith('postgres'),
});

type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const result = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
  });

  if (!result.success) {
    throw new Error(
      'Invalid environment variable DATABASE_URL: expected a non-empty PostgreSQL URL starting with "postgres".',
    );
  }

  return result.data;
}
