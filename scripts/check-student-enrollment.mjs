import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the class with the assignment
  const classWithAssignment = await prisma.class.findFirst({
    where: {
      assignments: {
        some: {
          title: 'Exploring Pi with Math Circles'
        }
      }
    },
    include: {
      students: true,
      assignments: {
        include: {
          questions: true
        }
      }
    }
  });

  console.log('Class details:', {
    id: classWithAssignment?.id,
    name: classWithAssignment?.name,
    numberOfStudents: classWithAssignment?.students.length,
    assignments: classWithAssignment?.assignments.map(a => ({
      id: a.id,
      title: a.title,
      questions: a.questions.length
    }))
  });

  // Get all students
  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT'
    },
    include: {
      enrolledClasses: {
        include: {
          assignments: true
        }
      }
    }
  });

  console.log('\nStudent enrollments:');
  for (const student of students) {
    console.log('\nStudent:', {
      id: student.id,
      email: student.email,
      classes: student.enrolledClasses.map(c => ({
        id: c.id,
        name: c.name,
        assignments: c.assignments.length
      }))
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
