import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SchoolAdminDashboard } from '@/components/dashboard/SchoolAdmin-Tabs/SchoolAdminDashboard';
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
      return { school: null };
    }

    const school = await prisma.school.findUnique({
      where: { id: currentUser.schoolId },
      select: {
        id: true,
        name: true,
        description: true,
        roleNumber: true,
        createdAt: true,
        updatedAt: true,
        users: {
          select: {
            id: true,
            teacherId: true,
            name: true,
            email: true,
            password: true,
            role: true,
            powerLevel: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
            schoolId: true,
            image: true,
            avatar: true,
            bio: true,
            subjects: true,
            education: true,
            experience: true,
            phoneNumber: true,
            officeHours: true,
          },
        },
        classes: {
          include: {
            teacher: {
              select: {
                id: true,
                teacherId: true,
                name: true,
                email: true,
                password: true,
                role: true,
                powerLevel: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                emailVerified: true,
                schoolId: true,
                image: true,
                avatar: true,
                bio: true,
                subjects: true,
                education: true,
                experience: true,
                phoneNumber: true,
                officeHours: true,
              },
            },
            classTeachers: {
              include: {
                teacher: {
                  select: {
                    id: true,
                    teacherId: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true,
                    powerLevel: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    emailVerified: true,
                    schoolId: true,
                    image: true,
                    avatar: true,
                    bio: true,
                    subjects: true,
                    education: true,
                    experience: true,
                    phoneNumber: true,
                    officeHours: true,
                  },
                },
              },
            },
            students: {
              select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
                powerLevel: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                emailVerified: true,
                schoolId: true,
                teacherId: true,
                image: true,
                avatar: true,
                bio: true,
                subjects: true,
                education: true,
                experience: true,
                phoneNumber: true,
                officeHours: true,
              },
            },
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
            classes: true,
          },
        },
      },
    });

    if (!school) {
      redirect('/dashboard');
    }

    return (
      <div className="h-full">
        <Suspense fallback={<LoadingSpinner />}>
          <SchoolAdminDashboard school={school} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error fetching school data:', error);
  }
}
