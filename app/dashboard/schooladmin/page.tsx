'use server';

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { ExtendedUser, ExtendedSchoolWithRelations, ClassWithTeacher } from '@/types';
import { SchoolAdminDashboard } from '@/components/dashboard/SchoolAdmin-Tabs/SchoolAdminDashboard';

export default async function SchoolAdminPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect('/auth/signin');
  }

  if (!session.user.schoolId) {
    redirect('/');
  }

  try {
    const schoolData = await prisma.school.findUnique({
      where: {
        id: session.user.schoolId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            email_verified: true,
            image: true,
            role: true,
            status: true,
            schoolId: true,
            teacherId: true,
            powerLevel: true,
            isPro: true,
            proSubscriptionId: true,
            proExpiresAt: true,
            proType: true,
            proStatus: true,
            proPlan: true,
            proPlanId: true,
            proPlanName: true,
            proPlanPrice: true,
            proPlanCurrency: true,
            proPlanInterval: true,
            proPlanTrialPeriodDays: true,
            proPlanIsActive: true,
            proPlanIsTrial: true,
            proPlanStartedAt: true,
            proPlanEndedAt: true,
            subscriptionPlan: true,
            aiDailyUsage: true,
            aiMonthlyUsage: true,
            aiLifetimeUsage: true,
            aiLastResetDate: true,
            createdAt: true,
            updatedAt: true
          }
        },
        classes: {
          include: {
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
            _count: {
              select: {
                assignments: true,
                quizzes: true,
                students: true
              }
            }
          }
        }
      }
    });

    if (!schoolData) {
      redirect('/');
    }

    const users = schoolData.users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'INACTIVE',
      image: user.image,
      powerLevel: user.powerLevel,
      email_verified: user.email_verified,
      schoolId: user.schoolId,
      teacherId: user.teacherId,
      proStatus: user.proStatus,
      proPlanIsActive: user.proPlanIsActive,
      proPlanIsTrial: user.proPlanIsTrial,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    const classes = schoolData.classes.map((classData: any) => ({
      id: classData.id,
      name: classData.name,
      description: classData.description,
      teacher: classData.teacher ? {
        id: classData.teacher.id,
        name: classData.teacher.name,
        email: classData.teacher.email,
        role: classData.teacher.role,
      } : null,
      createdAt: classData.createdAt,
      updatedAt: classData.updatedAt
    }));

    const school: ExtendedSchoolWithRelations = {
      ...schoolData,
      users,
      classes,
      _count: schoolData._count,
    };

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SchoolAdminDashboard school={school} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in SchoolAdminPage:', error);
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-600">An error occurred while loading the dashboard.</p>
        </div>
      </div>
    );
  }
}
