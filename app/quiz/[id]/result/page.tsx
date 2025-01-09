'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface QuestionResult {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
  order: number;
}

interface QuizResult {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  questions: QuestionResult[];
}

export default function QuizResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/quiz/${params.id}/result`);
        if (!response.ok) throw new Error('Failed to fetch quiz result');
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Error fetching quiz result:', error);
        toast.error('Failed to load quiz result');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Result not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="p-8 bg-gray-900/40 border-white/10 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-gray-400 mb-6">{result.title}</p>
          <div className="flex justify-center gap-2 mb-6">
            <Badge>{result.subject}</Badge>
            <Badge variant="secondary">{result.topic}</Badge>
            <Badge variant={result.difficulty === 'EASY' ? 'default' : result.difficulty === 'MEDIUM' ? 'secondary' : 'destructive'}>
              {result.difficulty}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold mb-1">{result.score}%</div>
              <div className="text-sm text-gray-400">Score</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold mb-1">{result.correctAnswers}/{result.totalQuestions}</div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold mb-1">{Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}</div>
              <div className="text-sm text-gray-400">Time</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {result.questions.map((question, index) => (
            <Card key={question.id} className="p-6 bg-white/5 border-white/10">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {question.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Your answer:</span>
                      <span className={question.isCorrect ? 'text-green-500' : 'text-red-500'}>
                        {question.userAnswer}
                      </span>
                    </div>
                    {!question.isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Correct answer:</span>
                        <span className="text-green-500">{question.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                  {question.explanation && (
                    <div className="bg-white/5 p-4 rounded-md">
                      <div className="text-sm text-gray-400 mb-1">Explanation:</div>
                      <div className="text-sm">{question.explanation}</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="bg-white/10 border-white/10 hover:bg-white/20"
        >
          Back to Dashboard
        </Button>
        <Button
          onClick={() => router.push(`/quiz/${result.id}`)}
          className="bg-primary hover:bg-primary/90"
        >
          Retake Quiz
        </Button>
      </div>
    </div>
  );
}
