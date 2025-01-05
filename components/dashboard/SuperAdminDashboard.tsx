'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { 
  Users, School, Settings, Activity, Bell, Calendar, Book, 
  Database, FileText, Mail, Shield, Terminal, Upload,
  PlusCircle, Trash2, Edit, MoreVertical, ChevronDown,
  Building2, GraduationCap, BookOpen
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface School {
  id: string;
  name: string;
  address?: string;
  users: any[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  school?: School;
  schoolId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    address: '',
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    schoolId: '',
  });

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'schooladmin', label: 'School Admin' },
    { value: 'superadmin', label: 'Super Admin' },
  ];

  // Fetch schools and users on component mount
  useEffect(() => {
    fetchSchools();
    fetchUsers();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error('Failed to fetch schools');
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schools",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSchool.name || !newSchool.address) {
      toast({
        title: "Error",
        description: "School name and address are required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchool),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create school');
      }

      const school = await response.json();
      setSchools([...schools, school]);
      setIsAddingSchool(false);
      setNewSchool({ name: '', address: '' });
      
      toast({
        title: "Success",
        description: "School created successfully",
      });

      // Refresh the schools list
      fetchSchools();
    } catch (error) {
      console.error('Error creating school:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create school",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          powerLevel: 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }

      setIsAddingUser(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'student',
        schoolId: '',
      });
      
      toast({
        title: "Success",
        description: "User created successfully",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!confirm('Are you sure you want to delete this school?')) return;

    try {
      const response = await fetch(`/api/schools?id=${schoolId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete school');

      setSchools(schools.filter(school => school.id !== schoolId));
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete school",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 gap-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold">100</h3>
                    <p className="text-sm text-gray-500">Active Users: 50</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Schools</p>
                    <h3 className="text-2xl font-bold">20</h3>
                    <p className="text-sm text-gray-500">Institutions</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <School className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">System Health</p>
                    <h3 className="text-2xl font-bold">90%</h3>
                    <p className="text-sm text-gray-500">Operational</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Activity className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Quizzes</p>
                    <h3 className="text-2xl font-bold">50</h3>
                    <p className="text-sm text-gray-500">In Progress</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Book className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add activity items here */}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                >
                  <Users />
                  <span>Add User</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                >
                  <School />
                  <span>Add School</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                >
                  <Bell />
                  <span>Announcements</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                >
                  <Terminal />
                  <span>System Logs</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
                <CardDescription>Manage system database operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Automatic Backups</h4>
                    <p className="text-sm text-gray-500">Schedule: Daily</p>
                  </div>
                  <Select>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </Select>
                </div>
                <Button className="w-full" variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Manual Backup Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Monitor system activities and errors</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] overflow-auto">
                <div className="space-y-2 text-sm">
                  {/* Add log entries here */}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Export Logs
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure system security parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" defaultValue={30} />
                </div>
                <div>
                  <Label>Failed Login Attempts</Label>
                  <Input type="number" defaultValue={5} />
                </div>
                <div>
                  <Label>Password Policy</Label>
                  <Select defaultValue="strong">
                    <option value="basic">Basic</option>
                    <option value="strong">Strong</option>
                    <option value="custom">Custom</option>
                  </Select>
                </div>
                <div>
                  <Label>2FA Requirement</Label>
                  <Select defaultValue="optional">
                    <option value="disabled">Disabled</option>
                    <option value="optional">Optional</option>
                    <option value="required">Required</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Templates</CardTitle>
              <CardDescription>Manage global quiz templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    {/* Add quiz template content here */}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    {/* Add quiz template content here */}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    {/* Add quiz template content here */}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Review and moderate user-generated content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add moderation items here */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Announcements</CardTitle>
                <CardDescription>Manage system-wide announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add announcement management interface here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure system notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <input type="checkbox" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>System Alerts</Label>
                  <p className="text-sm text-gray-500">Important system notifications</p>
                </div>
                <input type="checkbox" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Security Alerts</Label>
                  <p className="text-sm text-gray-500">Security-related notifications</p>
                </div>
                <input type="checkbox" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage API settings and access tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>API Version</Label>
                <Select defaultValue="v2">
                  <option value="v1">Version 1.0</option>
                  <option value="v2">Version 2.0</option>
                  <option value="v3-beta">Version 3.0 (Beta)</option>
                </Select>
              </div>
              <div>
                <Label>Rate Limiting</Label>
                <Input type="number" defaultValue={1000} />
                <p className="text-sm text-gray-500">Requests per hour</p>
              </div>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Generate New API Key
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure system email settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>SMTP Server</Label>
                  <Input placeholder="smtp.example.com" />
                </div>
                <div>
                  <Label>SMTP Port</Label>
                  <Input type="number" placeholder="587" />
                </div>
                <div>
                  <Label>Email From</Label>
                  <Input type="email" placeholder="system@example.com" />
                </div>
                <div>
                  <Label>Reply To</Label>
                  <Input type="email" placeholder="support@example.com" />
                </div>
              </div>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Test Email Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schools Tab */}
        <TabsContent value="schools" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Schools</h2>
            <Dialog open={isAddingSchool} onOpenChange={setIsAddingSchool}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add School
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New School</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new school.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSchool} className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">School Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter school name"
                        value={newSchool.name}
                        onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Enter school address"
                        value={newSchool.address}
                        onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create School</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => (
              <Card key={school.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{school.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteSchool(school.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{school.address}</p>
                  <p className="text-sm font-medium mt-2">
                    {school.users?.length || 0} Users
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Users</h2>
            <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new user.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter user's name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter user's email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        required
                      >
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="school">School</Label>
                      <select
                        id="school"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                        value={newUser.schoolId}
                        onChange={(e) => setNewUser({ ...newUser, schoolId: e.target.value })}
                      >
                        <option value="">No School</option>
                        {schools.map((school) => (
                          <option key={school.id} value={school.id}>
                            {school.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create User</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Role</th>
                      <th className="text-left p-4">School</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4 capitalize">{user.role}</td>
                        <td className="p-4">{user.school?.name || 'No School'}</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Distribution of users by role</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Students', value: 50 },
                        { name: 'Teachers', value: 30 },
                        { name: 'School Admins', value: 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Students', value: 50 },
                        { name: 'Teachers', value: 30 },
                        { name: 'School Admins', value: 20 },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>User activity in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="flex items-center gap-4 py-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">User logged in</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">User created a quiz</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">User submitted a quiz</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
const StatCard = ({ title, value, subValue, icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm text-gray-500">{subValue}</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickActionButton = ({ icon, label, onClick }) => (
  <Button
    variant="outline"
    className="h-24 flex flex-col items-center justify-center gap-2"
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Button>
);

const ActivityFeed = () => (
  <div className="space-y-4">
    {/* Add activity items here */}
  </div>
);

const LogViewer = () => (
  <div className="space-y-2 text-sm">
    {/* Add log entries here */}
  </div>
);

const QuizTemplateCard = () => (
  <Card>
    <CardContent className="p-4">
      {/* Add quiz template content here */}
    </CardContent>
  </Card>
);

const ModerationQueue = () => (
  <div className="space-y-4">
    {/* Add moderation items here */}
  </div>
);

const AnnouncementManager = () => (
  <div className="space-y-4">
    {/* Add announcement management interface here */}
  </div>
);
