'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// GraphQL mutation for signup
const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
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

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const [signup] = useMutation(SIGNUP_MUTATION);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation error',
        description: 'Please enter your full name.',
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Validation error',
        description: 'Passwords do not match.',
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Validation error',
        description: 'Password must be at least 6 characters.',
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await signup({
        variables: {
          email,
          password,
          name,
        },
      });

      if (data?.signup?.token) {
        localStorage.setItem('authToken', data.signup.token);
        localStorage.setItem('refreshToken', data.signup.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.signup.user));
        toast({
          title: 'Account created!',
          description: `Welcome, ${data.signup.user.name || data.signup.user.email}!`,
        });
        // Hard redirect so AuthGuard reads the fresh JWT on a clean page load
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      const message =
        err?.graphQLErrors?.[0]?.message ||
        err.message ||
        'Failed to create account. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
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
          <CardHeader className="space-y-4 pb-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-tsunami-blue-500 to-tsunami-green-500 shadow-lg">
              <span className="text-3xl">🌊</span>
            </div>
            <CardTitle className="bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 bg-clip-text text-2xl font-bold text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Join the Tsunami Early Warning System
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 text-base"
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full bg-gradient-to-r from-tsunami-blue-600 to-tsunami-green-600 text-base transition-all duration-200 hover:from-tsunami-blue-700 hover:to-tsunami-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-tsunami-blue-600 transition-colors hover:text-tsunami-blue-700"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
