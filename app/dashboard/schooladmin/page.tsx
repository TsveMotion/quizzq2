import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SchoolAdminDashboard } from '@/components/dashboard/SchoolAdmin-Tabs/SchoolAdminDashboard';
import { SchoolWithRelations } from '@/components/dashboard/SchoolAdmin-Tabs/types';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-config';

const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
  </div>
);

export default async function SchoolAdminPage() {
  const session = await getServerSession(authOptions);
  
  console.log('Session data:', JSON.stringify(session, null, 2));
  console.log('User role:', session?.user?.role);
  console.log('School ID:', session?.user?.schoolId);

  if (!session || session.user.role !== 'SCHOOLADMIN') {
    console.log('Redirecting: Invalid session or missing data');
    redirect('/auth/signin');
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        schoolId: true,
      },
    });

    if (!currentUser || !currentUser.schoolId) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">No School Assigned</h2>
            <p className="text-gray-600">Please contact an administrator to assign you to a school.</p>
          </div>
        </div>
      );
    }

    const school = await prisma.school.findUnique({
      where: { id: session.user.schoolId! },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        description: true,
        roleNumber: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zip: true,
        website: true,
        logo: true,
        createdAt: true,
        updatedAt: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            schoolId: true,
            teacherId: true,
            image: true,
            avatar: true,
            bio: true,
            subjects: true,
            experience: true,
            phoneNumber: true,
            education: true,
            officeHours: true
          }
        },
        classes: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            },
            students: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            },
            classTeachers: {
              select: {
                id: true,
                teacher: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                  }
                }
              }
            },
            _count: {
              select: {
                students: true,
                assignments: true,
                classTeachers: true
              }
            }
          }
        },
        _count: {
          select: {
            users: true,
            classes: true
          }
        }
      }
    });

    if (!school) {
      return null;
    }

    const teacherCount = school.users.filter(user => user.role.toUpperCase() === 'TEACHER').length;
    const studentCount = school.users.filter(user => user.role.toUpperCase() === 'STUDENT').length;

    const schoolData: SchoolWithRelations = {
      ...school,
      users: school.users.map(user => ({
        ...user,
        password: '',  // We don't want to expose the password
        powerLevel: 1, // Default power level
        emailVerified: null,
        role: user.role || 'USER',
        status: user.status || 'ACTIVE'
      })),
      classes: school.classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        description: cls.description,
        schoolId: school.id,
        teacherId: cls.teacher.id,
        createdAt: cls.createdAt,
        updatedAt: cls.updatedAt,
        classTeachers: cls.classTeachers.map(ct => ({
          id: ct.id,
          classId: cls.id,
          teacherId: ct.teacher.id,
          createdAt: cls.createdAt,
          updatedAt: cls.updatedAt,
          teacher: {
            id: ct.teacher.id,
            name: ct.teacher.name,
            email: ct.teacher.email,
            role: ct.teacher.role
          }
        })),
        teacher: {
          id: cls.teacher.id,
          name: cls.teacher.name,
          email: cls.teacher.email,
          role: cls.teacher.role
        },
        students: cls.students.map(student => ({
          id: student.id,
          name: student.name,
          email: student.email,
          role: student.role
        })),
        _count: {
          assignments: 0,
          quizzes: 0,
          students: cls.students.length
        }
      }))
    };

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen bg-background">
          <SchoolAdminDashboard school={schoolData} />
        </div>
      </Suspense>
    );

  } catch (error) {
    console.error('Error fetching school data:', error);
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-600">An error occurred while loading the dashboard. Please try again later.</p>
        </div>
      </div>
    );
  }
}
