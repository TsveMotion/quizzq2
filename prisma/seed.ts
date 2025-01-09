import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { seedQuizzes } from './quizSeed';

const prisma = new PrismaClient();

// Get superadmin credentials from environment variables
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'superadmin@quizzq.com';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'admin123';

async function main() {
  // Create superadmin user
  const hashedPassword = await bcryptjs.hash(SUPERADMIN_PASSWORD, 10);
  
  const superadmin = await prisma.user.upsert({
    where: {
      email: SUPERADMIN_EMAIL,
    },
    update: {
      password: hashedPassword,
      role: 'SUPERADMIN',
      powerLevel: 100,
      status: 'ACTIVE',
    },
    create: {
      email: SUPERADMIN_EMAIL,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPERADMIN',
      powerLevel: 100,
      status: 'ACTIVE',
    },
  });

  console.log('Seeded superadmin user:', superadmin);

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
      totalMarks: 100,
      class: {
        connect: {
          id: classObj?.id
        }
      },
      teacher: {
        connect: {
          id: teacher?.id
        }
      }
    },
    update: {
      title: 'Algebraic Puzzles Challenge',
      description: `Solve the following algebraic puzzles:

1. Find the value of x: 2x + 5 = 13
2. Solve the equation: 3(y - 2) = 15
3. If a + b = 10 and a - b = 4, find a and b

Show all your work and explain your reasoning for each step.`,
      dueDate: new Date('2025-01-12'),
      totalMarks: 100
    }
  });

  console.log('Assignment created/updated:', assignment);

  // Seed quizzes
  await seedQuizzes();

  // Create sample quizzes if not exist
  const existingQuizzes = await prisma.quiz.findMany();
  if (existingQuizzes.length === 0) {
    const sampleQuizzes = [
      {
        title: "JavaScript Fundamentals",
        description: "Test your knowledge of JavaScript basics including variables, functions, and control flow.",
        difficulty: "EASY",
        isPremium: false,
        published: true,
        totalQuestions: 10,
        timeLimit: 15
      },
      {
        title: "Advanced React Patterns",
        description: "Challenge yourself with advanced React concepts including hooks, context, and performance optimization.",
        difficulty: "HARD",
        isPremium: true,
        published: true,
        totalQuestions: 15,
        timeLimit: 30
      },
      {
        title: "CSS and Responsive Design",
        description: "Test your understanding of CSS layouts, flexbox, grid, and responsive design principles.",
        difficulty: "MEDIUM",
        isPremium: false,
        published: true,
        totalQuestions: 12,
        timeLimit: 20
      },
      {
        title: "TypeScript Essentials",
        description: "Learn and test your TypeScript knowledge including types, interfaces, and generics.",
        difficulty: "MEDIUM",
        isPremium: true,
        published: true,
        totalQuestions: 10,
        timeLimit: 20
      }
    ];

    for (const quiz of sampleQuizzes) {
      await prisma.quiz.create({ data: quiz });
    }
    console.log('Created sample quizzes');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
