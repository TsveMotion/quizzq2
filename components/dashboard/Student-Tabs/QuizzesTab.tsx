'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  duration: number;
  dueDate: Date;
  status: 'pending' | 'completed';
  score?: number;
}

interface StudentQuizzesTabProps {
  quizzes: Quiz[];
  onStartQuiz: (id: string) => void;
  onViewResult: (id: string) => void;
  onSearch: (term: string) => void;
  onStatusFilter: (status: string | null) => void;
}

export function StudentQuizzesTab({
  quizzes,
  onStartQuiz,
  onViewResult,
  onSearch,
  onStatusFilter,
}: StudentQuizzesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Quizzes</h2>
          <p className="text-muted-foreground">
            View and take quizzes
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search quizzes..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => onStatusFilter(value === 'all' ? null : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Quizzes</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Subject</p>
                  <p className="text-sm text-muted-foreground capitalize">{quiz.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Teacher</p>
                  <p className="text-sm text-muted-foreground">{quiz.teacher}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{quiz.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm text-muted-foreground">
                    {quiz.dueDate.toLocaleDateString()}
                  </p>
                </div>
                {quiz.status === 'completed' && (
                  <div>
                    <p className="text-sm font-medium">Score</p>
                    <p className="text-sm text-muted-foreground">{quiz.score}%</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                {quiz.status === 'pending' ? (
                  <Button onClick={() => onStartQuiz(quiz.id)}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Quiz
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => onViewResult(quiz.id)}>
                    View Result
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
