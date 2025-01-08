'use client';

import { Card } from "@/components/ui/card";

export function UserQuizzesTab() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Quizzes</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Available Quizzes</h3>
          {/* Add quiz list */}
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Completed Quizzes</h3>
          {/* Add completed quizzes */}
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-2">Quiz Performance</h3>
          {/* Add performance metrics */}
        </Card>
      </div>
    </div>
  );
}
