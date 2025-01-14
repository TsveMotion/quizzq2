'use client';

import { UserLayout } from "@/components/dashboard/user-tabs";
import UserNavbar from "@/components/dashboard/user-tabs/user-navbar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/signin");
  }

  return (
    <UserLayout>
      <div className="relative min-h-screen bg-[#1a237e]">
        <UserNavbar initialSession={null} />
        <main className="px-4 pt-24 min-h-screen">
          {children}
        </main>
      </div>
    </UserLayout>
  );
}
