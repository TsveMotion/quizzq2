'use client';

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Activity, Building2, Users } from 'lucide-react';
import { DashboardLayout } from "./DashboardLayout";
import { OverviewTab } from "./tabs/OverviewTab";
import { SchoolsTab } from "./tabs/SchoolsTab";
import { UsersTab } from "./tabs/UsersTab";

interface School {
  id: string;
  name: string;
  address?: string;
  roleNumber?: string;
  users: any[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    users: number;
    classes: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId: string | null;
  school: School | null;
  createdAt: Date;
}

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalSchools: number;
  totalClasses: number;
  activeUsers: number;
  completionRate: number;
  userGrowth: Array<{ date: string; count: number }>;
  roleDistribution: Array<{ name: string; value: number }>;
  schoolPerformance: Array<{ name: string; performance: number }>;
}

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalSchools: 0,
    totalClasses: 0,
    activeUsers: 0,
    completionRate: 0,
    userGrowth: [],
    roleDistribution: [],
    schoolPerformance: [],
  });

  useEffect(() => {
    fetchSchools();
    fetchUsers();
    fetchDashboardStats();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error('Failed to fetch schools');
      const data = await response.json();
      
      // Fetch user counts for each school in parallel
      const schoolsWithCounts = await Promise.all(
        data.map(async (school: School) => {
          const usersResponse = await fetch(`/api/schools/${school.id}/users`);
          if (!usersResponse.ok) return school;
          const users = await usersResponse.json();
          
          // Filter students only
          const studentCount = users.filter((user: any) => user.role === 'student').length;
          
          return {
            ...school,
            _count: {
              users: studentCount, // Only count students
              classes: school._count?.classes || 0
            }
          };
        })
      );
      
      setSchools(schoolsWithCounts);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schools",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch('/api/users');
      const users = await usersResponse.json();

      // Calculate stats
      const students = users.filter((user: any) => user.role === 'student');
      const teachers = users.filter((user: any) => user.role === 'teacher');

      // Calculate user growth (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const userGrowth = last7Days.map(date => ({
        date,
        count: users.filter((user: any) => 
          new Date(user.createdAt).toISOString().split('T')[0] === date
        ).length
      }));

      // Calculate role distribution
      const roleDistribution = [
        { name: 'Students', value: students.length },
        { name: 'Teachers', value: teachers.length },
        { name: 'Admins', value: users.filter((user: any) => user.role === 'schooladmin').length },
      ];

      // Calculate school performance (random data for demo)
      const schoolPerformance = schools.map(school => ({
        name: school.name,
        performance: Math.floor(Math.random() * 40) + 60, // Random performance between 60-100
      }));

      setDashboardStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalSchools: schools.length,
        totalClasses: schools.reduce((acc, school) => acc + (school._count?.classes || 0), 0),
        activeUsers: users.length,
        completionRate: 78, // Example static value
        userGrowth,
        roleDistribution,
        schoolPerformance,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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
      const response = await fetch('/api/admin/users', {
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete school');
      }

      setSchools(prev => prev.filter(school => school.id !== schoolId));
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting school:', error);
      toast({
        title: "Error",
        description: "Failed to delete school",
        variant: "destructive",
      });
    }
  };

  const handleEditSchool = (school: School) => {
    // Implement edit school functionality
  };

  const handleViewSchoolDetails = (school: School) => {
    setSelectedSchool(school);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="hidden lg:block w-64 border-r bg-card">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-lg font-semibold">QuizzQ Admin</h2>
            <p className="text-sm text-muted-foreground">Super Admin Dashboard</p>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <Activity className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "schools" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("schools")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Schools
            </Button>
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
          <OverviewTab stats={dashboardStats} />
          <SchoolsTab
            schools={schools}
            onAddSchool={handleAddSchool}
            onDeleteSchool={handleDeleteSchool}
            onEditSchool={handleEditSchool}
            onViewDetails={handleViewSchoolDetails}
          />
          <UsersTab
            users={filteredUsers}
            schools={schools}
            onAddUser={handleCreateUser}
            onDeleteUser={handleDeleteUser}
            onEditUser={() => {}}
            onSearch={setSearchTerm}
            onRoleFilter={setRoleFilter}
          />
        </DashboardLayout>
      </div>
    </div>
  );
}
