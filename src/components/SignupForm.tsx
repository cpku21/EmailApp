'use client';

import { type FormEvent, useState } from 'react';

import { signupFormSchema } from '@/lib/authValidation';
import l from '@/lib/en';

type FormStatus = {
  type: 'error' | 'success';
  message: string;
};

type SignupResponse = {
  ok: boolean;
  error?: string;
  message?: string;
};

export default function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = signupFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!result.success) {
      const passwordsDoNotMatch = result.error.issues.some(
        (issue) => issue.path[0] === 'confirmPassword',
      );

      setStatus({
        type: 'error',
        message: passwordsDoNotMatch
          ? l.auth.passwordsDoNotMatch
          : l.auth.invalidSignupDetails,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: result.data.email,
          password: result.data.password,
        }),
      });
      const data = (await response.json()) as SignupResponse;

      if (!response.ok) {
        setStatus({
          type: 'error',
          message: data.error ?? l.auth.signupFailed,
        });
        return;
      }

      form.reset();
      setStatus({
        type: 'success',
        message: data.message ?? l.auth.signupSuccess,
      });
    } catch {
      setStatus({ type: 'error', message: l.auth.signupFailed });
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

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-200"
        >
          {l.auth.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          aria-describedby="password-hint"
          className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-base text-slate-100 outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        />
        <p id="password-hint" className="mt-2 text-sm text-slate-400">
          {l.auth.passwordHint}
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-semibold text-slate-200"
        >
          {l.auth.confirmPassword}
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
        {isSubmitting ? l.auth.creatingAccount : l.auth.createAccount}
      </button>

      {status ? (
        <p
          role={status.type === 'error' ? 'alert' : 'status'}
          className={
            status.type === 'error'
              ? 'rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200'
              : 'rounded-lg border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200'
          }
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
