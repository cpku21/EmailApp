import { connectToDatabase } from '@/lib/mongodb';
import CompanyModel from '@/lib/models/Company';
import type { Specialization } from '@/lib/specializations';

export async function findCompanies(
  specialization?: Specialization,
  countryCodes?: string[],
) {
  await connectToDatabase();

  const filter: {
    isActive: true;
    specializations?: Specialization;
    country?: { $in: string[] };
  } = {
    isActive: true,
  };

  if (specialization) {
    filter.specializations = specialization;
  }

  if (countryCodes) {
    filter.country = { $in: countryCodes };
  }

  return CompanyModel.find(filter)
    .select({
      _id: 0,
      name: 1,
      email: 1,
      country: 1,
      specializations: 1,
      note: 1,
    })
    .sort({ name: 1 })
    .limit(200)
    .lean()
    .exec();
}
