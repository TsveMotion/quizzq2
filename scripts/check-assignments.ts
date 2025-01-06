import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get all assignments
  const assignments = await prisma.assignment.findMany({
    include: {
      class: {
        include: {
          students: true
        }
      },
      questions: true
    }
  });

  console.log('Total assignments:', assignments.length);
  
  for (const assignment of assignments) {
    console.log('\nAssignment:', {
      id: assignment.id,
      title: assignment.title,
      classId: assignment.classId,
      studentsInClass: assignment.class.students.length,
      numberOfQuestions: assignment.questions.length
    });
  }

  // Get all students and their classes
  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT'
    },
    include: {
      enrolledClasses: true
    }
  });

  console.log('\nTotal students:', students.length);
  
  for (const student of students) {
    console.log('\nStudent:', {
      id: student.id,
      email: student.email,
      numberOfClasses: student.enrolledClasses.length
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
