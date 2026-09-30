'use client';

import { useState } from 'react';

import l from '@/lib/en';

type ResendResponse = {
  ok: boolean;
  error?: string;
  message?: string;
};

export default function ResendVerificationButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<ResendResponse | null>(null);

  async function handleResend() {
    setIsSubmitting(true);
    setStatus(null);

    try {
      // The server identifies the account from the protected session cookie.
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      });
      const data = (await response.json()) as ResendResponse;

      setStatus({
        ok: response.ok,
        message: data.message,
        error: data.error,
      });
    } catch {
      setStatus({ ok: false, error: l.auth.verificationResendFailed });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleResend}
        disabled={isSubmitting}
        className="h-11 w-full rounded-lg bg-amber-500 px-5 text-sm font-semibold text-slate-950 hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? l.auth.resendingVerification
          : l.auth.resendVerification}
      </button>

      {status ? (
        <p
          role={status.ok ? 'status' : 'alert'}
          className={
            status.ok
              ? 'mt-4 rounded-lg border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200'
              : 'mt-4 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200'
          }
        >
          {status.ok
            ? (status.message ?? l.auth.verificationResendSuccess)
            : (status.error ?? l.auth.verificationResendFailed)}
        </p>
      ) : null}
    </div>
  );
}
