import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import l from '@/lib/en';
import {
  deleteSession,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  try {
    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ ok: true });

    // Expiring the cookie completes logout in the browser as well as the database.
    response.cookies.set(
      SESSION_COOKIE_NAME,
      '',
      getSessionCookieOptions(new Date(0)),
    );

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Logout failed:', message);

    const response = NextResponse.json(
      { ok: false, error: l.auth.logoutFailed },
      { status: 500 },
    );
    response.cookies.set(
      SESSION_COOKIE_NAME,
      '',
      getSessionCookieOptions(new Date(0)),
    );

    return response;
  }
}
