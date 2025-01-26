'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  questions: Question[];
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/signin');
      return;
    }
    fetchQuiz();
  }, [session, params.id]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/${params.id}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }
      const data = await response.json();
      setQuiz(data);
      setAnswers(new Array(data.questions.length).fill(''));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(curr => curr + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(curr => curr - 1);
    }
  };

  const submitQuiz = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    if (answers.some(answer => !answer)) {
      toast({
        title: 'Incomplete Quiz',
        description: 'Please answer all questions before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/quiz/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const results = await response.json();
      setQuizResults(results);
      setShowResults(true);
      toast({
        title: 'Quiz Submitted',
        description: `You scored ${results.score.toFixed(1)}%!`,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading Quiz...</h2>
          <Progress value={33} className="w-[60vw]" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Quiz not found</h2>
          <Button onClick={() => router.push('/dashboard/user/quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              {quiz.title} - {quiz.topic}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">
                  Score: {quizResults?.score.toFixed(1)}%
                </h3>
                <Progress value={quizResults?.score} className="w-full" />
              </div>
              <div>
                <p className="text-lg">
                  Correct Answers: {quizResults?.correctAnswers} out of{' '}
                  {quizResults?.totalQuestions}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard/user/quizzes')}>
              Back to Quizzes
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Progress
              value={((currentQuestion + 1) / quiz.questions.length) * 100}
              className="w-full mb-4"
            />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {quiz.questions[currentQuestion].question}
              </h3>
              <RadioGroup
                value={answers[currentQuestion]}
                onValueChange={handleAnswer}
              >
                {quiz.questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={submitQuiz}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={!answers[currentQuestion]}
              >
                Next
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
