export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: QuizQuestion[];
  createdAt: Date;
  userId: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
  completedAt: Date;
}
