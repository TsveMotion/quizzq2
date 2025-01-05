'use client';

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SuperAdminOverviewTab } from "./OverviewTab";
import { SuperAdminUsersTab } from "./UsersTab";
import { SuperAdminSchoolsTab } from "./SchoolsTab";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, School } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId: string | null;
  school: { name: string } | null;
  createdAt: Date;
  status?: 'ACTIVE' | 'INACTIVE';
  powerLevel?: number;
}

interface School {
  id: string;
  name: string;
  description?: string;
  roleNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _count?: {
    users: number;
  };
  users?: {
    id: string;
    name: string;
    role: string;
  }[];
}

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const fetchSchools = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/schools');
      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }
      const data = await response.json();
      setSchools(data);
      return data;
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schools",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const handleDataChange = useCallback(() => {
    setIsLoading(true);
    Promise.all([fetchUsers(), fetchSchools()]).finally(() => {
      setIsLoading(false);
    });
  }, [fetchUsers, fetchSchools]);

  useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);

  const navItems = [
    {
      title: "Overview",
      value: "overview",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      value: "users",
      icon: Users,
    },
    {
      title: "Schools",
      value: "schools",
      icon: School,
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Super Admin</h2>
        </div>
        <div className="space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 px-2",
                  activeTab === item.value && "bg-muted"
                )}
                onClick={() => setActiveTab(item.value)}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent value="overview" className="m-0 h-full">
            <div className="h-full p-8">
              <SuperAdminOverviewTab 
                users={users}
                schools={schools}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
          <TabsContent value="users" className="m-0 h-full">
            <div className="h-full p-8">
              <SuperAdminUsersTab 
                users={users}
                schools={schools}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onUsersChange={handleDataChange}
              />
            </div>
          </TabsContent>
          <TabsContent value="schools" className="m-0 h-full">
            <div className="h-full p-8">
              <SuperAdminSchoolsTab 
                schools={schools}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSchoolCreated={handleDataChange}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}