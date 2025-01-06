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
    primary: '#6366F1', // Indigo-500
    secondary: '#8B5CF6', // Purple-500
    tertiary: '#A855F7', // Purple-600
    background: 'white',
    text: '#1F2937', // Gray-800
    border: '#E5E7EB', // Gray-200
    gridLines: '#F3F4F6', // Gray-100
  },
  dark: {
    primary: '#818CF8', // Indigo-400
    secondary: '#A78BFA', // Purple-400
    tertiary: '#C084FC', // Purple-400
    background: '#1F2937', // Gray-800
    text: '#F9FAFB', // Gray-50
    border: '#374151', // Gray-700
    gridLines: '#374151', // Gray-700
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
  labels: string[];
  data: number[];
}

interface ClassStats {
  name: string;
  studentCount: number;
  teacherName: string;
  assignmentCount: number;
}

export const OverviewTab = ({ school }: OverviewTabProps) => {
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [classStats, setClassStats] = useState<ClassStats[]>([]);
  const { theme = 'light' } = useTheme();
  const colors = themeColors[theme as keyof typeof themeColors];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityResponse = await fetch('/api/activity/stats');
        const activityData = await activityResponse.json();
        setActivityData(activityData);

        const classResponse = await fetch('/api/classes/stats');
        const classData = await classResponse.json();
        setClassStats(classData);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    labels: classStats.map(cls => cls.name),
    datasets: [
      {
        label: 'Students',
        data: classStats.map(cls => cls.studentCount),
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        borderWidth: 1,
      },
      {
        label: 'Assignments',
        data: classStats.map(cls => cls.assignmentCount),
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
        borderWidth: 1,
      },
    ],
  };

  // Prepare monthly activity data
  const monthlyActivityData = {
    labels: activityData?.labels || [],
    datasets: [
      {
        label: 'User Activity',
        data: activityData?.data || [],
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        tension: 0.4,
      },
    ],
  };

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
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-card-foreground">User Distribution</h3>
          <div className="h-64">
            <Doughnut 
              data={userDistributionData}
              options={{
                ...commonOptions,
                cutout: '65%',
              }}
            />
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-card-foreground">Monthly Activity</h3>
          <div className="h-64">
            <Line
              data={monthlyActivityData}
              options={{
                ...commonOptions,
                scales: {
                  ...commonOptions.scales,
                  y: {
                    ...commonOptions.scales.y,
                    title: {
                      display: true,
                      text: 'Activity Count',
                      color: colors.text,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Classes Overview */}
        <div className="col-span-1 rounded-lg bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-lg font-medium text-card-foreground">Classes Overview</h3>
          <div className="h-64">
            <Bar
              data={classesData}
              options={{
                ...commonOptions,
                scales: {
                  ...commonOptions.scales,
                  y: {
                    ...commonOptions.scales.y,
                    title: {
                      display: true,
                      text: 'Count',
                      color: colors.text,
                    },
                  },
                  x: {
                    ...commonOptions.scales.x,
                    title: {
                      display: true,
                      text: 'Classes',
                      color: colors.text,
                    },
                  },
                },
                plugins: {
                  ...commonOptions.plugins,
                  tooltip: {
                    callbacks: {
                      afterBody: (tooltipItems) => {
                        const index = tooltipItems[0].dataIndex;
                        return `Teacher: ${classStats[index]?.teacherName || 'No Teacher'}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
