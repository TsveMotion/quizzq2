export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Subject = 'Mathematics' | 'English' | 'Biology' | 'History' | 'Physics' | 'Chemistry';

export interface Question {
  id: string;
  question: string;
  subject: Subject;
  difficulty: Difficulty;
  timeEstimate: string;
  isAIGenerated: boolean;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  topics: string[];
  createdAt: Date;
}
