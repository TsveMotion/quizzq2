'use server';

import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ExtendedUser, ExtendedSchoolWithRelations, ClassWithTeacher } from '@/types';
import { SchoolAdminDashboard } from '@/components/dashboard/SchoolAdmin-Tabs/SchoolAdminDashboard';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-config';

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

    const schoolData = await prisma.school.findUnique({
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

    if (!schoolData) {
      redirect('/dashboard');
    }

    const teacherCount = schoolData.users.filter((user: any) => user.role.toUpperCase() === 'TEACHER').length;
    const studentCount = schoolData.users.filter((user: any) => user.role.toUpperCase() === 'STUDENT').length;

    const users = schoolData.users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'INACTIVE',
      powerLevel: user.powerLevel || 0,
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
      isPro: user.isPro || false,
      subscriptionStatus: user.proStatus || 'inactive',
      subscriptionPlan: user.proPlan || 'free',
      subscriptionId: user.proSubscriptionId || null,
      subscriptionEndDate: user.proExpiresAt || null
    })) as ExtendedUser[];

    const classes = schoolData.classes.map((cls: any) => ({
      ...cls,
      students: [],
      _count: {
        assignments: 0,
        quizzes: 0,
        students: 0
      }
    })) as ClassWithTeacher[];

    const schoolWithUsers: ExtendedSchoolWithRelations = {
      ...schoolData,
      users,
      classes,
      _count: {
        users: schoolData._count?.users || 0,
        classes: schoolData._count?.classes || 0
      }
    };

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SchoolAdminDashboard school={schoolWithUsers} />
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
