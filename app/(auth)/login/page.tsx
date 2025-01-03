import { Metadata } from 'next';
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <AuthForm defaultTab="login" />
      </div>
    </div>
  );
}
