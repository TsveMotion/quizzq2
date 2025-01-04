import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import SchoolAdminDashboard from '@/components/dashboard/SchoolAdminDashboard';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import { options } from '../api/auth/[...nextauth]/options';

export default async function DashboardPage() {
  const session = await getServerSession(options);

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Get full user data from database
  const user = await db.user.findUnique({
    where: { 
      id: session.user.id 
    },
    include: { 
      school: true,
      teacherOf: {
        include: {
          students: true,
          assignments: {
            include: {
              questions: true,
              submissions: {
                include: {
                  student: true
                }
              }
            }
          }
        }
      },
      enrolledIn: {
        include: {
          teacher: true,
          assignments: {
            include: {
              questions: true,
              submissions: {
                include: {
                  student: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) {
    console.error('User not found:', session.user.id);
    redirect('/login');
  }

  // Return the appropriate dashboard component based on user role
  switch (user.role) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'schooladmin':
      return <SchoolAdminDashboard user={user} />;
    case 'teacher':
      return <TeacherDashboard user={user} />;
    case 'student':
    default:
      return <StudentDashboard user={user} />;
  }
}
