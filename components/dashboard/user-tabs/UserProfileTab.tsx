'use client';

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export function UserProfileTab() {
  const { data: session } = useSession();

  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="space-y-2">
            <p><strong>Name:</strong> {session?.user?.name}</p>
            <p><strong>Email:</strong> {session?.user?.email}</p>
            <p><strong>Account Type:</strong> {session?.user?.isPro ? 'Pro' : 'Free'}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
          {/* Add account settings form */}
        </Card>
      </div>
    </div>
  );
}
