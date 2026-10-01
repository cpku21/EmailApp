import { getDb } from '@/lib/db';
import type { Specialization } from '@/lib/specializations';

export type CompanyListItem = {
  name: string;
  email: string;
  country: string;
  hiringCountries: string[];
  specializations: string[];
  note: string | null;
};

export async function findCompanies(
  specialization?: Specialization,
  countryCodes?: string[],
): Promise<CompanyListItem[]> {
  return getDb().company.findMany({
    where: {
      isActive: true,
      specializations: specialization ? { has: specialization } : undefined,
      // Region filters describe candidate eligibility, not company headquarters.
      hiringCountries: countryCodes ? { hasSome: countryCodes } : undefined,
    },
    select: {
      name: true,
      email: true,
      country: true,
      hiringCountries: true,
      specializations: true,
      note: true,
    },
    orderBy: {
      name: 'asc',
    },
    take: 200,
  });
}
