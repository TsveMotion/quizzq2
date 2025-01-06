'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, School, GraduationCap, BookOpen } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  schoolId: string | null;
}

interface School {
  id: string;
  name: string;
  users: User[];
  _count: {
    users: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function SuperAdminOverviewTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch users and schools in parallel
        const [usersResponse, schoolsResponse] = await Promise.all([
          fetch('/api/admin/users', {
            credentials: 'include',
            headers: {
              'Cache-Control': 'no-cache'
            }
          }),
          fetch('/api/admin/schools', {
            credentials: 'include',
            headers: {
              'Cache-Control': 'no-cache'
            }
          })
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
        setError('Failed to load dashboard data');
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const studentCount = users.filter(user => user.role.toLowerCase() === 'student').length;
  const teacherCount = users.filter(user => user.role.toLowerCase() === 'teacher').length;
  const schoolAdminCount = users.filter(user => user.role.toLowerCase() === 'schooladmin').length;
  const superAdminCount = users.filter(user => user.role.toLowerCase() === 'superadmin').length;
  const schoolCount = schools.length;
  const totalUsers = users.length;

  // Prepare data for pie chart
  const userDistributionData = [
    { name: 'Students', value: studentCount },
    { name: 'Teachers', value: teacherCount },
    { name: 'School Admins', value: schoolAdminCount },
    { name: 'Super Admins', value: superAdminCount },
  ].filter(item => item.value > 0); // Only show roles that have users

  // Prepare data for line chart
  const userGrowthData = processUserGrowthData(users);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Welcome to your dashboard overview
        </p>
      </div>

      {/* Statistics cards */}
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

      {/* Charts section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Line chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userGrowthData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Total Users"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to process user growth data
function processUserGrowthData(users: User[]) {
  if (!users.length) return [];

  // Sort users by creation date
  const sortedUsers = [...users].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Get the date range
  const startDate = new Date(sortedUsers[0].createdAt);
  const endDate = new Date();
  const months: Date[] = [];

  // Generate array of months between start and end date
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Count cumulative users for each month
  return months.map(month => {
    const count = sortedUsers.filter(user => 
      new Date(user.createdAt) <= month
    ).length;

    return {
      date: month.toISOString(),
      count
    };
  });
}

export default SuperAdminOverviewTab;
