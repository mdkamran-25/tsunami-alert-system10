'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500">
              <ShieldX className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-base">
              You don&apos;t have permission to access this resource
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {user ? (
                  <>
                    You are signed in as <strong>{user.name || user.email}</strong>
                    {user.role && (
                      <>
                        {' '}
                        with <strong>{user.role}</strong> role
                      </>
                    )}
                    , but you don&apos;t have the required permissions to view this page.
                  </>
                ) : (
                  'Please sign in to access this resource.'
                )}
              </p>

              {user && (
                <p className="text-xs text-muted-foreground">
                  Contact your administrator if you believe this is an error.
                </p>
              )}
            </div>

            <div className="space-y-3">
              {!user ? (
                <Link href="/auth/signin">
                  <Button className="w-full">Sign In</Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              )}

              <Button variant="outline" onClick={handleGoBack} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            {user && (
              <div className="border-t pt-4">
                <p className="mb-2 text-xs text-muted-foreground">Need different access?</p>
                <Link href="/contact">
                  <Button variant="ghost" size="sm">
                    Contact Support
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Tsunami Early Warning System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
