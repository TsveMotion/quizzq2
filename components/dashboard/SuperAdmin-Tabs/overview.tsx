'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSession } from "next-auth/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatsData {
  totalUsers: number;
  totalSubscriptions: number;
  activeSchools: number;
  systemHealth: string;
  revenueData: number[];
  newUsers: { name: string; email: string; date: string }[];
}

export function Overview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalSubscriptions: 0,
    activeSchools: 0,
    systemHealth: "99.9%",
    revenueData: [2500, 2850, 2300, 3800, 3200, 1900],
    newUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Current session:", session);
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized - Please make sure you are logged in as an admin');
          }
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: stats.revenueData,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-15rem)]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-15rem)]">
        <div className="text-white text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p className="text-white/70">{error}</p>
          <p className="text-sm text-white/50 mt-2">Current role: {session?.user?.role || 'Not logged in'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-white/70">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-white/70">+0 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pro Subscriptions</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-white/70">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalSubscriptions}</div>
            <p className="text-xs text-white/70">+0 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Schools</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-white/70">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeSchools}</div>
            <p className="text-xs text-white/70">+0 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">System Health</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-white/70">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.systemHealth}</div>
            <p className="text-xs text-white/70">+0.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={chartData} options={chartOptions} className="w-full" />
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.newUsers.length > 0 ? (
                stats.newUsers.map((user, i) => (
                  <div key={i} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                      <p className="text-sm text-white/70">{user.email}</p>
                      <p className="text-xs text-white/50">{user.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/70">No recent users</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
