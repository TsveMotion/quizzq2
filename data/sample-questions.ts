import { Question } from "@/types/question";

export const sampleQuestions: Question[] = [
  {
    id: "1",
    question: "Explain the process of photosynthesis and its importance in the global ecosystem.",
    subject: "Biology",
    difficulty: "Medium",
    timeEstimate: "15 mins",
    isAIGenerated: true,
    answers: [
      "Photosynthesis is the process where plants convert sunlight into glucose, releasing oxygen as a byproduct. This process is crucial for maintaining oxygen levels and supporting life on Earth.",
      "Photosynthesis is when plants eat sunlight to grow bigger and produce oxygen for humans to breathe.",
      "Photosynthesis is a chemical reaction that occurs in plant cells where carbon dioxide and water are converted into glucose and oxygen using light energy.",
      "Photosynthesis is the process of plants converting carbon dioxide into oxygen during the day and reversing the process at night."
    ],
    correctAnswer: 2,
    explanation: "Photosynthesis is a complex chemical process that occurs in the chloroplasts of plant cells. During this process, light energy is used to convert carbon dioxide and water into glucose and oxygen. The glucose serves as food for the plant, while the oxygen is released into the atmosphere. This process is essential for life on Earth as it provides food for plants and oxygen for all aerobic organisms.",
    topics: ["Cell Biology", "Plant Science", "Biochemistry"],
    createdAt: new Date("2024-01-01")
  },
  {
    id: "2",
    question: "Solve the quadratic equation: 2x² + 5x - 12 = 0 using the quadratic formula.",
    subject: "Mathematics",
    difficulty: "Hard",
    timeEstimate: "10 mins",
    isAIGenerated: false,
    answers: [
      "x = -4 or x = 1.5",
      "x = -3 or x = 2",
      "x = -3.5 or x = 1.5",
      "x = -4.5 or x = 2"
    ],
    correctAnswer: 1,
    explanation: "Using the quadratic formula: x = [-b ± √(b² - 4ac)] / 2a\nWhere a = 2, b = 5, and c = -12\nx = [-5 ± √(25 - 4(2)(-12))] / 4\nx = [-5 ± √(25 + 96)] / 4\nx = [-5 ± √121] / 4\nx = [-5 ± 11] / 4\nx = (-5 + 11)/4 or (-5 - 11)/4\nx = 6/4 or -16/4\nx = 3/2 or -4\nTherefore, x = -3 or x = 2",
    topics: ["Algebra", "Quadratic Equations"],
    createdAt: new Date("2024-01-02")
  },
  {
    id: "3",
    question: "Discuss the causes and consequences of the Industrial Revolution in England.",
    subject: "History",
    difficulty: "Easy",
    timeEstimate: "20 mins",
    isAIGenerated: true,
    answers: [
      "The Industrial Revolution was solely caused by the invention of the steam engine and led to increased pollution.",
      "The Industrial Revolution was a period of rapid industrialization and urbanization, driven by technological innovations, agricultural improvements, and population growth.",
      "The Industrial Revolution happened because people wanted to make more money and resulted in better living conditions for everyone.",
      "The Industrial Revolution was a political movement that led to the rise of factories in England."
    ],
    correctAnswer: 1,
    explanation: "The Industrial Revolution in England (c. 1760-1840) was driven by multiple factors including technological innovations (like the steam engine and spinning jenny), agricultural improvements that increased food production, population growth, and availability of natural resources. Its consequences were far-reaching, including urbanization, the rise of factory systems, changes in social structure, improved transportation networks, and environmental impacts. While it led to economic growth and technological advancement, it also resulted in poor working conditions, child labor, and environmental pollution.",
    topics: ["Modern History", "Economic History", "Social Change"],
    createdAt: new Date("2024-01-03")
  },
  {
    id: "4",
    question: "Analyze the themes of power and corruption in George Orwell's 'Animal Farm'.",
    subject: "English",
    difficulty: "Medium",
    timeEstimate: "25 mins",
    isAIGenerated: false,
    answers: [
      "Animal Farm is just a simple story about animals taking over a farm.",
      "The book shows how power can corrupt through the gradual transformation of the pigs, particularly Napoleon, from revolutionary leaders to oppressive rulers.",
      "The story is about how animals are smarter than humans and should be in charge.",
      "The main theme is about farming techniques and animal husbandry."
    ],
    correctAnswer: 1,
    explanation: "In 'Animal Farm', Orwell uses allegory to explore how power corrupts. The pigs, especially Napoleon, initially lead a revolution based on ideals of equality and freedom. However, as they gain power, they gradually become more human-like and corrupt, eventually becoming indistinguishable from the human farmers they replaced. This transformation is shown through their adoption of human behaviors, changing of the Seven Commandments, and their eventual exploitation of the other animals. The story serves as a critique of the Soviet Union under Stalin and, more broadly, how power can corrupt revolutionary ideals.",
    topics: ["Literature Analysis", "Political Allegory", "Theme Analysis"],
    createdAt: new Date("2024-01-04")
  }
];
