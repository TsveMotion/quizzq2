import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const quizzes = [
  // English Language
  {
    title: "Grammar Fundamentals",
    description: "Test your knowledge of basic English grammar",
    subject: "English Language",
    topic: "Grammar",
    difficulty: "EASY",
    isPremium: false,
    published: true,
    totalQuestions: 3,
    timeLimit: 10,
    questions: [
      {
        question: "Which sentence uses the correct form of 'their/there/they're'?",
        options: [
          "Their going to the store.",
          "They're going to the store.",
          "There going to the store.",
          "Theyre going to the store."
        ],
        correctAnswer: "They're going to the store.",
        explanation: "'They're' is the contraction of 'they are'",
        order: 1
      },
      {
        question: "What is the past tense of 'run'?",
        options: ["runned", "ran", "runed", "running"],
        correctAnswer: "ran",
        explanation: "'Ran' is the correct past tense form of 'run'",
        order: 2
      },
      {
        question: "Which sentence is punctuated correctly?",
        options: [
          "The cat sat on the mat it was happy.",
          "The cat sat on the mat, it was happy.",
          "The cat sat on the mat; it was happy.",
          "The cat sat on the mat... it was happy."
        ],
        correctAnswer: "The cat sat on the mat; it was happy.",
        explanation: "A semicolon correctly joins two related independent clauses",
        order: 3
      }
    ]
  },
  // English Literature
  {
    title: "Shakespeare's Macbeth",
    description: "Test your knowledge of Macbeth's key themes and characters",
    subject: "English Literature",
    topic: "Shakespeare",
    difficulty: "MEDIUM",
    isPremium: true,
    published: true,
    totalQuestions: 3,
    timeLimit: 15,
    questions: [
      {
        question: "What is the main theme of Macbeth?",
        options: [
          "Love and romance",
          "Ambition and its corrupting influence",
          "Family relationships",
          "Social class differences"
        ],
        correctAnswer: "Ambition and its corrupting influence",
        explanation: "The play primarily explores how ambition leads to Macbeth's moral decline",
        order: 1
      },
      {
        question: "Who kills Macbeth in the end?",
        options: ["Banquo", "Duncan", "Macduff", "Malcolm"],
        correctAnswer: "Macduff",
        explanation: "Macduff kills Macbeth, fulfilling the prophecy about 'not of woman born'",
        order: 2
      },
      {
        question: "What does Lady Macbeth do in her sleepwalking scene?",
        options: [
          "Dances and sings",
          "Tries to wash imaginary blood from her hands",
          "Calls for her children",
          "Prays for forgiveness"
        ],
        correctAnswer: "Tries to wash imaginary blood from her hands",
        explanation: "This scene shows her guilt over the murders, trying to wash away imaginary blood",
        order: 3
      }
    ]
  },
  // Mathematics - Algebra
  {
    title: "Basic Algebra",
    description: "Practice fundamental algebraic concepts",
    subject: "Mathematics",
    topic: "Algebra",
    difficulty: "MEDIUM",
    isPremium: false,
    published: true,
    totalQuestions: 3,
    timeLimit: 15,
    questions: [
      {
        question: "Solve for x: 2x + 5 = 13",
        options: ["x = 4", "x = 3", "x = 5", "x = 6"],
        correctAnswer: "x = 4",
        explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
        order: 1
      },
      {
        question: "Simplify: 3(x + 2) - 2x",
        options: ["x + 6", "x + 4", "5x + 6", "x + 2"],
        correctAnswer: "x + 6",
        explanation: "3(x + 2) = 3x + 6, then -2x = x + 6",
        order: 2
      },
      {
        question: "What is the slope of the line y = 2x + 3?",
        options: ["3", "2", "1", "0"],
        correctAnswer: "2",
        explanation: "In the equation y = mx + b, m represents the slope",
        order: 3
      }
    ]
  },
  // Computer Science
  {
    title: "Python Programming Basics",
    description: "Learn fundamental Python programming concepts",
    subject: "Computer Science",
    topic: "Programming",
    difficulty: "EASY",
    isPremium: false,
    published: true,
    totalQuestions: 3,
    timeLimit: 10,
    questions: [
      {
        question: "What is the output of: print(type([1, 2, 3]))",
        options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'set'>"],
        correctAnswer: "<class 'list'>",
        explanation: "In Python, [1, 2, 3] creates a list object",
        order: 1
      },
      {
        question: "Which of these is a valid Python variable name?",
        options: ["1variable", "_variable", "variable-name", "class"],
        correctAnswer: "_variable",
        explanation: "Variable names can start with underscore but not with numbers or special characters",
        order: 2
      },
      {
        question: "What does the len() function return for a string?",
        options: [
          "The number of characters",
          "The number of words",
          "The memory size",
          "The number of lines"
        ],
        correctAnswer: "The number of characters",
        explanation: "len() returns the number of characters in a string, including spaces",
        order: 3
      }
    ]
  },
  // Science - Physics
  {
    title: "Forces and Motion",
    description: "Understanding Newton's Laws",
    subject: "Physics",
    topic: "Forces",
    difficulty: "MEDIUM",
    isPremium: false,
    published: true,
    totalQuestions: 3,
    timeLimit: 10,
    questions: [
      {
        question: "What is Newton's First Law of Motion?",
        options: [
          "F = ma",
          "An object in motion stays in motion unless acted upon by an external force",
          "Every action has an equal and opposite reaction",
          "Force equals mass times acceleration squared"
        ],
        correctAnswer: "An object in motion stays in motion unless acted upon by an external force",
        explanation: "This is the law of inertia",
        order: 1
      },
      {
        question: "What is the unit of force in the SI system?",
        options: ["Watt", "Newton", "Joule", "Pascal"],
        correctAnswer: "Newton",
        explanation: "The Newton (N) is the SI unit of force",
        order: 2
      },
      {
        question: "Calculate the force needed to accelerate a 2kg mass at 3 m/s²",
        options: ["4N", "5N", "6N", "7N"],
        correctAnswer: "6N",
        explanation: "Using F = ma: 2kg × 3m/s² = 6N",
        order: 3
      }
    ]
  },
  // Geography
  {
    title: "Climate and Weather",
    description: "Understanding global climate patterns",
    subject: "Geography",
    topic: "Climate",
    difficulty: "MEDIUM",
    isPremium: true,
    published: true,
    totalQuestions: 3,
    timeLimit: 10,
    questions: [
      {
        question: "What causes the seasons?",
        options: [
          "The Earth's distance from the sun",
          "The Earth's tilt and revolution around the sun",
          "The rotation of the Earth",
          "The moon's gravitational pull"
        ],
        correctAnswer: "The Earth's tilt and revolution around the sun",
        explanation: "The 23.5-degree tilt of Earth's axis causes seasons as it orbits the sun",
        order: 1
      },
      {
        question: "Which climate zone is found at the equator?",
        options: ["Tropical", "Temperate", "Polar", "Mediterranean"],
        correctAnswer: "Tropical",
        explanation: "The equator receives direct sunlight year-round, creating a tropical climate",
        order: 2
      },
      {
        question: "What is the main cause of ocean currents?",
        options: [
          "Moon's gravity",
          "Wind patterns and Earth's rotation",
          "Underwater volcanoes",
          "Temperature differences"
        ],
        correctAnswer: "Wind patterns and Earth's rotation",
        explanation: "Surface ocean currents are mainly driven by global wind patterns and the Coriolis effect",
        order: 3
      }
    ]
  }
];

async function seedQuizzes() {
  console.log('Start seeding quizzes...');
  
  for (const quizData of quizzes) {
    const { questions, ...quizInfo } = quizData;
    
    const quiz = await prisma.quiz.create({
      data: {
        ...quizInfo,
        questions: {
          create: questions.map(q => ({
            ...q,
            options: JSON.stringify(q.options)
          }))
        }
      }
    });
    
    console.log(`Created quiz with id: ${quiz.id}`);
  }
  
  console.log('Seeding quizzes finished.');
}

export { seedQuizzes };
