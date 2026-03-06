'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { hasFirebaseConfig } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requiredRoles = [],
  redirectTo = '/auth/signin',
}: AuthGuardProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [jwtAuthenticated, setJwtAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for our own JWT token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    setJwtAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // JWT-authenticated users always get access
    if (jwtAuthenticated) return;

    // If Firebase is not configured, allow access (demo mode)
    if (!hasFirebaseConfig) {
      console.warn('🔥 Firebase not configured, allowing access in demo mode');
      return;
    }

    if (!loading || loadingTimeout) {
      if (!user && jwtAuthenticated === false) {
        router.replace(redirectTo);
        return;
      }

      if (requiredRoles.length > 0 && userProfile) {
        const hasRequiredRole = requiredRoles.includes(userProfile.role);
        if (!hasRequiredRole) {
          router.replace('/auth/unauthorized');
          return;
        }
      }
    }
  }, [
    user,
    userProfile,
    loading,
    loadingTimeout,
    jwtAuthenticated,
    router,
    requiredRoles,
    redirectTo,
  ]);

  // Still determining JWT state
  if (jwtAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // JWT token present — render children directly
  if (jwtAuthenticated) {
    return <>{children}</>;
  }

  // If Firebase is not configured, render children directly (demo mode)
  if (!hasFirebaseConfig) {
    return <>{children}</>;
  }

  // Show loading while checking Firebase authentication
  if (loading && !loadingTimeout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated via Firebase either
  if (!user) {
    return null;
  }

  // Role check
  if (requiredRoles.length > 0 && userProfile && !requiredRoles.includes(userProfile.role)) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRoles={['ADMIN']}>{children}</AuthGuard>;
}

export function OperatorGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRoles={['ADMIN', 'OPERATOR']}>{children}</AuthGuard>;
}

export function ViewerGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRoles={['ADMIN', 'OPERATOR', 'VIEWER']}>{children}</AuthGuard>;
}
