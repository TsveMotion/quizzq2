'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MaintenanceBanner } from "@/components/MaintenanceBanner";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      console.log('Attempting sign in with:', { email });

      if (!email || !password) {
        toast({
          title: "Error",
          description: "Please provide both email and password",
          variant: "destructive",
        });
        return;
      }

      const result = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      console.log('Sign in result:', result);

      if (!result) {
        throw new Error("Authentication failed");
      }

      if (result.error) {
        toast({
          title: "Authentication Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // Get the session to determine user role
      const session = await fetch('/api/auth/session');
      const sessionData = await session.json();
      
      console.log('Session data:', sessionData);
      
      // Route based on user role
      let dashboardPath = '/dashboard';
      if (sessionData?.user?.role) {
        const role = sessionData.user.role.toLowerCase();
        switch (role) {
          case 'superadmin':
            dashboardPath = '/dashboard/superadmin';
            break;
          case 'schooladmin':
            dashboardPath = '/dashboard/schooladmin';
            break;
          case 'teacher':
            dashboardPath = '/dashboard/teacher';
            break;
          case 'student':
            dashboardPath = '/dashboard/student';
            break;
          default:
            console.log('Unknown role:', role);
            dashboardPath = '/dashboard';
        }
      }

      toast({
        title: "Success",
        description: "Successfully signed in",
        variant: "default",
      });

      console.log('Redirecting to:', dashboardPath);
      router.push(dashboardPath);
      router.refresh();
    } catch (error) {
      console.error('Sign-in error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
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
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your credentials to sign in
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
