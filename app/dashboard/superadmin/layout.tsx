'use client';

import { SuperAdminLayout } from "@/components/dashboard/SuperAdmin-Tabs/superadmin-layout";

export default function SuperAdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}
