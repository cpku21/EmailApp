import Link from 'next/link';

import l from '@/lib/en';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <span className="text-lg font-bold tracking-tight">
            {l.landing.appName}
          </span>
          <nav aria-label={l.landing.accountNavigation} className="flex gap-3">
            <Link
              href="/sign-in"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {l.landing.signIn}
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {l.landing.createAccount}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
          <section className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">
              {l.landing.eyebrow}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {l.landing.title}
              <span className="mt-2 block text-blue-400">
                {l.landing.highlight}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {l.landing.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {l.landing.primaryAction}
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-700 px-6 text-sm font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {l.landing.secondaryAction}
              </Link>
            </div>
          </section>

          {/* The plan is informational until subscription payments are implemented. */}
          <aside className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-white">{l.landing.proPlan}</p>
              <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-300">
                {l.landing.comingSoon}
              </span>
            </div>
            <p className="mt-6 text-4xl font-bold text-white">
              {l.landing.proPrice}
              <span className="ml-1 text-base font-normal text-slate-400">
                {l.landing.perMonth}
              </span>
            </p>
            <p className="mt-4 leading-7 text-slate-300">
              {l.landing.proDescription}
            </p>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-800">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-slate-400 sm:px-6 lg:px-8">
          {l.landing.footer}
        </div>
      </footer>
    </div>
  );
}
