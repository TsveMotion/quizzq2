import { Metadata } from 'next';
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <AuthForm defaultTab="signup" />
      </div>
    </div>
  );
}
