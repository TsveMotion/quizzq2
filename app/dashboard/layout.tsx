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
    
    // Special roles get their own dashboards
    if (['superadmin', 'schooladmin', 'teacher'].includes(userRole)) {
      const correctPath = `/dashboard/${userRole}`;
      if (!currentPath.startsWith(correctPath)) {
        redirect(correctPath);
      }
    } else {
      // All other users go to /dashboard/user
      if (!currentPath.startsWith('/dashboard/user')) {
        redirect('/dashboard/user');
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
