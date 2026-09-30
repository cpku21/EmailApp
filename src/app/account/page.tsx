import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import LogoutButton from '@/components/LogoutButton';
import l from '@/lib/en';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: l.account.metadataTitle,
  description: l.account.metadataDescription,
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  // Account details are rendered only after the server validates the session.
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex min-h-16 w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {l.account.appName}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/directory"
              className="inline-flex h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {l.account.directoryLink}
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            {l.account.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {l.account.title}
          </h1>
          <p className="mt-4 leading-7 text-slate-300">
            {l.account.description}
          </p>

          <dl className="mt-8 divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="px-5 py-5 sm:grid sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-4 sm:px-6">
              <dt className="text-sm font-semibold text-slate-400">
                {l.account.emailLabel}
              </dt>
              <dd className="mt-2 break-all text-slate-100 sm:mt-0">
                {user.email}
              </dd>
            </div>

            <div className="px-5 py-5 sm:grid sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-4 sm:px-6">
              <dt className="text-sm font-semibold text-slate-400">
                {l.account.verificationLabel}
              </dt>
              <dd className="mt-2 sm:mt-0">
                <span
                  className={
                    user.emailVerifiedAt
                      ? 'inline-flex rounded-full bg-emerald-950 px-3 py-1 text-sm font-semibold text-emerald-300'
                      : 'inline-flex rounded-full bg-amber-950 px-3 py-1 text-sm font-semibold text-amber-300'
                  }
                >
                  {user.emailVerifiedAt
                    ? l.account.verified
                    : l.account.notVerified}
                </span>
              </dd>
            </div>

            <div className="px-5 py-5 sm:grid sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-4 sm:px-6">
              <dt className="text-sm font-semibold text-slate-400">
                {l.account.planLabel}
              </dt>
              <dd className="mt-2 font-semibold text-slate-100 sm:mt-0">
                {l.account.freePlan}
              </dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="border-t border-slate-800">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 text-sm text-slate-400 sm:px-6 lg:px-8">
          {l.account.footer}
        </div>
      </footer>
    </div>
  );
}
