'use client';

import { Suspense } from 'react';
import SuperAdminDashboard from '@/components/dashboard/SuperAdmin-Tabs/SuperAdminDashboard';

export default function SuperAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <div className="min-h-screen bg-background">
        <SuperAdminDashboard />
      </div>
    </Suspense>
  );
}
