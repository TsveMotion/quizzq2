'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Loader2, BookOpen, Trophy } from 'lucide-react';

interface Grade {
  id: string;
  className: string;
  assignmentTitle: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  feedback?: string;
}

export function StudentGradesTab() {
  const { data: session } = useSession();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchGrades = useCallback(async () => {
    setIsLoading(true);
    try {
      const userId = session?.user?.id;
      if (!userId) return;
      const response = await fetch(`/api/student/${userId}/grades`);
      if (!response.ok) throw new Error('Failed to fetch grades');
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast({
        title: "Error",
        description: "Failed to fetch grades",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-500';
    if (grade >= 80) return 'text-blue-500';
    if (grade >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  if (grades.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Grades Found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            You don't have any grades yet.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {grades.map((grade) => (
        <Card key={grade.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">{grade.className}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className={`h-5 w-5 ${getGradeColor(grade.score / grade.maxScore * 100)}`} />
                <span className={`text-lg font-bold ${getGradeColor(grade.score / grade.maxScore * 100)}`}>
                  {(grade.score / grade.maxScore * 100).toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div
                className="flex items-center justify-between border-b py-2 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{grade.assignmentTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    Score: {grade.score}/{grade.maxScore}
                  </p>
                </div>
                <span className={`text-sm font-medium ${getGradeColor(grade.score / grade.maxScore * 100)}`}>
                  {(grade.score / grade.maxScore * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
