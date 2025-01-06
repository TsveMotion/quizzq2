'use client';

import { useState, useCallback, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  LogOut 
} from "lucide-react";
import { OverviewTab } from "./OverviewTab";
import { TeachersTab } from "./TeachersTab";
import { StudentsTab } from "./StudentsTab";
import { ClassesTab } from "./ClassesTab";

interface School {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SchoolAdminDashboardProps {
  school: School;
}

export function SchoolAdminDashboard({ school }: SchoolAdminDashboardProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    teachers: [],
    students: [],
    classes: []
  });

  const fetchData = useCallback(async () => {
    if (!school?.id) {
      toast({
        title: "Error",
        description: "No school associated with this account",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const [teachersRes, studentsRes, classesRes] = await Promise.all([
        fetch(`/api/schools/${school.id}/teachers`),
        fetch(`/api/schools/${school.id}/students`),
        fetch(`/api/schools/${school.id}/classes`)
      ]);

      if (!teachersRes.ok || !studentsRes.ok || !classesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [teachersData, studentsData, classesData] = await Promise.all([
        teachersRes.json(),
        studentsRes.json(),
        classesRes.json()
      ]);

      setData({
        teachers: teachersData,
        students: studentsData,
        classes: classesData
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [school?.id, toast]);

  useEffect(() => {
    if (school?.id) {
      fetchData();
    }
  }, [fetchData, school?.id]);

  if (!session?.user) {
    return <div>Please sign in to access the dashboard</div>;
  }

  if (!school) {
    return <div>No school data available</div>;
  }

  const navItems = [
    {
      title: "Overview",
      value: "overview",
      icon: LayoutDashboard,
    },
    {
      title: "Teachers",
      value: "teachers",
      icon: GraduationCap,
    },
    {
      title: "Students",
      value: "students",
      icon: Users,
    },
    {
      title: "Classes",
      value: "classes",
      icon: BookOpen,
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">School Admin</h2>
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
        <div className="absolute bottom-0 w-64 border-t p-4">
          <div className="mb-2">
            <div className="text-sm font-semibold">{session.user.name || 'School Admin'}</div>
            <div className="text-xs text-muted-foreground">{session.user.email}</div>
            <div className="mt-1 text-xs text-muted-foreground">{school.name}</div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {school.name} Dashboard
            </h2>
          </div>

          <div className="space-y-4">
            {activeTab === "overview" && (
              <OverviewTab
                teachers={data.teachers}
                students={data.students}
                classes={data.classes}
                isLoading={isLoading}
              />
            )}

            {activeTab === "teachers" && (
              <TeachersTab
                teachers={data.teachers}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={school.id}
                onTeachersChange={fetchData}
              />
            )}

            {activeTab === "students" && (
              <StudentsTab
                students={data.students}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={school.id}
                onStudentsChange={fetchData}
              />
            )}

            {activeTab === "classes" && (
              <ClassesTab
                classes={data.classes}
                teachers={data.teachers}
                students={data.students}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={school.id}
                onClassesChange={fetchData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
