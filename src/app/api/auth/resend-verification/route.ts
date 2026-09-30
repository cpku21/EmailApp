import { NextResponse } from 'next/server';

import { getDb } from '@/lib/db';
import { sendEmailVerification } from '@/lib/email';
import {
  EMAIL_VERIFICATION_RESEND_COOLDOWN_MS,
  generateEmailVerificationToken,
} from '@/lib/emailVerification';
import l from '@/lib/en';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { ok: false, error: l.auth.authenticationRequired },
        { status: 401 },
      );
    }

    const db = getDb();
    const user = await db.user.findUnique({
      where: { id: currentUser.id },
      select: {
        email: true,
        emailVerifiedAt: true,
        emailVerificationTokenHash: true,
        emailVerificationExpiresAt: true,
        emailVerificationSentAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: l.auth.authenticationRequired },
        { status: 401 },
      );
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json({
        ok: true,
        message: l.auth.verificationAlreadyComplete,
      });
    }

    const now = new Date();
    const cooldownStartedAfter = new Date(
      now.getTime() - EMAIL_VERIFICATION_RESEND_COOLDOWN_MS,
    );
    const { rawToken, tokenHash, expiresAt } = generateEmailVerificationToken();

    // The conditional update allows only one request to acquire the resend cooldown.
    const resendClaim = await db.user.updateMany({
      where: {
        id: currentUser.id,
        emailVerifiedAt: null,
        OR: [
          { emailVerificationSentAt: null },
          { emailVerificationSentAt: { lte: cooldownStartedAfter } },
        ],
      },
      data: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: expiresAt,
        emailVerificationSentAt: now,
      },
    });

    if (resendClaim.count !== 1) {
      return NextResponse.json(
        { ok: false, error: l.auth.verificationResendCooldown },
        { status: 429 },
      );
    }

    try {
      await sendEmailVerification(user.email, rawToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to resend verification email:', message);

      try {
        await db.user.updateMany({
          where: {
            id: currentUser.id,
            emailVerificationTokenHash: tokenHash,
            emailVerifiedAt: null,
          },
          data: {
            emailVerificationTokenHash: user.emailVerificationTokenHash,
            emailVerificationExpiresAt: user.emailVerificationExpiresAt,
            emailVerificationSentAt: user.emailVerificationSentAt,
          },
        });
      } catch (rollbackError) {
        const rollbackMessage =
          rollbackError instanceof Error
            ? rollbackError.message
            : 'Unknown error';
        console.error(
          'Failed to roll back verification resend:',
          rollbackMessage,
        );
      }

      return NextResponse.json(
        { ok: false, error: l.auth.verificationResendFailed },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: l.auth.verificationResendSuccess,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Verification resend failed:', message);

    return NextResponse.json(
      { ok: false, error: l.auth.verificationResendFailed },
      { status: 500 },
    );
  }
}
