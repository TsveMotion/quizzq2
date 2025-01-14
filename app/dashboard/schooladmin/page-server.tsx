import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ExtendedSchoolWithRelations, ExtendedUser } from '@/types';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth-config';

export async function getSchoolData() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'SCHOOLADMIN') {
    redirect('/auth/signin');
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      schoolId: true,
    },
  });

  if (!currentUser?.schoolId) {
    throw new Error('School not found');
  }

  const school = await prisma.school.findUnique({
    where: { id: currentUser.schoolId },
    include: {
      users: {
        where: {
          role: 'TEACHER'
        }
      },
      classes: {
        include: {
          teacher: true,
          classTeachers: {
            include: {
              teacher: true
            }
          },
          students: true,
          _count: {
            select: {
              assignments: true,
              students: true
            }
          }
        }
      },
      _count: {
        select: {
          users: true,
          classes: true
        }
      }
    }
  });

  if (!school) {
    throw new Error('School not found');
  }

  const transformedSchool = {
    ...school,
    classes: school.classes.map(cls => ({
      ...cls,
      teacher: cls.teacher as ExtendedUser,
      students: cls.students as ExtendedUser[],
      _count: {
        assignments: cls._count?.assignments || 0,
        quizzes: 0,
        students: cls.students.length
      }
    })),
    users: school.users as ExtendedUser[],
    _count: {
      users: school._count.users,
      classes: school._count.classes
    }
  };

  return transformedSchool as ExtendedSchoolWithRelations;
}
