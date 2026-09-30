import { NextResponse } from 'next/server';

import { resetPasswordSchema } from '@/lib/authValidation';
import { getDb } from '@/lib/db';
import l from '@/lib/en';
import { hashPassword } from '@/lib/password';
import { hashPasswordResetToken } from '@/lib/passwordReset';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidPasswordResetLink },
      { status: 400 },
    );
  }

  const result = resetPasswordSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidPasswordResetLink },
      { status: 400 },
    );
  }

  try {
    const db = getDb();
    const tokenHash = hashPasswordResetToken(result.data.token);
    const passwordHash = await hashPassword(result.data.password);

    // Password replacement and session revocation commit in one transaction.
    const resetSucceeded = await db.$transaction(async (transaction) => {
      const user = await transaction.user.findFirst({
        where: {
          passwordResetTokenHash: tokenHash,
          passwordResetExpiresAt: { gt: new Date() },
        },
        select: { id: true },
      });

      if (!user) {
        return false;
      }

      const passwordUpdate = await transaction.user.updateMany({
        where: {
          id: user.id,
          passwordResetTokenHash: tokenHash,
          passwordResetExpiresAt: { gt: new Date() },
        },
        data: {
          passwordHash,
          passwordResetTokenHash: null,
          passwordResetExpiresAt: null,
          passwordResetSentAt: null,
        },
      });

      if (passwordUpdate.count !== 1) {
        return false;
      }

      await transaction.session.deleteMany({ where: { userId: user.id } });
      return true;
    });

    if (!resetSucceeded) {
      return NextResponse.json(
        { ok: false, error: l.auth.invalidPasswordResetLink },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: l.auth.passwordResetSuccess,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Password reset failed:', message);

    return NextResponse.json(
      { ok: false, error: l.auth.passwordResetFailed },
      { status: 500 },
    );
  }
}
