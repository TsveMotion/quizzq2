import { Metadata } from 'next';
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

export default function SignupPage() {
  return (
    <div className="w-full max-w-md p-6">
      <AuthForm defaultTab="signup" />
    </div>
  );
}
