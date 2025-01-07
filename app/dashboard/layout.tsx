import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  // Get the current path
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const userRole = session.user.role?.toLowerCase();

  // Verify user has access to the current dashboard
  if (currentPath.includes('/dashboard/')) {
    const requestedRole = currentPath.split('/dashboard/')[1]?.split('/')[0];
    if (requestedRole && userRole !== requestedRole.toLowerCase()) {
      // Redirect to the correct dashboard based on role
      switch (userRole) {
        case 'superadmin':
          redirect('/dashboard/superadmin');
        case 'schooladmin':
          redirect('/dashboard/schooladmin');
        case 'teacher':
          redirect('/dashboard/teacher');
        case 'student':
          redirect('/dashboard/student');
        default:
          redirect('/dashboard');
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
