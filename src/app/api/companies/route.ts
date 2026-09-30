import { type NextRequest, NextResponse } from 'next/server';

import { findCompanies } from '@/lib/companies';
import { companyQuerySchema } from '@/lib/companyQuery';
import l from '@/lib/en';
import { getCurrentUser } from '@/lib/session';
import { resolveRegion } from '@/utils/regions';

export const dynamic = 'force-dynamic';

const privateResponseHeaders = {
  'Cache-Control': 'private, no-store',
};

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: l.auth.authenticationRequired },
        { status: 401, headers: privateResponseHeaders },
      );
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        { ok: false, error: l.auth.emailVerificationRequired },
        { status: 403, headers: privateResponseHeaders },
      );
    }

    const result = companyQuerySchema.safeParse({
      specialization:
        request.nextUrl.searchParams.get('specialization') ?? undefined,
      region: request.nextUrl.searchParams.get('region') ?? undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid query parameters' },
        { status: 400, headers: privateResponseHeaders },
      );
    }

    const countryCodes = result.data.region
      ? resolveRegion(result.data.region)
      : undefined;
    const companies = await findCompanies(
      result.data.specialization,
      countryCodes,
    );

    return NextResponse.json(
      { ok: true, companies },
      { headers: privateResponseHeaders },
    );
  } catch (error) {
    // Keep database error details on the server instead of exposing them.
    console.error('Failed to list companies:', error);

    return NextResponse.json(
      { ok: false },
      { status: 500, headers: privateResponseHeaders },
    );
  }
}
