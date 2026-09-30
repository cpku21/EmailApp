import type { Metadata } from 'next';
import Link from 'next/link';

import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import l from '@/lib/en';

export const metadata: Metadata = {
  title: l.auth.forgotPasswordMetadataTitle,
  description: l.auth.forgotPasswordMetadataDescription,
};

// Password recovery stays public so users can regain access without a session.
export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="mb-8 inline-block text-lg font-bold tracking-tight text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          {l.auth.appName}
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          {l.auth.forgotPasswordTitle}
        </h1>
        <p className="mb-8 mt-3 leading-7 text-slate-300">
          {l.auth.forgotPasswordDescription}
        </p>

        <ForgotPasswordForm />

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link
            href="/sign-in"
            className="font-semibold text-blue-400 hover:text-blue-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {l.auth.continueToSignIn}
          </Link>
        </p>
      </section>
    </main>
  );
}
