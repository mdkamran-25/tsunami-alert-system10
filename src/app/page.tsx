'use client';

import { useEffect } from 'react';
import { hasFirebaseConfig } from '@/lib/firebase';
import Link from 'next/link';

export default function HomePage() {
  useEffect(() => {
    // If user is already logged in (JWT), send them straight to dashboard
    const token = localStorage.getItem('authToken');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  // Always render the same landing page on server AND client (no hydration mismatch)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-tsunami-blue-50 via-white to-tsunami-green-50 p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 shadow-lg">
          <span className="text-3xl">🌊</span>
        </div>

        <div className="space-y-2">
          <h1 className="bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 bg-clip-text text-2xl font-bold text-transparent">
            Tsunami Early Warning System
          </h1>
          <p className="text-muted-foreground">Real-time monitoring and early warning</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full rounded-md bg-tsunami-blue-600 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-tsunami-blue-700"
          >
            🔐 Sign In
          </Link>

          <Link
            href="/auth/signup"
            className="block w-full rounded-md border border-tsunami-green-600 px-4 py-3 text-center font-medium text-tsunami-green-600 transition-colors hover:bg-tsunami-green-50"
          >
            📝 Sign Up
          </Link>

          <Link
            href="/dashboard"
            className="block w-full rounded-md border border-gray-300 px-4 py-3 text-center font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            🏠 Go to Dashboard
          </Link>
        </div>

        {!hasFirebaseConfig && (
          <p className="text-xs text-muted-foreground">Running in demo mode</p>
        )}
      </div>
    </div>
  );
}
