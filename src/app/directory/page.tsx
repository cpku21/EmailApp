import Link from 'next/link';
import { redirect } from 'next/navigation';

import CompanyList from '@/components/CompanyList';
import FilterForm from '@/components/FilterForm';
import LogoutButton from '@/components/LogoutButton';
import ResendVerificationButton from '@/components/ResendVerificationButton';
import { findCompanies, type CompanyListItem } from '@/lib/companies';
import { companyQuerySchema } from '@/lib/companyQuery';
import l from '@/lib/en';
import { getCurrentUser } from '@/lib/session';
import { resolveRegion } from '@/utils/regions';

export const dynamic = 'force-dynamic';

type DirectoryPageProps = {
  searchParams?: Promise<{
    specialization?: string | string[];
    region?: string | string[];
  }>;
};

export default async function DirectoryPage({
  searchParams,
}: DirectoryPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (!user.emailVerifiedAt) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800">
          <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {l.directory.appName}
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="inline-flex h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {l.directory.accountLink}
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-12 sm:px-6">
          <section className="w-full rounded-2xl border border-amber-900 bg-amber-950/30 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              {l.directory.verificationRequiredLabel}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-white">
              {l.directory.verificationRequiredTitle}
            </h1>
            <p className="mt-4 leading-7 text-slate-300">
              {l.directory.verificationRequiredDescription}
            </p>
            <ResendVerificationButton />
          </section>
        </main>
      </div>
    );
  }

  const result = companyQuerySchema.safeParse({
    specialization:
      typeof resolvedSearchParams.specialization === 'string'
        ? resolvedSearchParams.specialization
        : undefined,
    region:
      typeof resolvedSearchParams.region === 'string'
        ? resolvedSearchParams.region
        : undefined,
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
      console.error('Failed to load companies in the directory:', error);
      loadFailed = true;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {l.directory.appName}
          </Link>
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/account"
              className="inline-flex h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {l.directory.accountLink}
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
            {l.directory.eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {l.directory.heroTitle}
            <span className="mt-1 block text-blue-400">
              {l.directory.heroHighlight}
            </span>
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
            {l.directory.heroDescription}
          </p>
        </section>

        <FilterForm
          selectedSpecialization={filters.specialization}
          selectedRegion={filters.region}
        />

        <div className="mt-8">
          {!filters.specialization ? (
            <p className="rounded-2xl border border-blue-900 bg-blue-950/40 px-5 py-8 text-center text-blue-100">
              {l.directory.selectSpecializationPrompt}
            </p>
          ) : loadFailed ? (
            <p
              role="alert"
              className="rounded-2xl border border-red-900 bg-red-950/40 px-5 py-6 text-sm text-red-200"
            >
              {l.directory.loadError}
            </p>
          ) : (
            <CompanyList companies={companies} />
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-sm text-slate-400 sm:px-6 lg:px-8">
          {l.directory.footer}
        </div>
      </footer>
    </div>
  );
}
