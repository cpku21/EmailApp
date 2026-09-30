import { NextResponse } from 'next/server';

import l from '@/lib/en';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Only public account fields are returned; password and token hashes stay server-side.
    const user = await getCurrentUser();

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Session check failed:', message);

    return NextResponse.json(
      { ok: false, error: l.auth.sessionFailed },
      { status: 500 },
    );
  }
}
