import { NextResponse } from 'next/server';

import { verificationTokenSchema } from '@/lib/authValidation';
import { getDb } from '@/lib/db';
import { hashEmailVerificationToken } from '@/lib/emailVerification';
import l from '@/lib/en';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidVerificationLink },
      { status: 400 },
    );
  }

  const result = verificationTokenSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidVerificationLink },
      { status: 400 },
    );
  }

  try {
    const verificationResult = await getDb().user.updateMany({
      where: {
        emailVerificationTokenHash: hashEmailVerificationToken(
          result.data.token,
        ),
        emailVerificationExpiresAt: { gt: new Date() },
        emailVerifiedAt: null,
      },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
      },
    });

    if (verificationResult.count !== 1) {
      return NextResponse.json(
        { ok: false, error: l.auth.invalidVerificationLink },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: l.auth.verificationSuccess,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email verification failed:', message);

    return NextResponse.json(
      { ok: false, error: l.auth.verificationFailed },
      { status: 500 },
    );
  }
}
