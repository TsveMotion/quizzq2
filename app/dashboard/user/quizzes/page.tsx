'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Trophy, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Quiz, QuizAttempt } from '@/types/quiz';
import { useRouter } from 'next/navigation';

const YEAR_OPTIONS = [
  { value: 'year7', label: 'Year 7' },
  { value: 'year8', label: 'Year 8' },
  { value: 'year9', label: 'Year 9' },
  { value: 'year10', label: 'Year 10' },
  { value: 'year11', label: 'Year 11' },
  { value: 'year12', label: 'Year 12' },
  { value: 'year13', label: 'Year 13' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const SUBJECT_OPTIONS = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'english', label: 'English' },
  { value: 'science', label: 'Science' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'computer_science', label: 'Computer Science' },
];

export default function QuizzesPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [dailyQuizCount, setDailyQuizCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz parameters
  const [selectedYear, setSelectedYear] = useState('year10');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [questionCount, setQuestionCount] = useState(5);

  const router = useRouter();

  useEffect(() => {
    fetchQuizzes();
    fetchAttempts();
  }, [session]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quizzes', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      const data = await response.json();
      setQuizzes(data.quizzes || []);
      setDailyQuizCount(data.dailyCount || 0);
      setError(null);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Failed to load quizzes. Please try again later.');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await fetch('/api/quiz-attempts', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch attempts');
      }
      const data = await response.json();
      setAttempts(data || []);
    } catch (error) {
      console.error('Failed to fetch attempts:', error);
      setAttempts([]);
    }
  };

  const generateNewQuiz = async () => {
    if (dailyQuizCount >= 5) {
      toast({
        title: 'Daily Limit Reached',
        description: 'You can only generate 5 quizzes per day. Try again tomorrow!',
        variant: 'destructive',
      });
      return;
    }

    setGeneratingQuiz(true);
    try {
      const response = await fetch('/api/quizzes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          subject: selectedSubject,
          difficulty: selectedDifficulty,
          year: selectedYear,
          questionCount: questionCount,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }
      
      const data = await response.json();
      toast({
        title: 'Quiz Generated',
        description: 'Your new quiz is ready!',
      });
      fetchQuizzes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchQuizzes}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-64 pr-4 py-8"> {/* Added left padding to account for navbar */}
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI-Generated Quizzes</h1>
            <p className="text-gray-300">Challenge yourself with personalized quizzes</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300 mb-1">Daily Quiz Generation</p>
            <div className="flex items-center space-x-2">
              <Progress value={(dailyQuizCount / 5) * 100} className="w-32" />
              <span className="text-sm text-gray-300">{dailyQuizCount}/5 quizzes generated</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-lg">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={questionCount.toString()} 
            onValueChange={(value) => setQuestionCount(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Number of Questions" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Questions
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          onClick={generateNewQuiz}
          disabled={generatingQuiz || dailyQuizCount >= 5}
        >
          <BrainCircuit className="w-6 h-6" />
          <span>{generatingQuiz ? 'Generating Quiz...' : 'Generate New Quiz'}</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                <CardDescription>
                  Topic: {quiz.topic}
                  <br />
                  Difficulty: {quiz.difficulty}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {quiz.questions.length} questions
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  className="w-full"
                  onClick={() => router.push(`/dashboard/user/quiz/${quiz.id}`)}
                >
                  Take Quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
