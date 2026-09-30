'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { loginSchema } from '@/lib/authValidation';
import l from '@/lib/en';

type LoginResponse = {
  ok: boolean;
  error?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!result.success) {
      setError(l.auth.invalidCredentials);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setError(data.error ?? l.auth.loginFailed);
        return;
      }

      // Refreshing after navigation lets Server Components read the new cookie.
      router.replace('/directory');
      router.refresh();
    } catch {
      setError(l.auth.loginFailed);
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
          autoComplete="current-password"
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
        {isSubmitting ? l.auth.signingIn : l.auth.signIn}
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
