'use client';

import { type FormEvent, useState } from 'react';

import { forgotPasswordSchema } from '@/lib/authValidation';
import l from '@/lib/en';

type ForgotPasswordResponse = {
  ok: boolean;
  message?: string;
  error?: string;
};

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = forgotPasswordSchema.safeParse({
      email: formData.get('email'),
    });

    if (!result.success) {
      setError(l.auth.invalidResetEmail);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const data = (await response.json()) as ForgotPasswordResponse;

      if (!response.ok) {
        setError(data.error ?? l.auth.passwordResetRequestFailed);
        return;
      }

      // The same message is shown whether or not the account exists.
      setMessage(data.message ?? l.auth.passwordResetRequestSuccess);
      form.reset();
    } catch {
      setError(l.auth.passwordResetRequestFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-200"
        >
          {l.auth.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-base text-slate-100 outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? l.auth.sendingResetLink : l.auth.sendResetLink}
      </button>

      {message ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200"
        >
          {message}
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
