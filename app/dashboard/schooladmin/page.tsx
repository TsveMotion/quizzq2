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

  if (!session?.user?.schoolId) {
    redirect('/auth/signin');
  }

  const school = await prisma.school.findUnique({
    where: {
      id: session.user.schoolId
    },
    include: {
      classes: {
        include: {
          teacher: true,
          students: true,
          classTeachers: {
            include: {
              teacher: true
            }
          }
        }
      },
      users: {
        where: {
          OR: [
            { role: "TEACHER" },
            { role: "STUDENT" }
          ]
        }
      }
    }
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
}
