import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().trim().min(1).startsWith('postgres'),
});

const emailEnvSchema = z.object({
  APP_URL: z.string().trim().url(),
  SMTP_HOST: z.string().trim().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  SMTP_SECURE: z.enum(['true', 'false']).transform((value) => value === 'true'),
  SMTP_USER: z.string().trim().min(1),
  SMTP_PASSWORD: z.string().min(1),
  EMAIL_FROM: z.string().trim().min(1),
});

type Env = z.infer<typeof envSchema>;
export type EmailEnv = z.infer<typeof emailEnvSchema>;

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

export function getEmailEnv(): EmailEnv {
  const result = emailEnvSchema.safeParse({
    APP_URL: process.env.APP_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
  });

  if (!result.success) {
    const invalidVariables = Array.from(
      new Set(
        result.error.issues
          .map((issue) => issue.path[0])
          .filter((name): name is string => typeof name === 'string'),
      ),
    );

    throw new Error(
      `Invalid email environment variables: ${invalidVariables.join(', ')}.`,
    );
  }

  return result.data;
}
