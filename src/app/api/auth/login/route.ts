import { NextResponse } from 'next/server';

import { loginSchema } from '@/lib/authValidation';
import { getDb } from '@/lib/db';
import l from '@/lib/en';
import { verifyPassword } from '@/lib/password';
import {
  createSession,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidCredentials },
      { status: 400 },
    );
  }

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: l.auth.invalidCredentials },
      { status: 400 },
    );
  }

  try {
    const user = await getDb().user.findUnique({
      where: { email: result.data.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        emailVerifiedAt: true,
      },
    });

    if (
      !user ||
      !(await verifyPassword(result.data.password, user.passwordHash))
    ) {
      return NextResponse.json(
        { ok: false, error: l.auth.invalidCredentials },
        { status: 401 },
      );
    }

    const session = await createSession(user.id);
    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    });

    // The browser receives the raw token only through a protected cookie.
    response.cookies.set(
      SESSION_COOKIE_NAME,
      session.token,
      getSessionCookieOptions(session.expiresAt),
    );

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Login failed:', message);

    return NextResponse.json(
      { ok: false, error: l.auth.loginFailed },
      { status: 500 },
    );
  }
}
