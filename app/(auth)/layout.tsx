import { Metadata } from 'next';
import { ModeToggle } from "@/components/mode-toggle";

export const metadata: Metadata = {
  title: {
    default: 'Authentication - QUIZZQ',
    template: '%s - QUIZZQ',
  },
  description: 'Authentication pages for QUIZZQ - Sign in or create an account.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
