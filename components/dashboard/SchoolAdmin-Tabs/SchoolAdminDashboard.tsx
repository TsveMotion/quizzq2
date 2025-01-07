'use client';

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen,
  LogOut,
  School as SchoolIcon
} from "lucide-react";
import { OverviewTab } from "./OverviewTab";
import { TeachersTab } from "./TeachersTab";
import { StudentsTab } from "./StudentsTab";
import { ClassesTab } from "./ClassesTab";
import { AssignmentsTab } from "./AssignmentsTab";
import { QuizzesTab } from "./QuizzesTab";
import { Tab } from '@headlessui/react';
import type { Class, School, User } from '@prisma/client';
import type {
  ClassWithTeacher as ImportedClassWithTeacher,
  SchoolWithRelations as ImportedSchoolWithRelations,
  Teacher as ImportedTeacher,
  Student as ImportedStudent,
  ClassTeacher as ImportedClassTeacher
} from './types';

// Types for TeachersTab
interface TeacherStudent {
  id: string;
  name: string;
  email: string;
}

interface TeacherClass {
  id: string;
  name: string;
  students: TeacherStudent[];
}

interface ExtendedTeacher extends ImportedTeacher {
  teachingClasses?: TeacherClass[];
}

// Types for StudentsTab
interface StudentTeacher {
  id: string;
  name: string;
  email: string;
}

interface StudentClass {
  id: string;
  name: string;
  teacher: StudentTeacher;
}

interface ExtendedStudent extends ImportedStudent {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  enrolledClasses?: StudentClass[];
}

// Types for ClassesTab
interface ExtendedClassTeacher extends ImportedTeacher {
  id: string;
  name: string;
  email: string;
  role: string;
  classId: string;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
  teacher: ImportedTeacher;
}

interface ExtendedClassStudent extends ImportedStudent {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface ExtendedClassWithTeacher extends Omit<ImportedClassWithTeacher, 'teacher' | 'students'> {
  teacher: ExtendedClassTeacher;
  students: ExtendedClassStudent[];
}

// Types for OverviewTab
interface ExtendedClass extends Omit<Class, 'teacher' | 'students'> {
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  students: {
    id: string;
    name: string;
    email: string;
  }[];
  _count: {
    assignments: number;
    quizzes: number;
    students: number;
  };
  classTeachers: ImportedClassTeacher[];
}

interface ExtendedSchoolWithRelations extends ImportedSchoolWithRelations {
  users: (User & {
    status: string;
  })[];
}

interface SchoolAdminDashboardProps {
  school: ExtendedSchoolWithRelations;
}

interface NavItem {
  title: string;
  value: string;
  icon: any;
  disabled?: boolean;
  section?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    value: "overview",
    icon: LayoutDashboard,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Teachers",
    value: "teachers",
    icon: GraduationCap,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Students",
    value: "students",
    icon: Users,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Classes",
    value: "classes",
    icon: BookOpen,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Assignments",
    value: "assignments",
    icon: SchoolIcon,
    disabled: false,
    section: "dashboard"
  },
  {
    title: "Quizzes",
    value: "quizzes",
    icon: SchoolIcon,
    disabled: false,
    section: "dashboard"
  }
];

interface TabButtonProps {
  active: boolean;
  children: React.ReactNode;
}

