import { createHash, randomBytes } from 'node:crypto';

import { cookies } from 'next/headers';

import { getDb } from '@/lib/db';

export const SESSION_COOKIE_NAME = 'emailapp_session';

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export type CurrentUser = {
  id: number;
  email: string;
  emailVerifiedAt: Date | null;
};

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function getSessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires,
  };
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  // Only the token hash is persisted; the raw token exists only in the secure cookie.
  await getDb().session.create({
    data: {
      tokenHash: hashSessionToken(token),
      expiresAt,
      userId,
    },
  });

  return { token, expiresAt };
}

export async function deleteSession(token: string): Promise<void> {
  await getDb().session.deleteMany({
    where: { tokenHash: hashSessionToken(token) },
  });
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await getDb().session.findFirst({
    where: {
      tokenHash: hashSessionToken(token),
      expiresAt: { gt: new Date() },
    },
    select: {
      user: {
        select: {
          id: true,
          email: true,
          emailVerifiedAt: true,
        },
      },
    },
  });

  return session?.user ?? null;
}
