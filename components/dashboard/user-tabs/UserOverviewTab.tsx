'use client';

import { Card } from "@/components/ui/card";

export function UserOverviewTab() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
          {/* Add recent activity content */}
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Progress</h3>
          {/* Add progress content */}
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Stats</h3>
          {/* Add stats content */}
        </Card>
      </div>
    </div>
  );
}
