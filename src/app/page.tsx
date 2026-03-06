'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasFirebaseConfig } from '@/lib/firebase';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in (JWT), send them straight to dashboard
    const token = localStorage.getItem('authToken');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  // Always render the same landing page on server AND client (no hydration mismatch)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-tsunami-blue-50 via-white to-tsunami-green-50 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 shadow-lg">
          <span className="text-3xl">🌊</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 bg-clip-text text-transparent">
            Tsunami Early Warning System
          </h1>
          <p className="text-muted-foreground">Real-time monitoring and early warning</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full rounded-md bg-tsunami-blue-600 px-4 py-3 text-center text-white font-medium hover:bg-tsunami-blue-700 transition-colors"
          >
            🔐 Sign In
          </Link>

          <Link
            href="/auth/signup"
            className="block w-full rounded-md border border-tsunami-green-600 px-4 py-3 text-center text-tsunami-green-600 font-medium hover:bg-tsunami-green-50 transition-colors"
          >
            📝 Sign Up
          </Link>

          <Link
            href="/dashboard"
            className="block w-full rounded-md border border-gray-300 px-4 py-3 text-center text-gray-600 font-medium hover:bg-gray-50 transition-colors"
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
