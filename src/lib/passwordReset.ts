import { createHash, randomBytes } from 'node:crypto';

const PASSWORD_RESET_EXPIRATION_MS = 60 * 60 * 1000;

// Reset requests are limited without reducing the one-hour token lifetime.
export const PASSWORD_RESET_COOLDOWN_MS = 60 * 1000;

export function generatePasswordResetToken(): {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
} {
  const rawToken = randomBytes(32).toString('hex');

  return {
    rawToken,
    tokenHash: hashPasswordResetToken(rawToken),
    expiresAt: new Date(Date.now() + PASSWORD_RESET_EXPIRATION_MS),
  };
}

export function hashPasswordResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
