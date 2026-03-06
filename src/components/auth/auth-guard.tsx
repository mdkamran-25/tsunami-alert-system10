'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

/**
 * Simple JWT-based auth guard.
 * Checks localStorage for 'authToken'. If present → render children.
 * If absent → redirect to sign-in page.
 * No Firebase dependency — keeps it fast and race-condition-free.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setStatus(token ? 'authenticated' : 'unauthenticated');
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    // Use window.location for a hard redirect so the signin page gets a clean mount
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
    return null;
  }

  return <>{children}</>;
}

// Convenience wrappers (roles not enforced client-side; backend validates)
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

export function OperatorGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

export function ViewerGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
