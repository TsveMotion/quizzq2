'use client';

import { UserLayout } from "@/components/dashboard/user-tabs";
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

  return <UserLayout>{children}</UserLayout>;
}