function TabButton({ active, children }: TabButtonProps) {
  return (
    <button
      className={`${
        active
          ? 'bg-white text-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      } rounded-lg py-2.5 px-4 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2`}
    >
      {children}
    </button>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function SchoolAdminDashboard({ school }: SchoolAdminDashboardProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [teachers, setTeachers] = useState<ExtendedTeacher[]>([]);
  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [classes, setClasses] = useState<ExtendedClassWithTeacher[]>(() =>
    school.classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      description: cls.description,
      schoolId: school.id,
      teacherId: cls.teacher.id,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
      classTeachers: [{
        id: crypto.randomUUID(),
        classId: cls.id,
        teacherId: cls.teacher.id,
        createdAt: cls.createdAt,
        updatedAt: cls.updatedAt,
        teacher: cls.teacher
      }],
      teacher: {
        id: cls.teacher.id,
        name: cls.teacher.name,
        email: cls.teacher.email,
        role: 'TEACHER',
        classId: cls.id,
        teacherId: cls.teacher.id,
        createdAt: cls.createdAt,
        updatedAt: cls.updatedAt,
        teacher: cls.teacher
      },
      students: cls.students.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'STUDENT',
        createdAt: new Date()
      })),
      _count: {
        assignments: cls._count?.assignments || 0,
        quizzes: cls._count?.quizzes || 0,
        students: cls.students?.length || 0
      }
    }))
  );

  // Map the classes to include required fields
  const mappedClasses = classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    description: cls.description,
    schoolId: school.id,
    teacherId: cls.teacher.id,
    createdAt: cls.createdAt,
    updatedAt: cls.updatedAt,
    classTeachers: cls.classTeachers,
    teacher: cls.teacher,
    students: cls.students,
    _count: {
      assignments: cls._count?.assignments || 0,
      quizzes: cls._count?.quizzes || 0,
      students: cls.students?.length || 0
    }
  }));

  // Prepare school data for OverviewTab
  const overviewSchool: ExtendedSchoolWithRelations = {
    ...school,
    classes: school.classes.map(cls => ({
      ...cls,
      _count: {
        assignments: 0,
        quizzes: 0,
        students: cls.students?.length || 0
      },
      classTeachers: []
    }))
  };

  // Fetch students when the tab changes to students
  useEffect(() => {
    const fetchStudents = async () => {
      if (activeTab === "students") {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/schools/${school.id}/students`);
          if (!response.ok) {
            throw new Error('Failed to fetch students');
          }
          const data = await response.json();
          setStudents(data);
        } catch (error) {
          console.error('Error fetching students:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStudents();
  }, [activeTab, school.id]);

  const handleStudentsChange = async () => {
    if (activeTab === "students") {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/schools/${school.id}/students`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const dashboardItems = mainNavItems.filter(item => item.section === "dashboard");

  const handleClassCreate = async (newClass: Partial<ExtendedClassWithTeacher>) => {
    // Implementation for class creation
    console.log('Creating class:', newClass);
  };

  const handleClassDelete = async (classId: string) => {
    // Implementation for class deletion
    console.log('Deleting class:', classId);
  };

  const handleClassEdit = async (updatedClass: ExtendedClassWithTeacher) => {
    // Implementation for class editing
    console.log('Editing class:', updatedClass);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center border-b border-border px-4">
          <SchoolIcon className="mr-2 h-5 w-5" />
          <span className="font-semibold text-foreground">School Admin</span>
        </div>
        
        <div className="flex flex-col flex-grow py-2">
          {/* All Navigation Items */}
          <div className="space-y-1 px-2">
            {/* Dashboard Items */}
            {dashboardItems.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  activeTab === item.value ? "bg-secondary" : "hover:bg-accent"
                )}
                onClick={() => setActiveTab(item.value)}
                disabled={item.disabled}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.title}
              </Button>
            ))}

            {/* Separator */}
            <div className="my-2 border-t border-border/50" />

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-[1400px]">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab school={overviewSchool} />
            </TabsContent>
            <TabsContent value="teachers" className="mt-0">
              <TeachersTab schoolId={school.id} />
            </TabsContent>
            <TabsContent value="students" className="mt-0">
              <StudentsTab
                students={students}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={school.id}
                onStudentsChange={handleStudentsChange}
              />
            </TabsContent>
            <TabsContent value="classes" className="mt-0">
              <ClassesTab
                classes={mappedClasses}
                teachers={teachers}
                students={students}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={school.id}
                onClassesChange={(newClasses) => {
                  setClasses(
                    newClasses.map((cls) => ({
                      ...cls,
                      teacher: {
                        ...cls.teacher,
                        classId: cls.id,
                        teacherId: cls.teacher.id,
                        createdAt: cls.createdAt,
                        updatedAt: cls.updatedAt,
                        teacher: cls.teacher
                      }
                    })) as ExtendedClassWithTeacher[]
                  );
                }}
              />
            </TabsContent>
            <TabsContent value="assignments" className="mt-0">
              <AssignmentsTab schoolId={school.id} />
            </TabsContent>
            <TabsContent value="quizzes" className="mt-0">
              <QuizzesTab schoolId={school.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
