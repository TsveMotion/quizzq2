import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SchoolAdminDashboard } from '@/components/dashboard/SchoolAdmin-Tabs/SchoolAdminDashboard';
import { User, School } from "@prisma/client";
import { SchoolWithRelations, ClassWithTeacher } from '@/components/dashboard/SchoolAdmin-Tabs/types';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-config';

interface ExtendedUser extends User {
  status: string;
  emailVerified: Date | null;
  powerLevel: number;
  proStatus: string;
  proPlan: string | null;
  proPlanId: string | null;
  proPlanName: string | null;
  proPlanPrice: number | null;
  proPlanCurrency: string | null;
  proPlanInterval: string | null;
  proPlanTrialPeriodDays: number | null;
  proPlanIsActive: boolean;
  proPlanIsTrial: boolean;
  proPlanStartedAt: Date | null;
  proPlanEndedAt: Date | null;
}

interface ExtendedSchoolWithRelations extends School {
  users: ExtendedUser[];
  classes: ClassWithTeacher[];
  _count: {
    users: number;
    classes: number;
  };
}

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
      where: { id: session.user.schoolId ?? '' },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            image: true,
            powerLevel: true,
            emailVerified: true,
            schoolId: true,
            teacherId: true,
            avatar: true,
            bio: true,
            proStatus: true,
            proPlanIsActive: true,
            proPlanIsTrial: true,
            createdAt: true,
            updatedAt: true,
            password: false
          }
        },
        classes: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              }
            }
          }
        },
        _count: {
          select: {
            users: true,
            classes: true,
          }
        }
      }
    });

    if (!school) {
      redirect('/dashboard');
    }

    const teacherCount = school.users.filter((user: any) => user.role.toUpperCase() === 'TEACHER').length;
    const studentCount = school.users.filter((user: any) => user.role.toUpperCase() === 'STUDENT').length;

    const schoolData: ExtendedSchoolWithRelations = {
      ...school,
      users: school?.users.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '', // We don't expose the actual password
        role: user.role,
        powerLevel: user.powerLevel || 0,
        status: user.status || 'INACTIVE',
        emailVerified: user.emailVerified || null,
        image: user.image || null,
        schoolId: user.schoolId || null,
        teacherId: user.teacherId || null,
        avatar: user.avatar || null,
        bio: user.bio || null,
        subjects: user.subjects || [],
        education: user.education || '',
        experience: user.experience || '',
        phoneNumber: user.phoneNumber || '',
        officeHours: user.officeHours || '',
        isPro: false,
        proSubscriptionId: null,
        proExpiresAt: null,
        proType: null,
        proStatus: user.proStatus || 'INACTIVE',
        proPlan: null,
        proPlanId: null,
        proPlanName: null,
        proPlanPrice: null,
        proPlanCurrency: null,
        proPlanInterval: null,
        proPlanTrialPeriodDays: null,
        proPlanIsActive: !!user.proPlanIsActive,
        proPlanIsTrial: !!user.proPlanIsTrial,
        proPlanStartedAt: null,
        proPlanEndedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })) || [],
      classes: school?.classes.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        description: cls.description,
        schoolId: cls.schoolId,
        teacherId: cls.teacherId,
        createdAt: cls.createdAt,
        updatedAt: cls.updatedAt,
        teacher: cls.teacher,
        students: [],
        classTeachers: [],
        _count: {
          assignments: 0,
          quizzes: 0,
          students: 0
        }
      })) || [],
      _count: {
        users: school?._count?.users || 0,
        classes: school?._count?.classes || 0
      },
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
