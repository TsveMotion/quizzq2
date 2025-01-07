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
import { School, Class, User } from "@prisma/client";

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

interface Teacher {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
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

interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  enrolledClasses?: StudentClass[];
}

// Types for ClassesTab
interface ClassTeacher {
  id: string;
  name: string;
  email: string;
}

interface ClassStudent {
  id: string;
  name: string;
  email: string;
}

interface ClassWithTeacher {
  id: string;
  name: string;
  description?: string;
  teacher: ClassTeacher;
  students?: ClassStudent[];
  createdAt: Date;
}

// Types for OverviewTab
interface ExtendedClass extends Omit<Class, 'teacher'> {
  teacher: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    powerLevel: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: Date | null;
    schoolId: string | null;
    teacherId: string | null;
    image: string | null;
    avatar: string | null;
    bio: string | null;
    subjects: string | null;
    education: string | null;
    experience: string | null;
    phoneNumber: string | null;
    officeHours: string | null;
  };
  students: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    powerLevel: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: Date | null;
    schoolId: string | null;
    teacherId: string | null;
    image: string | null;
    avatar: string | null;
    bio: string | null;
    subjects: string | null;
    education: string | null;
    experience: string | null;
    phoneNumber: string | null;
    officeHours: string | null;
  }[];
  classTeachers: {
    teacher: {
      id: string;
      name: string;
      email: string;
      password: string;
      role: string;
      powerLevel: number;
      status: string;
      createdAt: Date;
      updatedAt: Date;
      emailVerified: Date | null;
      schoolId: string | null;
      teacherId: string | null;
      image: string | null;
      avatar: string | null;
      bio: string | null;
      subjects: string | null;
      education: string | null;
      experience: string | null;
      phoneNumber: string | null;
      officeHours: string | null;
    };
  }[];
  _count: {
    students: number;
  };
}

interface ExtendedSchool extends School {
  users: User[];
  classes: ExtendedClass[];
  _count: {
    users: number;
    classes: number;
  };
}

interface SchoolAdminDashboardProps {
  school: School & {
    users: User[];
    classes: ExtendedClass[];
    _count: {
      users: number;
      classes: number;
    };
  };
}

