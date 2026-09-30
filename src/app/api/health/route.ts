import { NextResponse } from 'next/server';

import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await getDb().$queryRaw`SELECT 1`;

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Keep connection details on the server instead of exposing them to clients.
    console.error('PostgreSQL health check failed:', error);

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
