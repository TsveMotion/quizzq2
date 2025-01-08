'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from 'next/link';
import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Sign in the user automatically
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Failed to sign in after registration');
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Redirecting to dashboard...",
      });

      router.push('/dashboard/free');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <MaintenanceBanner />
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto w-full max-w-md space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your details to create your account
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="name"
                name="name"
                placeholder="Full Name"
                required
                type="text"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="email"
                name="email"
                placeholder="Email"
                required
                type="email"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                placeholder="Password"
                required
                type="password"
                disabled={isLoading}
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
