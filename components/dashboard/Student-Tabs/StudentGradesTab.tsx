'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, BookOpen, Trophy } from 'lucide-react';

interface Grade {
  id: string;
  className: string;
  overallGrade: number;
  assignments: {
    title: string;
    grade: number;
    weight: number;
  }[];
}

export default function StudentGradesTab() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchGrades = useCallback(async () => {
    try {
      if (!session?.user?.id) return;
      const response = await fetch(`/api/student/${session.user.id}/grades`);
      if (!response.ok) throw new Error('Failed to fetch grades');
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('Failed to fetch grades');
    }
  }, [session?.user?.id, toast]);

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
                <Trophy className={`h-5 w-5 ${getGradeColor(grade.overallGrade)}`} />
                <span className={`text-lg font-bold ${getGradeColor(grade.overallGrade)}`}>
                  {grade.overallGrade}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {grade.assignments.map((assignment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Weight: {assignment.weight}%
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${getGradeColor(assignment.grade)}`}>
                    {assignment.grade}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
