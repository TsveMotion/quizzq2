'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Settings,
  Users as UsersIcon,
  School as SchoolIcon,
  BookOpen,
  BarChart,
  Activity,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Form validation schema
const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'teacher', 'schooladmin']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    schoolId: string;
    school: {
      id: string;
      name: string;
    };
  };
}

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubmissions: number;
  monthlyActivity: {
    month: string;
    submissions: number;
    activeUsers: number;
  }[];
  userGrowth: {
    month: string;
    students: number;
    teachers: number;
  }[];
  classPerformance: {
    subject: string;
    averageScore: number;
    submissions: number;
    totalStudents: number;
  }[];
}

interface UserStats {
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  activeUsers: number;
  totalSubmissions: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  teacherOf?: {
    id: string;
    name: string;
    students: {
      id: string;
      name: string;
      email: string;
      role: string;
    }[];
  }[];
  enrolledIn?: {
    id: string;
    name: string;
    teacher: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }[];
  school?: {
    id: string;
    name: string;
  };
  _count?: {
    teacherOf: number;
    enrolledIn: number;
    submissions: number;
  };
}

interface SchoolSettings {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function SchoolAdminDashboard({ user }: DashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    totalSubmissions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isViewingUser, setIsViewingUser] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings | null>(null);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubmissions: 0,
    monthlyActivity: [
      { month: 'Jan', submissions: 0, activeUsers: 0 },
      { month: 'Feb', submissions: 0, activeUsers: 0 },
      { month: 'Mar', submissions: 0, activeUsers: 0 },
      { month: 'Apr', submissions: 0, activeUsers: 0 },
      { month: 'May', submissions: 0, activeUsers: 0 },
      { month: 'Jun', submissions: 0, activeUsers: 0 }
    ],
    userGrowth: [
      { month: 'Jan', students: 0, teachers: 0 },
      { month: 'Feb', students: 0, teachers: 0 },
      { month: 'Mar', students: 0, teachers: 0 },
      { month: 'Apr', students: 0, teachers: 0 },
      { month: 'May', students: 0, teachers: 0 },
      { month: 'Jun', students: 0, teachers: 0 }
    ],
    classPerformance: [
      { subject: 'Math', averageScore: 0, submissions: 0, totalStudents: 0 },
      { subject: 'Science', averageScore: 0, submissions: 0, totalStudents: 0 },
      { subject: 'English', averageScore: 0, submissions: 0, totalStudents: 0 }
    ]
  });
  const [classStats, setClassStats] = useState({
    totalClasses: 0,
    averageScore: 0,
    submissionRate: 0,
    classDistribution: [
      { name: 'Mathematics', students: 45 },
      { name: 'Science', students: 38 },
      { name: 'English', students: 42 },
      { name: 'History', students: 35 }
    ]
  });

  const [assignmentStats, setAssignmentStats] = useState({
    monthlySubmissions: [
      { month: 'Jan', submissions: 65 },
      { month: 'Feb', submissions: 75 },
      { month: 'Mar', submissions: 85 },
      { month: 'Apr', submissions: 70 },
      { month: 'May', submissions: 90 },
      { month: 'Jun', submissions: 95 }
    ],
    scoreDistribution: [
      { range: '90-100', count: 25 },
      { range: '80-89', count: 35 },
      { range: '70-79', count: 20 },
      { range: '60-69', count: 15 },
      { range: '<60', count: 5 }
    ],
    recentAssignments: [
      { name: 'Math Quiz 1', dueDate: '2025-01-10', submissions: 28, totalStudents: 30 },
      { name: 'Science Project', dueDate: '2025-01-15', submissions: 25, totalStudents: 30 },
      { name: 'English Essay', dueDate: '2025-01-20', submissions: 22, totalStudents: 30 }
    ]
  });
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userFormSchema),
  });

  useEffect(() => {
    if (user?.school?.id) {
      fetchData();
      fetchSchoolSettings();
      fetchDashboardStats();
    }
  }, [user?.school?.id]);

  const fetchData = async () => {
    if (!user?.school?.id) {
      console.error('No school ID found');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Fetching users for school:', user.school.id);
      const response = await fetch(`/api/schools/${user.school.id}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch users:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      console.log('Received data:', {
        userCount: data.users?.length,
        stats: data.stats,
        school: data.school
      });

      setUsers(data.users || []);
      setStats(data.stats || {
        totalStudents: 0,
        totalTeachers: 0,
        totalAdmins: 0,
        activeUsers: 0,
        totalSubmissions: 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        toast({
          title: 'Error',
          description: `Failed to fetch dashboard data: ${error.message}`,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchoolSettings = async () => {
    try {
      const response = await fetch(`/api/schools/${user.school.id}/settings`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch school settings');
      }

      const data = await response.json();
      setSchoolSettings(data);
    } catch (error) {
      console.error('Error fetching school settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch school settings',
        variant: 'destructive',
      });
    }
  };

  const fetchDashboardStats = async () => {
    if (!user?.school?.id) return;
    
    try {
      const [usersResponse, classesResponse, submissionsResponse] = await Promise.all([
        fetch(`/api/schools/${user.school.id}/users`),
        fetch(`/api/schools/${user.school.id}/classes`),
        fetch(`/api/schools/${user.school.id}/submissions`)
      ]);

      const [usersData, classesData, submissionsData] = await Promise.all([
        usersResponse.json(),
        classesResponse.json(),
        submissionsResponse.json()
      ]);

      // Process the data for dashboard stats
      const students = usersData.filter((u: any) => u.role === 'student');
      const teachers = usersData.filter((u: any) => u.role === 'teacher');

      // Calculate monthly activity (last 6 months)
      const monthlyActivity = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString('default', { month: 'short' });
        const submissions = submissionsData.filter((s: any) => 
          new Date(s.createdAt).getMonth() === date.getMonth()
        ).length;
        const activeUsers = usersData.filter((u: any) => 
          new Date(u.lastActive).getMonth() === date.getMonth()
        ).length;
        return { month, submissions, activeUsers };
      }).reverse();

      // Calculate user growth (last 6 months)
      const userGrowth = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString('default', { month: 'short' });
        const studentsCount = students.filter((s: any) => 
          new Date(s.createdAt).getMonth() <= date.getMonth()
        ).length;
        const teachersCount = teachers.filter((t: any) => 
          new Date(t.createdAt).getMonth() <= date.getMonth()
        ).length;
        return { month, students: studentsCount, teachers: teachersCount };
      }).reverse();

      // Calculate class performance
      const classPerformance = classesData.map((c: any) => ({
        subject: c.name,
        averageScore: c.assignments.reduce((acc: number, a: any) => 
          acc + (a.submissions.reduce((sum: number, s: any) => sum + s.score, 0) / a.submissions.length), 0
        ) / (c.assignments.length || 1),
        submissions: c.assignments.reduce((acc: number, a: any) => acc + a.submissions.length, 0),
        totalStudents: c.students.length
      }));

      setDashboardStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: classesData.length,
        totalSubmissions: submissionsData.length,
        monthlyActivity,
        userGrowth,
        classPerformance
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive',
      });
    }
  };

  const onCreateUser = async (data: z.infer<typeof userFormSchema>) => {
    if (!user?.school?.id) return;

    setIsAddingUser(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          schoolId: user.school.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      toast({
        title: 'Success',
        description: 'User created successfully',
      });

      reset();
      fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setIsAddingUser(false);
    }
  };

  const onDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = async (formData: any) => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/schools/${user.school.id}/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      toast({
        title: 'Success',
        description: 'User updated successfully',
      });

      setIsEditingUser(false);
      fetchData(); // Refresh the users list
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/schools/${user.school.id}/users/${selectedUser.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      setIsConfirmingDelete(false);
      setSelectedUser(null);
      setIsViewingUser(false);
      fetchData(); // Refresh the users list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async (formData: any) => {
    try {
      const response = await fetch(`/api/schools/${user.school.id}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update school settings');
      }

      const data = await response.json();
      setSchoolSettings(data);
      setIsEditingSettings(false);
      toast({
        title: 'Success',
        description: 'School settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating school settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update school settings',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'student':
        return 'default';
      case 'teacher':
        return 'secondary';
      case 'schooladmin':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user.name}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditingSettings(true)}
          className="rounded-full"
        >
          <Settings className="mr-2 h-4 w-4" />
          School Settings
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex h-14 items-center justify-center rounded-full bg-muted p-1 text-muted-foreground">
          <TabsTrigger 
            value="overview" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="users"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="classes"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <SchoolIcon className="mr-2 h-4 w-4" />
            Classes
          </TabsTrigger>
          <TabsTrigger 
            value="assignments"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <div className="absolute right-2 top-2 p-2 bg-primary/10 rounded-full">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardStats.userGrowth[dashboardStats.userGrowth.length - 1]?.students - 
                     dashboardStats.userGrowth[dashboardStats.userGrowth.length - 2]?.students || 0} this month
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Teachers
                </CardTitle>
                <div className="absolute right-2 top-2 p-2 bg-primary/10 rounded-full">
                  <UsersIcon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalTeachers}</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardStats.userGrowth[dashboardStats.userGrowth.length - 1]?.teachers - 
                     dashboardStats.userGrowth[dashboardStats.userGrowth.length - 2]?.teachers || 0} this month
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Classes
                </CardTitle>
                <div className="absolute right-2 top-2 p-2 bg-primary/10 rounded-full">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalClasses}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((dashboardStats.totalSubmissions / (dashboardStats.totalStudents || 1)) * 100)}% participation rate
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Submissions
                </CardTitle>
                <div className="absolute right-2 top-2 p-2 bg-primary/10 rounded-full">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardStats.monthlyActivity[dashboardStats.monthlyActivity.length - 1]?.submissions || 0} this month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Submission and active user trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardStats.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Class Performance</CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dashboardStats.classPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="averageScore" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Student and teacher enrollment trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardStats.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="teachers"
                      stackId="1"
                      stroke="hsl(var(--secondary))"
                      fill="hsl(var(--secondary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Performing Classes</CardTitle>
                <CardDescription>Based on average submission scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardStats.classPerformance
                    .sort((a, b) => b.averageScore - a.averageScore)
                    .slice(0, 5)
                    .map((classData, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{classData.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {classData.submissions} submissions
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {Math.round(classData.averageScore)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Existing users table */}
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Users</CardTitle>
                <div className="flex gap-4">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px]"
                  />
                  <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                    <DialogTrigger asChild>
                      <Button>Add User</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleSubmit(onCreateUser)}>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>
                            Create a new user account
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              {...register('name')}
                              placeholder="John Doe"
                            />
                            {errors.name && (
                              <p className="text-sm text-red-500">
                                {errors.name.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              {...register('email')}
                              placeholder="john@example.com"
                            />
                            {errors.email && (
                              <p className="text-sm text-red-500">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              {...register('password')}
                            />
                            {errors.password && (
                              <p className="text-sm text-red-500">
                                {errors.password.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              onValueChange={(value) =>
                                (document.getElementById('role') as HTMLInputElement).value = value
                              }
                              defaultValue="student"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="schooladmin">School Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <input
                              type="hidden"
                              id="role"
                              {...register('role')}
                              defaultValue="student"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isAddingUser}>
                            {isAddingUser && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Add User
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell onClick={() => {
                          setSelectedUser(user);
                          setIsViewingUser(true);
                        }}>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === 'schooladmin' ? 'default' :
                            user.role === 'teacher' ? 'secondary' : 'outline'
                          }>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role === 'teacher' ? user._count?.teacherOf || 0 :
                           user.role === 'student' ? user._count?.enrolledIn || 0 : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsEditingUser(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsConfirmingDelete(true);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classStats.totalClasses}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classStats.averageScore}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Submission Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classStats.submissionRate}%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Class Distribution</CardTitle>
                <CardDescription>Students per subject</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classStats.classDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="students"
                      nameKey="name"
                      label
                    >
                      {classStats.classDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Class Performance</CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={classStats.classDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="students" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Submission Trend</CardTitle>
                <CardDescription>Monthly submission statistics</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={assignmentStats.monthlySubmissions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Student performance ranges</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={assignmentStats.scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Assignments</CardTitle>
                <CardDescription>Upcoming and recent submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignmentStats.recentAssignments.map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{assignment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {assignment.submissions}/{assignment.totalStudents}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((assignment.submissions / assignment.totalStudents) * 100)}% submitted
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assignment List</CardTitle>
              <CardDescription>All assignments and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment Name</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Average Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Math Quiz 1</TableCell>
                    <TableCell>Jan 10, 2025</TableCell>
                    <TableCell>Mathematics</TableCell>
                    <TableCell>28/30</TableCell>
                    <TableCell>85%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Science Project</TableCell>
                    <TableCell>Jan 15, 2025</TableCell>
                    <TableCell>Science</TableCell>
                    <TableCell>25/30</TableCell>
                    <TableCell>88%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>English Essay</TableCell>
                    <TableCell>Jan 20, 2025</TableCell>
                    <TableCell>English</TableCell>
                    <TableCell>22/30</TableCell>
                    <TableCell>82%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View User Details Dialog */}
      <Dialog open={isViewingUser} onOpenChange={setIsViewingUser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm">{selectedUser.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <Badge variant={
                    selectedUser.role === 'schooladmin' ? 'default' :
                    selectedUser.role === 'teacher' ? 'secondary' : 'outline'
                  }>
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedUser.role === 'teacher' && selectedUser.teacherOf && (
                <div>
                  <Label>Classes Teaching</Label>
                  <ScrollArea className="h-[200px] w-full mt-2 border rounded-md p-4">
                    <div className="space-y-4">
                      {selectedUser.teacherOf.map((class_) => (
                        <div key={class_.id} className="space-y-2">
                          <h4 className="font-medium">{class_.name}</h4>
                          <div className="pl-4">
                            <p className="text-sm text-muted-foreground">
                              {class_.students.length} students enrolled
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {selectedUser.role === 'student' && selectedUser.enrolledIn && (
                <div>
                  <Label>Enrolled Classes</Label>
                  <ScrollArea className="h-[200px] w-full mt-2 border rounded-md p-4">
                    <div className="space-y-4">
                      {selectedUser.enrolledIn.map((class_) => (
                        <div key={class_.id} className="space-y-2">
                          <h4 className="font-medium">{class_.name}</h4>
                          <div className="pl-4">
                            <p className="text-sm text-muted-foreground">
                              Teacher: {class_.teacher.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewingUser(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewingUser(false);
              setIsEditingUser(true);
            }}>
              Edit User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleSubmit(handleEditUser)} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    defaultValue={selectedUser.name}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    defaultValue={selectedUser.email}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    defaultValue={selectedUser.role}
                    onValueChange={(value) => {
                      // @ts-ignore - the register type is not compatible with Select
                      register('role').onChange({ target: { value } });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="schooladmin">School Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditingUser(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* School Settings Dialog */}
      <Dialog open={isEditingSettings} onOpenChange={setIsEditingSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>School Settings</DialogTitle>
            <DialogDescription>
              Manage your school's settings and preferences
            </DialogDescription>
          </DialogHeader>
          {schoolSettings && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateSettings({
                name: formData.get('name'),
              });
            }} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={schoolSettings.name}
                  />
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(schoolSettings.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Total Users</Label>
                  <p className="text-sm text-muted-foreground">
                    {schoolSettings._count.users}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditingSettings(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
