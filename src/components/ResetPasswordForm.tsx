'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { resetPasswordFormSchema } from '@/lib/authValidation';
import l from '@/lib/en';

type ResetPasswordResponse = {
  ok: boolean;
  error?: string;
};

type ResetPasswordFormProps = {
  token?: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = resetPasswordFormSchema.safeParse({
      token,
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!result.success) {
      setError(l.auth.invalidPasswordResetLink);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // confirmPassword is checked locally and never sent to the API.
        body: JSON.stringify({
          token: result.data.token,
          password: result.data.password,
        }),
      });
      const data = (await response.json()) as ResetPasswordResponse;

      if (!response.ok) {
        setError(data.error ?? l.auth.passwordResetFailed);
        return;
      }

      setIsComplete(true);
    } catch {
      setError(l.auth.passwordResetFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200"
      >
        {l.auth.invalidPasswordResetLink}
      </p>
    );
  }

  if (isComplete) {
    return (
      <div className="space-y-5">
        <p
          role="status"
          className="rounded-lg border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200"
        >
          {l.auth.passwordResetSuccess}
        </p>
        <Link
          href="/sign-in"
          className="flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          {l.auth.continueToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-200"
        >
          {l.auth.newPassword}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-base text-slate-100 outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-semibold text-slate-200"
        >
          {l.auth.confirmNewPassword}
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-base text-slate-100 outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? l.auth.resettingPassword : l.auth.resetPasswordButton}
      </button>

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
