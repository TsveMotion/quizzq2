'use client';

import { useState, useEffect } from "react";
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

interface Stats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalSchools: number;
  newSchoolsThisMonth: number;
  totalStudents: number;
  totalTeachers: number;
  usersByMonth: Array<{
    month: string;
    count: number;
  }>;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
}

const ROLE_COLORS = {
  SUPERADMIN: '#60A5FA',
  SCHOOLADMIN: '#34D399',
  STUDENT: '#FBBF24',
  TEACHER: '#F87171',
  FREE: '#A78BFA'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function OverviewTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalSchools: 0,
    newSchoolsThisMonth: 0,
    totalStudents: 0,
    totalTeachers: 0,
    usersByMonth: [],
    usersByRole: []
  });
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

  useEffect(() => {
    if (users.length && schools.length) {
      const studentCount = users.filter(user => user.role.toLowerCase() === 'student').length;
      const teacherCount = users.filter(user => user.role.toLowerCase() === 'teacher').length;
      const schoolAdminCount = users.filter(user => user.role.toLowerCase() === 'schooladmin').length;
      const superAdminCount = users.filter(user => user.role.toLowerCase() === 'superadmin').length;
      const schoolCount = schools.length;
      const totalUsers = users.length;

      const usersByRole = [
        { role: 'SUPERADMIN', count: superAdminCount },
        { role: 'SCHOOLADMIN', count: schoolAdminCount },
        { role: 'STUDENT', count: studentCount },
        { role: 'TEACHER', count: teacherCount },
      ].filter(item => item.count > 0);

      const usersByMonth = processUserGrowthData(users);

      setStats({
        totalUsers,
        newUsersThisMonth: 0, // Not implemented
        totalSchools: schoolCount,
        newSchoolsThisMonth: 0, // Not implemented
        totalStudents: studentCount,
        totalTeachers: teacherCount,
        usersByMonth,
        usersByRole
      });
    }
  }, [users, schools]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center space-x-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-sm text-blue-200">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-800/40 bg-[#0f2850] p-6 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300">
          <div className="space-y-2">
            <Users className="h-6 w-6 text-blue-400" />
            <p className="text-2xl font-bold text-blue-50">{stats.totalUsers}</p>
            <p className="text-sm text-blue-200">Total Users</p>
          </div>
          <div className="mt-2 text-sm text-blue-300">
            +{stats.newUsersThisMonth} this month
          </div>
        </div>

        <div className="rounded-2xl border border-blue-800/40 bg-[#0f2850] p-6 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300">
          <div className="space-y-2">
            <School className="h-6 w-6 text-blue-400" />
            <p className="text-2xl font-bold text-blue-50">{stats.totalSchools}</p>
            <p className="text-sm text-blue-200">Total Schools</p>
          </div>
          <div className="mt-2 text-sm text-blue-300">
            +{stats.newSchoolsThisMonth} this month
          </div>
        </div>

        <div className="rounded-2xl border border-blue-800/40 bg-[#0f2850] p-6 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300">
          <div className="space-y-2">
            <GraduationCap className="h-6 w-6 text-blue-400" />
            <p className="text-2xl font-bold text-blue-50">{stats.totalStudents}</p>
            <p className="text-sm text-blue-200">Total Students</p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-800/40 bg-[#0f2850] p-6 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300">
          <div className="space-y-2">
            <BookOpen className="h-6 w-6 text-blue-400" />
            <p className="text-2xl font-bold text-blue-50">{stats.totalTeachers}</p>
            <p className="text-sm text-blue-200">Total Teachers</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-2xl border border-blue-800/40 bg-[#0f2850] p-6 shadow-lg shadow-blue-900/20">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-blue-50">User Growth</h3>
            <p className="text-sm text-blue-200">User registrations over time</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.usersByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f2850',
                    border: '1px solid #1e3a8a',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Users" 
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', stroke: '#3b82f6', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users by Role Chart */}
        <div className="rounded-2xl border border-blue-800/40 bg-[#0f2850] p-6 shadow-lg shadow-blue-900/20">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-blue-50">Users by Role</h3>
            <p className="text-sm text-blue-200">Distribution of users across roles</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.usersByRole}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label={(entry) => entry.role}
                >
                  {stats.usersByRole.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={ROLE_COLORS[entry.role as keyof typeof ROLE_COLORS] || '#94a3b8'} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f2850',
                    border: '1px solid #1e3a8a',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
                  formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
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
      month: month.toISOString().slice(0, 7),
      count
    };
  });
}
