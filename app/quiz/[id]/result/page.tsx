'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

interface QuizResult {
  id: string;
  score: number;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  questions: {
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export default function QuizResultPage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) {
      return;
    }

    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/quiz/${params.id}/result`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz result');
        }
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [params?.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-[#0d0d1f] text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#0d0d1f] text-white">
        <p className="text-red-500">{error}</p>
        <Link href="/dashboard/user/quizzes">
          <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">Back to Quizzes</Button>
        </Link>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#0d0d1f] text-white">
        <p>No result found</p>
        <Link href="/dashboard/user/quizzes">
          <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">Back to Quizzes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d1f] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#111827] rounded-lg p-8 mb-8">
          <h1 className="text-2xl font-bold text-center text-[#3b82f6] mb-6">Quiz Results</h1>
          <div className="text-center">
            <p className="text-6xl font-bold text-[#3b82f6] mb-2">{result.score}%</p>
            <p className="text-gray-400">
              {result.correctAnswers} correct out of {result.totalQuestions} questions
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {result.questions.map((q, index) => (
            <div key={index} className="bg-[#111827] rounded-lg p-6">
              <div className="flex items-start gap-4">
                {!q.isCorrect && (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className="text-white mb-4">Question {index + 1}</h3>
                  <p className="text-white mb-4">{q.question}</p>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-400">Your answer: </span>
                      <span className={q.isCorrect ? 'text-green-500' : 'text-red-500'}>
                        {q.userAnswer}
                      </span>
                    </p>
                    {!q.isCorrect && (
                      <p>
                        <span className="text-gray-400">Correct answer: </span>
                        <span className="text-green-500">{q.correctAnswer}</span>
                      </p>
                    )}
                    <div className="mt-4">
                      <p className="text-[#3b82f6] mb-2">Explanation:</p>
                      <p className="text-gray-400 bg-[#1a2234] p-4 rounded">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/dashboard/user/quizzes">
            <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">Back to Quizzes</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
