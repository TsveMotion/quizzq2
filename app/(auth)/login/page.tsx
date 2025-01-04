import { Metadata } from 'next';
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md p-6">
      <AuthForm defaultTab="login" />
    </div>
  );
}
