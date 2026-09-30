import { type NextRequest, NextResponse } from 'next/server';

import { findCompanies } from '@/lib/companies';
import { companyQuerySchema } from '@/lib/companyQuery';
import { resolveRegion } from '@/utils/regions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const result = companyQuerySchema.safeParse({
    specialization:
      request.nextUrl.searchParams.get('specialization') ?? undefined,
    region: request.nextUrl.searchParams.get('region') ?? undefined,
  });

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid query parameters' },
      { status: 400 },
    );
  }

  try {
    const countryCodes = result.data.region
      ? resolveRegion(result.data.region)
      : undefined;
    const companies = await findCompanies(
      result.data.specialization,
      countryCodes,
    );

    return NextResponse.json({ ok: true, companies });
  } catch (error) {
    // Keep database error details on the server instead of exposing them.
    console.error('Failed to list companies:', error);

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
