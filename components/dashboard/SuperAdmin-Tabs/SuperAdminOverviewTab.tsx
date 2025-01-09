'use client';

import { useState, useEffect } from 'react';
import { School, Users, GraduationCap, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { Line, Pie, ResponsiveContainer } from 'recharts';

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

export function SuperAdminOverviewTab() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 9,
    newUsersThisMonth: 2,
    totalSchools: 2,
    newSchoolsThisMonth: 2,
    totalStudents: 1,
    totalTeachers: 0,
    usersByMonth: [
      { month: "2025-01", count: 9 }
    ],
    usersByRole: [
      { role: "SUPERADMIN", count: 1 },
      { role: "SCHOOLADMIN", count: 2 },
      { role: "FREE", count: 1 },
      { role: "STUDENT", count: 1 },
      { role: "TEACHER", count: 0 }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/stats/overview');
        
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 503) {
            throw new Error('Database connection failed. Please try again later.');
          }
          throw new Error(errorData.error || 'Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch stats');
        
        // Auto-retry up to 3 times with exponential backoff if it's a database connection error
        if (error instanceof Error && error.message.includes('Database connection failed') && retryCount < 3) {
          const timeout = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, timeout);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [retryCount]); // Add retryCount as dependency

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="h-full space-y-6">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-sm text-blue-200">Loading statistics...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-500">{error}</p>
              <button
                onClick={handleRetry}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative overflow-hidden rounded-lg border border-blue-200/10 bg-blue-950/50 p-6 backdrop-blur-xl">
              <div className="space-y-2">
                <Users className="h-6 w-6 text-blue-400" />
                <p className="text-2xl font-bold text-blue-50">{stats.totalUsers}</p>
                <p className="text-sm text-blue-200">Total Users</p>
              </div>
              <div className="absolute bottom-1 right-1 text-sm text-blue-300">
                +{stats.newUsersThisMonth} this month
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-blue-200/10 bg-blue-950/50 p-6 backdrop-blur-xl">
              <div className="space-y-2">
                <School className="h-6 w-6 text-blue-400" />
                <p className="text-2xl font-bold text-blue-50">{stats.totalSchools}</p>
                <p className="text-sm text-blue-200">Total Schools</p>
              </div>
              <div className="absolute bottom-1 right-1 text-sm text-blue-300">
                +{stats.newSchoolsThisMonth} this month
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-blue-200/10 bg-blue-950/50 p-6 backdrop-blur-xl">
              <div className="space-y-2">
                <GraduationCap className="h-6 w-6 text-blue-400" />
                <p className="text-2xl font-bold text-blue-50">{stats.totalStudents}</p>
                <p className="text-sm text-blue-200">Total Students</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-blue-200/10 bg-blue-950/50 p-6 backdrop-blur-xl">
              <div className="space-y-2">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <p className="text-2xl font-bold text-blue-50">{stats.totalTeachers}</p>
                <p className="text-sm text-blue-200">Total Teachers</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* User Growth Chart */}
            <div className="min-h-[400px] rounded-lg border border-blue-200/10 bg-blue-950/50 p-6 backdrop-blur-xl">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-blue-50">User Growth</h3>
                <p className="text-sm text-blue-200">User registrations over time</p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <Line
                    data={stats.usersByMonth}
                    dataKey="count"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    dot={false}
                  />
                </ResponsiveContainer>
              </div>
            </div>

            {/* Users by Role Chart */}
            <div className="min-h-[400px] rounded-lg border border-blue-200/10 bg-blue-950/50 p-6 backdrop-blur-xl">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-blue-50">Users by Role</h3>
                <p className="text-sm text-blue-200">Distribution of users across roles</p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <Pie
                    data={stats.usersByRole}
                    dataKey="count"
                    nameKey="role"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#60A5FA"
                    label
                  />
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
