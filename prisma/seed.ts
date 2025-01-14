import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { main as seedQuizzes } from './quizSeed';

const prisma = new PrismaClient();

// Get superadmin credentials from environment variables
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'superadmin@quizzq.com';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'admin123';

async function main() {
  // Create superadmin user
  const hashedPassword = await hash(SUPERADMIN_PASSWORD, 10);
  
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
    const teacherPassword = await hash("teacher123", 10);
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
    const studentPassword = await hash("student123", 10);
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
    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      throw new Error('Default user not found');
    }

    const sampleQuizzes = [
      {
        title: "JavaScript Fundamentals",
        topic: "JavaScript",
        description: "Test your knowledge of JavaScript basics including variables, functions, and control flow.",
        difficulty: "EASY",
        isPremium: false,
        published: true,
        totalQuestions: 10,
        timeLimit: 15,
        questions: [
          {
            question: "What is the syntax for declaring a variable in JavaScript?",
            options: ["var x = 10", "let x = 10", "const x = 10", "x = 10"],
            correctAnswer: "let x = 10",
            explanation: "The correct syntax for declaring a variable in JavaScript is 'let x = 10'."
          },
          {
            question: "What is the purpose of the 'this' keyword in JavaScript?",
            options: ["To refer to the global object", "To refer to the current object", "To refer to the parent object", "To refer to the child object"],
            correctAnswer: "To refer to the current object",
            explanation: "The 'this' keyword in JavaScript refers to the current object."
          }
        ]
      },
      {
        title: "Advanced React Patterns",
        topic: "React",
        description: "Challenge yourself with advanced React concepts including hooks, context, and performance optimization.",
        difficulty: "HARD",
        isPremium: true,
        published: true,
        totalQuestions: 15,
        timeLimit: 30,
        questions: [
          {
            question: "What is the purpose of the 'useContext' hook in React?",
            options: ["To manage state", "To manage props", "To manage context", "To manage effects"],
            correctAnswer: "To manage context",
            explanation: "The 'useContext' hook in React is used to manage context."
          },
          {
            question: "What is the purpose of the 'useEffect' hook in React?",
            options: ["To manage state", "To manage props", "To manage context", "To manage side effects"],
            correctAnswer: "To manage side effects",
            explanation: "The 'useEffect' hook in React is used to manage side effects."
          }
        ]
      },
      {
        title: "CSS and Responsive Design",
        topic: "CSS",
        description: "Test your understanding of CSS layouts, flexbox, grid, and responsive design principles.",
        difficulty: "MEDIUM",
        isPremium: false,
        published: true,
        totalQuestions: 12,
        timeLimit: 20,
        questions: [
          {
            question: "What is the purpose of the 'flex' property in CSS?",
            options: ["To create a flexible box layout", "To create a grid layout", "To create a table layout", "To create a block layout"],
            correctAnswer: "To create a flexible box layout",
            explanation: "The 'flex' property in CSS is used to create a flexible box layout."
          },
          {
            question: "What is the purpose of the 'grid' property in CSS?",
            options: ["To create a flexible box layout", "To create a grid layout", "To create a table layout", "To create a block layout"],
            correctAnswer: "To create a grid layout",
            explanation: "The 'grid' property in CSS is used to create a grid layout."
          }
        ]
      },
      {
        title: "TypeScript Essentials",
        topic: "TypeScript",
        description: "Learn and test your TypeScript knowledge including types, interfaces, and generics.",
        difficulty: "MEDIUM",
        isPremium: true,
        published: true,
        totalQuestions: 10,
        timeLimit: 20,
        questions: [
          {
            question: "What is the purpose of the 'interface' keyword in TypeScript?",
            options: ["To define a type", "To define an interface", "To define a class", "To define a function"],
            correctAnswer: "To define an interface",
            explanation: "The 'interface' keyword in TypeScript is used to define an interface."
          },
          {
            question: "What is the purpose of the 'type' keyword in TypeScript?",
            options: ["To define a type", "To define an interface", "To define a class", "To define a function"],
            correctAnswer: "To define a type",
            explanation: "The 'type' keyword in TypeScript is used to define a type."
          }
        ]
      }
    ];

    for (const quiz of sampleQuizzes) {
      const questions = quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }));

      await prisma.quiz.create({
        data: {
          title: quiz.title,
          topic: quiz.topic,
          description: quiz.description,
          difficulty: quiz.difficulty,
          isPremium: quiz.isPremium,
          published: quiz.published,
          totalQuestions: quiz.totalQuestions,
          timeLimit: quiz.timeLimit,
          user: {
            connect: { id: defaultUser.id }
          },
          questions: {
            create: questions
          }
        }
      });
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
