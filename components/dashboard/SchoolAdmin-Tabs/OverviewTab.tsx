'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface OverviewTabProps {
  teachers: any[];
  students: any[];
  classes: any[];
  isLoading: boolean;
}

export function OverviewTab({
  teachers,
  students,
  classes,
  isLoading,
}: OverviewTabProps) {
  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teachers?.length || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{students?.length || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{classes?.length || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
}
