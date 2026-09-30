import CompanyList from '@/components/CompanyList';
import FilterForm from '@/components/FilterForm';
import { findCompanies, type CompanyListItem } from '@/lib/companies';
import { companyQuerySchema } from '@/lib/companyQuery';
import l from '@/lib/en';
import { resolveRegion } from '@/utils/regions';

export const dynamic = 'force-dynamic';

type HomePageProps = {
  searchParams?: {
    specialization?: string | string[];
    region?: string | string[];
  };
};

export default async function Home({ searchParams = {} }: HomePageProps) {
  const result = companyQuerySchema.safeParse({
    specialization:
      typeof searchParams.specialization === 'string'
        ? searchParams.specialization
        : undefined,
    region:
      typeof searchParams.region === 'string' ? searchParams.region : undefined,
  });
  const filters = result.success
    ? result.data
    : { specialization: undefined, region: undefined };
  const countryCodes = filters.region
    ? resolveRegion(filters.region)
    : undefined;

  let companies: CompanyListItem[] = [];
  let loadFailed = false;

  if (filters.specialization) {
    try {
      companies = await findCompanies(filters.specialization, countryCodes);
    } catch (error) {
      // Visitors see a safe message while the detailed error stays on the server.
      console.error('Failed to load companies on the home page:', error);
      loadFailed = true;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <span className="text-lg font-bold tracking-tight">
            {l.home.appName}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
            {l.home.eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {l.home.heroTitle}
            <span className="mt-1 block text-blue-400">
              {l.home.heroHighlight}
            </span>
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
            {l.home.heroDescription}
          </p>
        </section>

        <FilterForm
          selectedSpecialization={filters.specialization}
          selectedRegion={filters.region}
        />

        <div className="mt-8">
          {!filters.specialization ? (
            <p className="rounded-2xl border border-blue-900 bg-blue-950/40 px-5 py-8 text-center text-blue-100">
              {l.home.selectSpecializationPrompt}
            </p>
          ) : loadFailed ? (
            <p
              role="alert"
              className="rounded-2xl border border-red-900 bg-red-950/40 px-5 py-6 text-sm text-red-200"
            >
              {l.home.loadError}
            </p>
          ) : (
            <CompanyList companies={companies} />
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-sm text-slate-400 sm:px-6 lg:px-8">
          {l.home.footer}
        </div>
      </footer>
    </div>
  );
}
