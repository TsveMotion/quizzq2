import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as jose from 'jose';
import MemberDashboard from '@/components/dashboard/MemberDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import SchoolAdminDashboard from '@/components/dashboard/SchoolAdminDashboard';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';

const JWT_SECRET = new TextEncoder().encode('your-super-secret-key-123');

export default async function DashboardPage() {
  const token = cookies().get('token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const user = payload;

    const DashboardComponent = {
      'member': MemberDashboard,
      'student': StudentDashboard,
      'teacher': TeacherDashboard,
      'schooladmin': SchoolAdminDashboard,
      'superadmin': SuperAdminDashboard,
    }[user.role as string] || MemberDashboard;

    return <DashboardComponent user={user} />;
  } catch (error) {
    console.error('Token verification failed:', error);
    redirect('/login');
  }
}
