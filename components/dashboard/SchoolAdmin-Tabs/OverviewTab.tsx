'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: string;
}

interface Class {
  id: string;
  name: string;
}

interface SchoolAdminOverviewTabProps {
  teachers: User[];
  students: User[];
  classes: Class[];
  isLoading: boolean;
}

export function OverviewTab({ 
  teachers, 
  students, 
  classes,
  isLoading 
}: SchoolAdminOverviewTabProps) {
  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teachers.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{students.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{classes.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Students per Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {classes.length > 0 ? Math.round(students.length / classes.length) : 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
