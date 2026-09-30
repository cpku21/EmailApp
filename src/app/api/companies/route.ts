import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { findCompanies } from '@/lib/companies';
import { SPECIALIZATIONS } from '@/lib/specializations';
import { resolveRegion } from '@/utils/regions';

export const dynamic = 'force-dynamic';

const querySchema = z.object({
  specialization: z.enum(SPECIALIZATIONS).optional(),
  region: z
    .string()
    .regex(/^(EU|EUROPE|[A-Z]{2})$/i)
    .optional(),
});

export async function GET(request: NextRequest) {
  const result = querySchema.safeParse({
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
