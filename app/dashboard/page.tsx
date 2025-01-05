'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { roleToDashboard } from "@/lib/routes";

const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
  </div>
);

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const userRole = session?.user?.role?.toUpperCase();
  if (!userRole || !(userRole in roleToDashboard)) {
    return redirect('/signin');
  }

  return redirect(roleToDashboard[userRole as keyof typeof roleToDashboard]);
}
