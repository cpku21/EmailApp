import type { Metadata } from 'next';
import Link from 'next/link';

import ResetPasswordForm from '@/components/ResetPasswordForm';
import l from '@/lib/en';

export const metadata: Metadata = {
  title: l.auth.resetPasswordMetadataTitle,
  description: l.auth.resetPasswordMetadataDescription,
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

// Token validation remains in the API; this page only forwards the URL value.
export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

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
          {l.auth.resetPasswordTitle}
        </h1>
        <p className="mb-8 mt-3 leading-7 text-slate-300">
          {l.auth.resetPasswordDescription}
        </p>

        <ResetPasswordForm
          token={typeof token === 'string' ? token : undefined}
        />
      </section>
    </main>
  );
}
