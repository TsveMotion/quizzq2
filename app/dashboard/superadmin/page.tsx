'use client';

import { Suspense } from "react";
import { Overview } from "@/components/dashboard/SuperAdmin-Tabs/overview";

function LoadingOverview() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
    </div>
  );
}

export default function SuperAdminPage() {
  return (
    <div className="min-h-screen bg-[#1a237e]">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">SuperAdmin Dashboard</h2>
        </div>
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-8">
          <Suspense fallback={<LoadingOverview />}>
            <Overview />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
