import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

// Get superadmin credentials from environment variables
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'superadmin@quizzq.com';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'admin123';

async function main() {
  // Create superadmin if not exists
  const existingSuperadmin = await prisma.user.findFirst({
    where: { email: SUPERADMIN_EMAIL }
  });
  if (!existingSuperadmin) {
    const hashedPassword = await bcryptjs.hash(SUPERADMIN_PASSWORD, 10);
    await prisma.user.create({
      data: {
        email: SUPERADMIN_EMAIL,
        password: hashedPassword,
        name: "Super Admin",
        role: "SUPERADMIN",
        powerLevel: 5,
        status: "ACTIVE"
      }
    });
  }

  // Create a school if not exists
  const existingSchool = await prisma.school.findFirst();
  let school = existingSchool;
  if (!existingSchool) {
    school = await prisma.school.create({
      data: {
        name: "Demo School",
        roleNumber: "DEMO123",
        description: "A demo school for testing"
      }
    });
  }

  // Create a teacher if not exists
  const existingTeacher = await prisma.user.findFirst({
    where: { role: "TEACHER" }
  });
  let teacher = existingTeacher;
  if (!existingTeacher) {
    const teacherPassword = await bcryptjs.hash("teacher123", 10);
    teacher = await prisma.user.create({
      data: {
        email: "teacher@quizzq.com",
        password: teacherPassword,
        name: "Test Teacher",
        role: "TEACHER",
        powerLevel: 3,
        status: "ACTIVE",
        schoolId: school?.id
      }
    });
  }

  // Create a class if not exists
  const existingClass = await prisma.class.findFirst();
  let classObj = existingClass;
  if (!existingClass && teacher && school) {
    classObj = await prisma.class.create({
      data: {
        name: "Demo Class",
        description: "A demo class for testing",
        schoolId: school.id,
        teacherId: teacher.id,
        classTeachers: {
          create: {
            teacherId: teacher.id
          }
        }
      }
    });
  }

  // Create a student if not exists
  const existingStudent = await prisma.user.findFirst({
    where: { role: "STUDENT" }
  });
  if (!existingStudent && school) {
    const studentPassword = await bcryptjs.hash("student123", 10);
    await prisma.user.create({
      data: {
        email: "student@quizzq.com",
        password: studentPassword,
        name: "Test Student",
        role: "STUDENT",
        powerLevel: 1,
        status: "ACTIVE",
        schoolId: school.id,
        teacherId: teacher?.id
      }
    });
  }

  // Enroll student in class if not already enrolled
  if (classObj && existingStudent) {
    await prisma.class.update({
      where: { id: classObj.id },
      data: {
        students: {
          connect: {
            id: existingStudent.id
          }
        }
      }
    });
  }

  // Create a test assignment
  const assignment = await prisma.assignment.upsert({
    where: {
      id: 'test-assignment-1'
    },
    create: {
      id: 'test-assignment-1',
      title: 'Algebraic Puzzles Challenge',
      description: `Solve the following algebraic puzzles:

1. Find the value of x: 2x + 5 = 13
2. Solve the equation: 3(y - 2) = 15
3. If a + b = 10 and a - b = 4, find a and b

Show all your work and explain your reasoning for each step.`,
      dueDate: new Date('2025-01-12'),
      class: {
        connect: {
          id: classObj?.id
        }
      },
      teacher: {
        connect: {
          id: teacher?.id
        }
      },
      attachments: {
        create: [
          {
            fileName: 'puzzle_guide.pdf',
            fileType: 'application/pdf',
            url: 'https://example.com/files/puzzle_guide.pdf'
          }
        ]
      }
    },
    update: {
      description: `Solve the following algebraic puzzles:

1. Find the value of x: 2x + 5 = 13
2. Solve the equation: 3(y - 2) = 15
3. If a + b = 10 and a - b = 4, find a and b

Show all your work and explain your reasoning for each step.`,
      dueDate: new Date('2025-01-12')
    }
  });

  console.log('Assignment created/updated:', assignment);

  // Log the class enrollment status
  const updatedClass = await prisma.class.findFirst({
    where: { id: classObj?.id },
    include: {
      students: true
    }
  });
  console.log('Class enrollment:', {
    className: updatedClass?.name,
    studentCount: updatedClass?.students.length,
    students: updatedClass?.students.map(s => ({ id: s.id, name: s.name }))
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
