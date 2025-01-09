'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from 'next/link';
import { MaintenanceBanner } from "@/components/MaintenanceBanner";
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Brain, ArrowRight } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block p-4 rounded-2xl bg-white/5 backdrop-blur-lg mb-4"
            >
              <Brain className="w-12 h-12 text-blue-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to QuizzQ</h1>
            <p className="text-blue-200 text-sm">Join our community of learners and educators</p>
          </div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10"
          >
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-200">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    type="text"
                    disabled={isLoading}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-200">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <Input
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    type="email"
                    disabled={isLoading}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-200">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    disabled={isLoading}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Creating Account...'
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Sign In Link */}
              <div className="text-center text-sm text-blue-200">
                Already have an account?{' '}
                <Link href="/signin" className="text-blue-400 hover:text-blue-300 hover:underline">
                  Sign In
                </Link>
              </div>
            </form>

            {/* Features List */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-white font-medium mb-4">What you&apos;ll get</h3>
              <motion.ul className="space-y-3">
                {[
                  'Create and take unlimited quizzes',
                  'Track your learning progress',
                  'Join study groups',
                  'Access premium study materials',
                  'Earn certificates'
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-blue-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
