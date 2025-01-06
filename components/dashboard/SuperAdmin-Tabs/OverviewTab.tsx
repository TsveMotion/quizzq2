'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, School, GraduationCap, BookOpen } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface School {
  id: string;
  name: string;
  _count?: {
    users: number;
  };
}

export function SuperAdminOverviewTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, schoolsResponse] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/schools')
        ]);

        if (!usersResponse.ok || !schoolsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [usersData, schoolsData] = await Promise.all([
          usersResponse.json(),
          schoolsResponse.json()
        ]);

        setUsers(usersData);
        setSchools(schoolsData);
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const studentCount = users.filter(user => user.role === 'student').length;
  const teacherCount = users.filter(user => user.role === 'teacher').length;
  const schoolCount = schools.length;
  const totalUsers = users.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Active platform users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentCount}</div>
          <p className="text-xs text-muted-foreground">
            Enrolled students
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Teachers</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teacherCount}</div>
          <p className="text-xs text-muted-foreground">
            Active teachers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Schools</CardTitle>
          <School className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{schoolCount}</div>
          <p className="text-xs text-muted-foreground">
            Registered schools
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
