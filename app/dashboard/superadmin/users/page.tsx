'use client';

import { UserManagement } from "@/components/dashboard/SuperAdmin-Tabs/user-management";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-[#1a237e]">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">User Management</h2>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-8">
          <UserManagement />
        </div>
      </div>
    </div>
  );
}
