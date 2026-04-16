'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { authDebug, debugEnvironment, debugStorage } from '@/lib/auth-debug';

// GraphQL mutation for login
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
      expiresIn
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@tsunami.local');
  const [password, setPassword] = useState('admin123');
  const { toast } = useToast();

  const [login] = useMutation(LOGIN_MUTATION);

  // Initialize debug on mount
  useEffect(() => {
    authDebug.info('PAGE', 'SignIn Page Mounted');
    debugEnvironment();
    debugStorage();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    authDebug.info('AUTH', 'Login attempt started', { email });

    try {
      authDebug.info('AUTH', 'Calling GraphQL login mutation...');
      const { data, errors } = await login({
        variables: {
          email: email.trim(),
          password,
        },
      });

      authDebug.info('AUTH', 'GraphQL response received', { hasData: !!data, hasErrors: !!errors });

      if (errors) {
        const errorMsg = errors.map((e: any) => e.message).join(', ');
        authDebug.error('AUTH', 'GraphQL errors', { errors: errorMsg });
        throw new Error(errorMsg);
      }

      if (data?.login?.token) {
        authDebug.success('AUTH', 'Login successful, storing tokens');
        localStorage.setItem('authToken', data.login.token);
        localStorage.setItem('refreshToken', data.login.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.login.user));

        authDebug.success('AUTH', 'Tokens stored, redirecting to dashboard', {
          user: data.login.user.email,
          role: data.login.user.role,
        });

        toast({
          title: 'Welcome back!',
          description: `Signed in as ${data.login.user.email}`,
        });

        // Hard redirect so AuthGuard reads the fresh JWT on a clean page load
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      } else {
        authDebug.error('AUTH', 'No token in response', { data });
        throw new Error('No authentication token received');
      }
    } catch (err: any) {
      authDebug.error('AUTH', 'Login failed', {
        errorType: err.constructor.name,
        message: err.message,
        graphQLErrors: err?.graphQLErrors?.map((e: any) => e.message),
        networkError: err?.networkError
          ? {
              message: err.networkError.message,
              statusCode: err.networkError.statusCode,
            }
          : null,
      });

      let message = 'Invalid email or password';

      // Network/connection error
      if (err.networkError?.statusCode === 0 || err.networkError?.message?.includes('fetch')) {
        message = 'Cannot connect to backend. Check if server is running at http://localhost:4000';
        authDebug.error('AUTH', 'Network connection failed', { message });
      }
      // GraphQL error
      else if (err?.graphQLErrors?.[0]?.message) {
        message = err.graphQLErrors[0].message;
      }
      // Other errors
      else if (err.message) {
        message = err.message;
      }

      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-tsunami-blue-50 via-white to-tsunami-green-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500">
              <span className="text-2xl">🌊</span>
            </div>
            <CardTitle className="bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 bg-clip-text text-2xl font-bold text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to access the Tsunami Early Warning System
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-tsunami-blue-600 hover:text-tsunami-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 text-base font-medium text-white hover:from-tsunami-blue-700 hover:to-tsunami-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
              Demo credentials (pre-filled):
              <div className="mt-2 font-mono">
                Email: admin@tsunami.local
                <br />
                Password: admin123
              </div>
            </div>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium text-tsunami-blue-600 hover:text-tsunami-blue-500"
                >
                  Sign up
                </Link>
              </span>
            </div>

            <div className="border-t pt-4">
              <details className="cursor-pointer">
                <summary className="text-xs font-semibold text-muted-foreground">
                  🔐 Debug Info (Click to expand)
                </summary>
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <div>Backend: {process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}</div>
                  <div>WebSocket: {process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT}</div>
                  <button
                    type="button"
                    onClick={() => {
                      const logs = (window as any).__authDebugLogs || [];
                      console.table(logs);
                    }}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    View Console Logs
                  </button>
                </div>
              </details>
            </div>
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
