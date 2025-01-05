'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StudentOverviewTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs text-muted-foreground">
            +5.2% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">
            +8 from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5th</div>
          <p className="text-xs text-muted-foreground">
            Up 2 positions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12h</div>
          <p className="text-xs text-muted-foreground">
            +2h from last week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
