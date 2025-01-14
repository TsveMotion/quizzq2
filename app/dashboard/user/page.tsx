'use client';

import { UserOverview } from "@/components/dashboard/user-tabs";

export default function UserDashboardPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <UserOverview />
    </div>
  );
}
