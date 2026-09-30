'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import l from '@/lib/en';

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setIsSubmitting(true);
    setError(null);

    try {
      // Logout clears the server session before returning to the public landing page.
      const response = await fetch('/api/auth/logout', { method: 'POST' });

      if (!response.ok) {
        setError(l.auth.logoutFailed);
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setError(l.auth.logoutFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isSubmitting}
        className="h-11 shrink-0 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? l.auth.signingOut : l.auth.signOut}
      </button>
      {error ? (
        <span role="alert" className="text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}