export function SchoolAdminDashboard({ school }: SchoolAdminDashboardProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassWithTeacher[]>(() => 
    school.classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      description: cls.description === null ? undefined : cls.description,
      teacher: {
        id: cls.teacher.id,
        name: cls.teacher.name,
        email: cls.teacher.email
      },
      students: cls.students.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email
      })),
      createdAt: cls.createdAt
    }))
  );

  // Prepare school data for OverviewTab
  const overviewSchool: ExtendedSchool = {
    ...school,
    classes: school.classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      description: cls.description,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
      schoolId: cls.schoolId,
      teacherId: cls.teacherId,
      teacher: {
        id: cls.teacher.id,
        name: cls.teacher.name,
        email: cls.teacher.email,
        password: cls.teacher.password,
        role: cls.teacher.role,
        powerLevel: cls.teacher.powerLevel,
        status: cls.teacher.status,
        createdAt: cls.teacher.createdAt,
        updatedAt: cls.teacher.updatedAt,
        emailVerified: cls.teacher.emailVerified,
        schoolId: cls.teacher.schoolId,
        teacherId: cls.teacher.teacherId,
        image: cls.teacher.image,
        avatar: cls.teacher.avatar,
        bio: cls.teacher.bio,
        subjects: cls.teacher.subjects,
        education: cls.teacher.education,
        experience: cls.teacher.experience,
        phoneNumber: cls.teacher.phoneNumber,
        officeHours: cls.teacher.officeHours,
      },
      students: cls.students.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        password: student.password,
        role: student.role,
        powerLevel: student.powerLevel,
        status: student.status,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
        emailVerified: student.emailVerified,
        schoolId: student.schoolId,
        teacherId: student.teacherId,
        image: student.image,
        avatar: student.avatar,
        bio: student.bio,
        subjects: student.subjects,
        education: student.education,
        experience: student.experience,
        phoneNumber: student.phoneNumber,
        officeHours: student.officeHours,
      })),
      classTeachers: cls.classTeachers.map(classTeacher => ({
        teacher: {
          id: classTeacher.teacher.id,
          name: classTeacher.teacher.name,
          email: classTeacher.teacher.email,
          password: classTeacher.teacher.password,
          role: classTeacher.teacher.role,
          powerLevel: classTeacher.teacher.powerLevel,
          status: classTeacher.teacher.status,
          createdAt: classTeacher.teacher.createdAt,
          updatedAt: classTeacher.teacher.updatedAt,
          emailVerified: classTeacher.teacher.emailVerified,
          schoolId: classTeacher.teacher.schoolId,
          teacherId: classTeacher.teacher.teacherId,
          image: classTeacher.teacher.image,
          avatar: classTeacher.teacher.avatar,
          bio: classTeacher.teacher.bio,
          subjects: classTeacher.teacher.subjects,
          education: classTeacher.teacher.education,
          experience: classTeacher.teacher.experience,
          phoneNumber: classTeacher.teacher.phoneNumber,
          officeHours: classTeacher.teacher.officeHours,
        }
      })),
      _count: {
        students: cls.students.length
      }
    }))
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch teachers
        const teachersResponse = await fetch(`/api/schooladmin/teachers?schoolId=${school.id}`);
        if (!teachersResponse.ok) throw new Error('Failed to fetch teachers');
        const teachersData = await teachersResponse.json();
        setTeachers(teachersData.map((teacher: User & { teachingClasses?: any[] }) => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          role: teacher.role,
          createdAt: teacher.createdAt,
          teachingClasses: teacher.teachingClasses?.map(cls => ({
            id: cls.id,
            name: cls.name,
            students: cls.students.map((student: User) => ({
              id: student.id,
              name: student.name,
              email: student.email
            }))
          }))
        })));

        // Fetch students
        const studentsResponse = await fetch(`/api/schooladmin/students?schoolId=${school.id}`);
        if (!studentsResponse.ok) throw new Error('Failed to fetch students');
        const studentsData = await studentsResponse.json();
        setStudents(studentsData.map((student: User & { enrolledClasses?: any[] }) => ({
          id: student.id,
          name: student.name,
          email: student.email,
          role: student.role,
          createdAt: student.createdAt,
          enrolledClasses: student.enrolledClasses?.map(cls => ({
            id: cls.id,
            name: cls.name,
            teacher: {
              id: cls.teacher.id,
              name: cls.teacher.name,
              email: cls.teacher.email
            }
          }))
        })));

        // Fetch classes
        const classesResponse = await fetch(`/api/schooladmin/classes?schoolId=${school.id}`);
        if (!classesResponse.ok) throw new Error('Failed to fetch classes');
        const classesData = await classesResponse.json();
        setClasses(classesData.map((cls: any) => ({
          id: cls.id,
          name: cls.name,
          description: cls.description === null ? undefined : cls.description,
          teacher: {
            id: cls.teacher.id,
            name: cls.teacher.name,
            email: cls.teacher.email
          },
          students: cls.students?.map((student: User) => ({
            id: student.id,
            name: student.name,
            email: student.email
          })),
          createdAt: cls.createdAt
        })));

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [school.id, toast]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const onTeachersChange = useCallback(async () => {
    try {
      const response = await fetch(`/api/schooladmin/teachers?schoolId=${school.id}`);
      if (!response.ok) throw new Error('Failed to fetch teachers');
      const data = await response.json();
      setTeachers(data.map((teacher: User & { teachingClasses?: any[] }) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        createdAt: teacher.createdAt,
        teachingClasses: teacher.teachingClasses?.map(cls => ({
          id: cls.id,
          name: cls.name,
          students: cls.students.map((student: User) => ({
            id: student.id,
            name: student.name,
            email: student.email
          }))
        }))
      })));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: "Error",
        description: "Failed to refresh teachers list",
        variant: "destructive",
      });
    }
  }, [school.id, toast]);

  const onStudentsChange = useCallback(async () => {
    try {
      const response = await fetch(`/api/schooladmin/students?schoolId=${school.id}`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data.map((student: User & { enrolledClasses?: any[] }) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        role: student.role,
        createdAt: student.createdAt,
        enrolledClasses: student.enrolledClasses?.map(cls => ({
          id: cls.id,
          name: cls.name,
          teacher: {
            id: cls.teacher.id,
            name: cls.teacher.name,
            email: cls.teacher.email
          }
        }))
      })));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to refresh students list",
        variant: "destructive",
      });
    }
  }, [school.id, toast]);

  const onClassesChange = useCallback(async () => {
    try {
      const response = await fetch(`/api/schooladmin/classes?schoolId=${school.id}`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        description: cls.description === null ? undefined : cls.description,
        teacher: {
          id: cls.teacher.id,
          name: cls.teacher.name,
          email: cls.teacher.email
        },
        students: cls.students?.map((student: User) => ({
          id: student.id,
          name: student.name,
          email: student.email
        })),
        createdAt: cls.createdAt
      })));
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Error",
        description: "Failed to refresh classes list",
        variant: "destructive",
      });
    }
  }, [school.id, toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                {school.name}
              </span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Button
                variant={activeTab === "overview" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={activeTab === "teachers" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("teachers")}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Teachers
              </Button>
              <Button
                variant={activeTab === "students" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("students")}
              >
                <Users className="mr-2 h-4 w-4" />
                Students
              </Button>
              <Button
                variant={activeTab === "classes" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("classes")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Classes
              </Button>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="space-y-4">
            {activeTab === "overview" && (
              <OverviewTab 
                school={overviewSchool}
              />
            )}

            {activeTab === "teachers" && (
              <TeachersTab
                teachers={teachers}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={school.id}
                onTeachersChange={onTeachersChange}
              />
            )}

            {activeTab === "students" && (
              <StudentsTab
                students={students}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={school.id}
                onStudentsChange={onStudentsChange}
              />
            )}

            {activeTab === "classes" && (
              <ClassesTab
                classes={classes}
                teachers={teachers}
                students={students}
                isLoading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                schoolId={school.id}
                onClassesChange={onClassesChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
