import { NextResponse } from 'next/server';

import { signupSchema } from '@/lib/authValidation';
import { getDb } from '@/lib/db';
import { sendEmailVerification } from '@/lib/email';
import { generateEmailVerificationToken } from '@/lib/emailVerification';
import l from '@/lib/en';
import { hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidSignupDetails },
      { status: 400 },
    );
  }

  const result = signupSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidSignupDetails },
      { status: 400 },
    );
  }

  const { email, password } = result.data;

  try {
    const db = getDb();
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: l.auth.accountExists },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const { rawToken, tokenHash, expiresAt } = generateEmailVerificationToken();

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: expiresAt,
      },
      select: { id: true },
    });

    try {
      await sendEmailVerification(email, rawToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to send verification email:', message);

      try {
        await db.user.delete({ where: { id: user.id } });
      } catch (rollbackError) {
        const rollbackMessage =
          rollbackError instanceof Error
            ? rollbackError.message
            : 'Unknown error';
        console.error('Failed to roll back signup:', rollbackMessage);
      }

      return NextResponse.json(
        { ok: false, error: l.auth.signupFailed },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { ok: true, message: l.auth.signupSuccess },
      { status: 201 },
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { ok: false, error: l.auth.accountExists },
        { status: 409 },
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Signup failed:', message);

    return NextResponse.json(
      { ok: false, error: l.auth.signupFailed },
      { status: 500 },
    );
  }
}
