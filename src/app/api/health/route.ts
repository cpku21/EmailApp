import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Keep connection details on the server instead of exposing them to clients.
    console.error('MongoDB health check failed:', error);

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
