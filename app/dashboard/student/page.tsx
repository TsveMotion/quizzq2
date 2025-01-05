'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
  </div>
);

const StudentDashboard = dynamic(
  () => import('@/components/dashboard/Student-Tabs/StudentDashboard'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function StudentPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (session?.user?.role?.toUpperCase() !== "STUDENT") {
    return redirect('/dashboard');
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <StudentDashboard />
    </Suspense>
  );
}
