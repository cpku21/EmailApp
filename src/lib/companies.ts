import { getDb } from '@/lib/db';
import type { Specialization } from '@/lib/specializations';

export type CompanyListItem = {
  name: string;
  email: string;
  country: string;
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
      country: countryCodes ? { in: countryCodes } : undefined,
    },
    select: {
      name: true,
      email: true,
      country: true,
      specializations: true,
      note: true,
    },
    orderBy: {
      name: 'asc',
    },
    take: 200,
  });
}
