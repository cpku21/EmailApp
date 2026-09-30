'use client';

import Link from 'next/link';
import { useState } from 'react';

import l from '@/lib/en';

type VerifyEmailFormProps = {
  token?: string;
};

type VerificationResponse = {
  ok: boolean;
  error?: string;
  message?: string;
};

export default function VerifyEmailForm({ token }: VerifyEmailFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  async function verifyEmail() {
    if (!token) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = (await response.json()) as VerificationResponse;

      if (!response.ok) {
        setMessage(data.error ?? l.auth.verificationFailed);
        return;
      }

      setIsSuccess(true);
      setMessage(data.message ?? l.auth.verificationSuccess);
    } catch {
      setMessage(l.auth.verificationFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      {token && !isSuccess ? (
        <button
          type="button"
          onClick={verifyEmail}
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? l.auth.verifying : l.auth.verifyButton}
        </button>
      ) : null}

      {!token ? (
        <p
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200"
        >
          {l.auth.invalidVerificationLink}
        </p>
      ) : null}

      {message ? (
        <p
          role={isSuccess ? 'status' : 'alert'}
          className={
            isSuccess
              ? 'rounded-lg border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200'
              : 'rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200'
          }
        >
          {message}
        </p>
      ) : null}

      {/* Successful verification continues directly into the login flow. */}
      <Link
        href={isSuccess ? '/sign-in' : '/'}
        className="block text-center text-sm font-semibold text-blue-400 underline decoration-blue-700 underline-offset-4 hover:text-blue-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        {isSuccess ? l.auth.continueToSignIn : l.auth.backHome}
      </Link>
    </div>
  );
}
