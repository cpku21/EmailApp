import { createHash, randomBytes } from 'node:crypto';

const EMAIL_VERIFICATION_EXPIRATION_MS = 24 * 60 * 60 * 1000;

// The cooldown limits repeated verification emails without shortening token validity.
export const EMAIL_VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;

export function generateEmailVerificationToken(): {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
} {
  const rawToken = randomBytes(32).toString('hex');

  return {
    rawToken,
    tokenHash: hashEmailVerificationToken(rawToken),
    expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_EXPIRATION_MS),
  };
}

export function hashEmailVerificationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
