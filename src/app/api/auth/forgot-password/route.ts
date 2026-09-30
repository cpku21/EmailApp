import { NextResponse } from 'next/server';

import { forgotPasswordSchema } from '@/lib/authValidation';
import { getDb } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import l from '@/lib/en';
import {
  generatePasswordResetToken,
  PASSWORD_RESET_COOLDOWN_MS,
} from '@/lib/passwordReset';

export const dynamic = 'force-dynamic';

function successResponse() {
  // A generic response prevents visitors from discovering registered emails.
  return NextResponse.json({
    ok: true,
    message: l.auth.passwordResetRequestSuccess,
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidResetEmail },
      { status: 400 },
    );
  }

  const result = forgotPasswordSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidResetEmail },
      { status: 400 },
    );
  }

  try {
    const db = getDb();
    const user = await db.user.findUnique({
      where: { email: result.data.email },
      select: {
        id: true,
        email: true,
        passwordResetTokenHash: true,
        passwordResetExpiresAt: true,
        passwordResetSentAt: true,
      },
    });

    if (!user) {
      return successResponse();
    }

    const now = new Date();
    const cooldownStartedAfter = new Date(
      now.getTime() - PASSWORD_RESET_COOLDOWN_MS,
    );
    const { rawToken, tokenHash, expiresAt } = generatePasswordResetToken();
    const resetClaim = await db.user.updateMany({
      where: {
        id: user.id,
        OR: [
          { passwordResetSentAt: null },
          { passwordResetSentAt: { lte: cooldownStartedAfter } },
        ],
      },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: expiresAt,
        passwordResetSentAt: now,
      },
    });

    if (resetClaim.count !== 1) {
      return successResponse();
    }

    try {
      await sendPasswordResetEmail(user.email, rawToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to send password reset email:', message);

      try {
        await db.user.updateMany({
          where: {
            id: user.id,
            passwordResetTokenHash: tokenHash,
          },
          data: {
            passwordResetTokenHash: user.passwordResetTokenHash,
            passwordResetExpiresAt: user.passwordResetExpiresAt,
            passwordResetSentAt: user.passwordResetSentAt,
          },
        });
      } catch (rollbackError) {
        const rollbackMessage =
          rollbackError instanceof Error
            ? rollbackError.message
            : 'Unknown error';
        console.error('Failed to roll back password reset:', rollbackMessage);
      }
    }

    return successResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Password reset request failed:', message);

    return NextResponse.json(
      { ok: false, error: l.auth.passwordResetRequestFailed },
      { status: 500 },
    );
  }
}
