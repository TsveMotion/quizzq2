'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { School, User, Class } from '@prisma/client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Theme colors
const themeColors = {
  light: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    tertiary: '#A855F7',
    background: 'white',
    text: '#1F2937',
    border: '#E5E7EB',
    gridLines: '#F3F4F6',
  },
  dark: {
    primary: '#818CF8',
    secondary: '#A78BFA',
    tertiary: '#C084FC',
    background: '#1F2937',
    text: '#F9FAFB',
    border: '#374151',
    gridLines: '#374151',
  },
};

interface OverviewTabProps {
  school: School & {
    users: User[];
    classes: Class[];
    _count: {
      users: number;
      classes: number;
    };
  };
}

interface ActivityData {
  date: string;
  count: number;
}

interface ClassStats {
  name: string;
  studentCount: number;
  teacherName: string;
  assignmentCount: number;
}

export const OverviewTab = ({ school }: OverviewTabProps) => {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [classStats, setClassStats] = useState<ClassStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme = 'light' } = useTheme();
  const colors = themeColors[theme as keyof typeof themeColors];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [activityResponse, classResponse] = await Promise.all([
          fetch('/api/activity/stats'),
          fetch('/api/classes/stats')
        ]);

        if (!activityResponse.ok || !classResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [activityData, classData] = await Promise.all([
          activityResponse.json(),
          classResponse.json()
        ]);

        setActivityData(activityData);
        setClassStats(Array.isArray(classData) ? classData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setActivityData([]);
        setClassStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalTeachers = school.users.filter(user => user.role === 'TEACHER').length;
  const totalStudents = school.users.filter(user => user.role === 'STUDENT').length;
  const totalClasses = school._count.classes;

  // Chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.text,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: colors.gridLines,
        },
        ticks: {
          color: colors.text,
        },
      },
      x: {
        grid: {
          color: colors.gridLines,
        },
        ticks: {
          color: colors.text,
        },
      },
    },
  };

  // Prepare data for user distribution chart
  const userDistributionData = {
    labels: ['Teachers', 'Students'],
    datasets: [
      {
        data: [totalTeachers, totalStudents],
        backgroundColor: [colors.primary, colors.secondary],
        borderColor: [colors.primary, colors.secondary],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for classes overview
  const classesData = {
    labels: (classStats || []).map(cls => cls.name),
    datasets: [
      {
        label: 'Students',
        data: (classStats || []).map(cls => cls.studentCount),
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        borderWidth: 1,
      },
      {
        label: 'Assignments',
        data: (classStats || []).map(cls => cls.assignmentCount),
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
        borderWidth: 1,
      },
    ],
  };

  // Prepare monthly activity data
  const monthlyActivityData = {
    labels: activityData.map(item => item.date),
    datasets: [
      {
        label: 'User Activity',
        data: activityData.map(item => item.count),
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        tension: 0.4,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Teachers</h3>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{totalTeachers}</p>
        </div>
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{totalStudents}</p>
        </div>
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Classes</h3>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{totalClasses}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Distribution */}
        <div className="h-[400px] rounded-lg bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">User Distribution</h3>
          <div className="h-[300px]">
            <Doughnut
              data={userDistributionData}
              options={{
                ...commonOptions,
                cutout: '60%',
              }}
            />
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="h-[400px] rounded-lg bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium">Monthly Activity</h3>
          <div className="h-[300px]">
            <Line data={monthlyActivityData} options={commonOptions} />
          </div>
        </div>

        {/* Classes Overview */}
        <div className="col-span-1 h-[400px] rounded-lg bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-lg font-medium">Classes Overview</h3>
          <div className="h-[300px]">
            <Bar data={classesData} options={commonOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
