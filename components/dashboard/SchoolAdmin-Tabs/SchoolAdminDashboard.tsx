'use client';

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, GraduationCap, BookOpen, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeachersTab } from "./TeachersTab";
import { StudentsTab } from "./StudentsTab";
import { ClassesTab } from "./ClassesTab";

interface School {
  id: string;
  name: string;
  roleNumber: string;
  description: string;
}

interface SchoolAdminDashboardProps {
  initialSchool: School;
}

export function SchoolAdminDashboard({ initialSchool }: SchoolAdminDashboardProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [school, setSchool] = useState<School>(initialSchool);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = useCallback(async () => {
    if (!session?.user?.schoolId) {
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
        fetch(`/api/admin/users?role=teacher&schoolId=${session.user.schoolId}`),
        fetch(`/api/admin/users?role=student&schoolId=${session.user.schoolId}`),
        fetch(`/api/admin/classes?schoolId=${session.user.schoolId}`)
      ]);

      if (!teachersRes.ok || !studentsRes.ok || !classesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [teachersData, studentsData, classesData] = await Promise.all([
        teachersRes.json(),
        studentsRes.json(),
        classesRes.json()
      ]);

      setTeachers(teachersData);
      setStudents(studentsData);
      setClasses(classesData);

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.schoolId, toast]);

  useEffect(() => {
    if (session?.user?.schoolId) {
      fetchData();
    }
  }, [fetchData, session?.user?.schoolId]);

  if (!session?.user) {
    return <div>Please sign in to access the dashboard</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
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
      icon: Users,
    },
    {
      title: "Students",
      value: "students",
      icon: GraduationCap,
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

      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsContent value="overview" className="m-0 h-full">
            <div className="h-full p-8">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Teachers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teachers.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{students.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{classes.length}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teachers" className="m-0 h-full">
            <div className="h-full p-8">
              <TeachersTab
                teachers={teachers}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={session.user.schoolId}
                onTeachersChange={fetchData}
              />
            </div>
          </TabsContent>

          <TabsContent value="students" className="m-0 h-full">
            <div className="h-full p-8">
              <StudentsTab
                students={students}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={session.user.schoolId}
                onStudentCreated={fetchData}
              />
            </div>
          </TabsContent>

          <TabsContent value="classes" className="m-0 h-full">
            <div className="h-full p-8">
              <ClassesTab
                classes={classes}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={session.user.schoolId}
                onClassCreated={fetchData}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
