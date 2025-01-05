import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import SchoolAdminDashboard from '@/components/dashboard/SchoolAdminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log('Initial session:', session);

  if (!session) {
    redirect('/auth/signin');
  }

  // For superadmin, we don't need to fetch additional user data
  if (session.user.role === 'superadmin') {
    return <SuperAdminDashboard user={session.user} />;
  }

  // Get user with school information for other roles
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      school: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              users: true
            }
          }
        }
      }
    }
  });

  console.log('Fetched user:', user);

  if (!user) {
    redirect('/auth/signin');
  }

  // For school admin, combine session data with school info
  if (user.role === 'schooladmin') {
    const schoolAdminData = {
      ...session.user,
      schoolId: user.schoolId, // Add schoolId explicitly
      school: user.school
    };
    console.log('School admin data:', schoolAdminData);
    return <SchoolAdminDashboard user={schoolAdminData} />;
  }

  // For other roles, pass the complete user data
  const userData = {
    ...user,
    schoolId: user.schoolId, // Add schoolId explicitly
    school: user.school
  };

  // Render the appropriate dashboard based on user role
  switch (user.role) {
    case 'teacher':
      return <TeacherDashboard user={userData} />;
    case 'student':
      return <StudentDashboard user={userData} />;
    default:
      redirect('/auth/signin');
  }
}
