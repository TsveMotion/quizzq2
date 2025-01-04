import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MemberDashboard from '@/components/dashboard/MemberDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import SchoolAdminDashboard from '@/components/dashboard/SchoolAdminDashboard';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import { verifyAuthEdge } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const token = cookies().get('token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  try {
    const tokenData = await verifyAuthEdge(token);
    console.log('Token data in dashboard:', tokenData);

    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      include: { school: true }
    });

    if (!user) {
      console.error('User not found:', tokenData.userId);
      redirect('/login');
    }

    console.log('User data in dashboard:', {
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId
    });

    const DashboardComponent = {
      'member': MemberDashboard,
      'student': StudentDashboard,
      'teacher': TeacherDashboard,
      'schooladmin': SchoolAdminDashboard,
      'superadmin': SuperAdminDashboard,
    }[user.role] || MemberDashboard;

    return <DashboardComponent user={user} />;
  } catch (error) {
    console.error('Token verification failed:', error);
    redirect('/login');
  }
}
